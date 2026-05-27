import { useState, useEffect, useMemo, useRef } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Modal,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid } from '@mui/x-data-grid';
import { fetchArticles, createArticle, updateArticle } from '../../services/ArticleService';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES = ['active', 'inactive'];

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 660,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 1,
};

const BLANK_FORM = {
    slug: '',
    title: '',
    imageUrl: '',
    content: '',
    isFeatured: false,
    isActive: true,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const labelize = (value) =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';

const shortId = (id) => id ? String(id).slice(-6).toUpperCase() : '';

// ─── Component ───────────────────────────────────────────────────────────────

const DashArticleListPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modal, setModal] = useState({ open: false, id: null });
    const [form, setForm] = useState({ ...BLANK_FORM });
    const [formErrors, setFormErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    // Search & filter state
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterFeatured, setFilterFeatured] = useState('');

    // Hidden file input ref
    const fileInputRef = useRef(null);

    // ─── Data Loading ─────────────────────────────────────────────────────────

    const loadArticles = async () => {
        try {
            setLoading(true);
            const { data } = await fetchArticles();
            setArticles(data.articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    // ─── Cloudinary Upload ────────────────────────────────────────────────────

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            const data = await res.json();
            if (data.secure_url) {
                setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
            } else {
                console.error('Cloudinary upload failed:', data);
            }
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            // Reset file input so same file can be re-uploaded
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // ─── Modal Handlers ───────────────────────────────────────────────────────

    const openModal = (article = null) => {
        setModal({ open: true, id: article?._id ?? null });
        setForm(article ? {
            slug: article.slug ?? '',
            title: article.title ?? '',
            imageUrl: article.imageUrl ?? '',
            content: Array.isArray(article.content)
                ? article.content.join('\n\n')
                : article.content ?? '',
            isFeatured: article.isFeatured ?? false,
            isActive: article.isActive ?? true,
        } : { ...BLANK_FORM });
        setFormErrors({});
    };

    const closeModal = () => {
        setModal({ open: false, id: null });
        setForm({ ...BLANK_FORM });
        setFormErrors({});
    };

    // ─── Form Handlers ────────────────────────────────────────────────────────

    const handleChange = ({ target: { name, value, checked, type } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const nextErrors = {};

        if (!form.slug.trim()) nextErrors.slug = 'Slug is required.';
        if (!form.title.trim()) nextErrors.title = 'Title is required.';
        if (!form.content.trim()) nextErrors.content = 'Content is required.';

        if (!nextErrors.slug && !/^[a-z0-9-]+$/.test(form.slug.trim())) {
            nextErrors.slug = 'Use lowercase letters, numbers, and hyphens only.';
        }

        return nextErrors;
    };

    const handleSaveArticle = async (event) => {
        event.preventDefault();
        const nextErrors = validate();

        if (Object.keys(nextErrors).length) {
            setFormErrors(nextErrors);
            return;
        }

        try {
            const paragraphsArray = form.content
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean);

            const payload = {
                slug: form.slug.trim(),
                title: form.title.trim(),
                imageUrl: form.imageUrl.trim(),
                content: paragraphsArray,
                paragraphs: paragraphsArray.length,
                preview: paragraphsArray[0] ?? '',
                isFeatured: form.isFeatured,
                isActive: form.isActive,
            };

            if (modal.id) {
                await updateArticle(modal.id, payload);
            } else {
                await createArticle(payload);
            }

            await loadArticles();
            closeModal();
        } catch (error) {
            console.error('Error saving article:', error);
        }
    };

    // ─── Toggle Active ────────────────────────────────────────────────────────

    const handleToggleActive = async (id, isActive) => {
        try {
            await updateArticle(id, { isActive: !isActive });
            await loadArticles();
        } catch (error) {
            console.error('Error toggling article status:', error);
        }
    };

    // ─── Search & Filter ──────────────────────────────────────────────────────

    const filteredArticles = useMemo(() => {
        const q = search.trim().toLowerCase();
        return articles.filter((article) => {
            const matchesSearch =
                !q ||
                article.slug?.toLowerCase().includes(q) ||
                article.title?.toLowerCase().includes(q) ||
                article.preview?.toLowerCase().includes(q);
            const matchesStatus =
                !filterStatus ||
                (filterStatus === 'active' && article.isActive) ||
                (filterStatus === 'inactive' && !article.isActive);
            const matchesFeatured =
                !filterFeatured ||
                (filterFeatured === 'featured' && article.isFeatured) ||
                (filterFeatured === 'standard' && !article.isFeatured);
            return matchesSearch && matchesStatus && matchesFeatured;
        });
    }, [articles, search, filterStatus, filterFeatured]);

    // ─── Columns ──────────────────────────────────────────────────────────────

    const columns = [
        {
            field: '_id',
            headerName: 'ID',
            minWidth: 90,
            valueGetter: (_, row) => shortId(row._id),
        },
        { field: 'slug', headerName: 'Slug', minWidth: 150 },
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 150 },
        { field: 'paragraphs', headerName: 'Paragraphs', minWidth: 120 },
        { field: 'preview', headerName: 'Preview', flex: 2, minWidth: 200 },
        {
            field: 'isFeatured',
            headerName: 'Featured',
            minWidth: 120,
            sortable: false,
            renderCell: ({ row }) => (
                <Chip
                    size="small"
                    label={row.isFeatured ? 'Featured' : 'Standard'}
                    sx={{
                        backgroundColor: row.isFeatured ? '#606c38' : undefined,
                        color: row.isFeatured ? 'white' : undefined,
                    }}
                    variant={row.isFeatured ? 'filled' : 'outlined'}
                />
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 110,
            sortable: false,
            renderCell: ({ row }) => (
                <Chip
                    size="small"
                    label={row.isActive ? 'Active' : 'Inactive'}
                    sx={{
                        backgroundColor: row.isActive ? '#90a955' : undefined,
                        color: row.isActive ? 'white' : undefined,
                    }}
                    variant={row.isActive ? 'filled' : 'outlined'}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 200,
            sortable: false,
            renderCell: ({ row }) => (
                <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openModal(row)}
                        sx={{
                            color: '#283618',
                            borderColor: '#283618',
                            '&:hover': { backgroundColor: '#f0f4e8', borderColor: '#283618' },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleToggleActive(row._id, row.isActive)}
                        sx={{
                            backgroundColor: row.isActive ? '#ffb700' : '#90a955',
                            color: '#fff',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: row.isActive ? '#e0a200' : '#7a9447',
                            },
                        }}
                    >
                        {row.isActive ? 'Disable' : 'Activate'}
                    </Button>
                </Stack>
            ),
        },
    ];

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Stack
                direction="row"
                sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Articles
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => openModal()}
                    sx={{
                        backgroundColor: '#283618',
                        color: '#fff',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#3a4f22' },
                    }}
                >
                    Add Article
                </Button>
            </Stack>

            {/* Search & Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems="center">
                <TextField
                    label="Search Articles"
                    placeholder="Slug, title, or preview"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ minWidth: 300, flexGrow: 1 }}
                />
                <TextField
                    label="Status Filter"
                    select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All Statuses</MenuItem>
                    {STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>{labelize(s)}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Featured Filter"
                    select
                    value={filterFeatured}
                    onChange={(e) => setFilterFeatured(e.target.value)}
                    size="small"
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="">All Articles</MenuItem>
                    <MenuItem value="featured">Featured</MenuItem>
                    <MenuItem value="standard">Standard</MenuItem>
                </TextField>
            </Stack>

            {/* Data Grid */}
            <Box sx={{ height: 500, width: '100%', mb: 5 }}>
                <DataGrid
                    rows={filteredArticles}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    pageSizeOptions={[10, 20, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
                            outline: 'none',
                        },
                    }}
                />
            </Box>

            {/* Add/Edit Modal */}
            <Modal
                keepMounted
                open={modal.open}
                onClose={closeModal}
                aria-labelledby="article-modal-title"
            >
                <Box component="form" onSubmit={handleSaveArticle} sx={MODAL_STYLE}>
                    <Typography id="article-modal-title" variant="h5" component="h2" sx={{ mb: 3 }}>
                        {modal.id ? 'Edit Article' : 'Add Article'}
                    </Typography>

                    <Stack spacing={2}>
                        {/* Row 1: Slug + Title */}
                        <Stack direction="row" spacing={2}>
                            <TextField
                                name="slug"
                                label="Article Slug"
                                value={form.slug}
                                onChange={handleChange}
                                error={Boolean(formErrors.slug)}
                                helperText={formErrors.slug || 'Use lowercase letters, numbers, and hyphens only.'}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                name="title"
                                label="Title"
                                value={form.title}
                                onChange={handleChange}
                                error={Boolean(formErrors.title)}
                                helperText={formErrors.title}
                                fullWidth
                                variant="outlined"
                            />
                        </Stack>

                        {/* Image Upload */}
                        <Box>
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />

                            {/* Upload area */}
                            <Box
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                sx={{
                                    border: '2px dashed',
                                    borderColor: form.imageUrl ? '#90a955' : '#283618',
                                    borderRadius: 2,
                                    p: 2,
                                    textAlign: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    backgroundColor: form.imageUrl ? '#f0f4e8' : '#fafafa',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: uploading ? undefined : '#f0f4e8',
                                        borderColor: uploading ? undefined : '#90a955',
                                    },
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {form.imageUrl ? (
                                    /* Image preview inside the upload area */
                                    <Box sx={{ position: 'relative' }}>
                                        <Box
                                            component="img"
                                            src={form.imageUrl}
                                            alt="Preview"
                                            sx={{
                                                width: '100%',
                                                maxHeight: 200,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                                display: 'block',
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0,0,0,0.4)',
                                                opacity: 0,
                                                borderRadius: 1,
                                                transition: 'opacity 0.2s',
                                                '&:hover': { opacity: 1 },
                                            }}
                                        >
                                            <Stack alignItems="center" spacing={0.5}>
                                                <CloudUploadIcon sx={{ color: '#fff', fontSize: 32 }} />
                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                                                    Click to change image
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Box>
                                ) : (
                                    /* Empty upload prompt */
                                    <Stack alignItems="center" spacing={1} sx={{ py: 2 }}>
                                        {uploading ? (
                                            <>
                                                <CircularProgress size={32} sx={{ color: '#283618' }} />
                                                <Typography variant="body2" sx={{ color: '#283618', fontWeight: 600 }}>
                                                    Uploading...
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <CloudUploadIcon sx={{ fontSize: 40, color: '#283618' }} />
                                                <Typography variant="body2" sx={{ color: '#283618', fontWeight: 600 }}>
                                                    Click to upload image
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    PNG, JPG, JPEG, WEBP supported
                                                </Typography>
                                            </>
                                        )}
                                    </Stack>
                                )}
                            </Box>

                            {/* URL field below upload area */}
                            <TextField
                                name="imageUrl"
                                label="Image URL"
                                value={form.imageUrl}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                placeholder="Auto-filled after upload, or paste a URL manually"
                                size="small"
                                sx={{ mt: 1.5 }}
                            />
                        </Box>

                        {/* Content */}
                        <TextField
                            name="content"
                            label="Content"
                            value={form.content}
                            onChange={handleChange}
                            error={Boolean(formErrors.content)}
                            helperText={formErrors.content || 'Separate paragraphs with a blank line.'}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={8}
                        />

                        {/* Featured Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isFeatured"
                                    checked={form.isFeatured}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#283618' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#90a955' },
                                    }}
                                />
                            }
                            label={form.isFeatured ? 'Featured article: Yes' : 'Featured article: No'}
                        />

                        {/* Status Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#283618' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#90a955' },
                                    }}
                                />
                            }
                            label={form.isActive ? 'Article status: Active' : 'Article status: Inactive'}
                        />
                    </Stack>

                    {/* Modal Actions */}
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                        <Button
                            variant="text"
                            onClick={closeModal}
                            sx={{ color: '#283618' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#283618',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#3a4f22' },
                            }}
                        >
                            {modal.id ? 'Save Article' : 'Save Article'}
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default DashArticleListPage;
import { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Chip,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Modal,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DataGrid } from '@mui/x-data-grid';
import { fetchUsers, createUser, updateUser } from '../../services/UserService';

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = ['admin', 'editor', 'viewer'];
const GENDERS = ['Male', 'Female'];
const STATUSES = ['active', 'inactive'];

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 1,
};

const BLANK_FORM = {
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    type: 'editor',
    username: '',
    password: '',
    address: '',
    isActive: true,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const labelize = (value) =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';

// ─── Component ───────────────────────────────────────────────────────────────

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modal, setModal] = useState({ open: false, id: null });
    const [form, setForm] = useState({ ...BLANK_FORM });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Search & filter state
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // ─── Data Loading ─────────────────────────────────────────────────────────

    const loadUsers = async () => {
        try {
            setLoading(true);
            const { data } = await fetchUsers();
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // ─── Modal Handlers ───────────────────────────────────────────────────────

    const openModal = (user = null) => {
        setModal({ open: true, id: user?._id ?? null });
        setForm(user ? { ...BLANK_FORM, ...user, password: '' } : { ...BLANK_FORM });
        setFormErrors({});
        setShowPassword(false);
    };

    const closeModal = () => {
        setModal({ open: false, id: null });
        setForm({ ...BLANK_FORM });
        setFormErrors({});
        setShowPassword(false);
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
        const email = form.email.trim().toLowerCase();
        const username = form.username.trim().toLowerCase();

        const requiredFields = [
            ['firstName', 'First name'],
            ['lastName', 'Last name'],
            ['age', 'Age'],
            ['gender', 'Gender'],
            ['contactNumber', 'Contact number'],
            ['email', 'Email'],
            ['type', 'Type'],
            ['username', 'Username'],
            ['password', 'Password'],
            ['address', 'Address'],
        ];

        requiredFields.forEach(([key, label]) => {
            if (!String(form[key]).trim()) {
                nextErrors[key] = `${label} is required.`;
            }
        });

        if (!nextErrors.age && !/^\d+$/.test(form.age.trim())) {
            nextErrors.age = 'Age must be a number only.';
        }

        if (!nextErrors.contactNumber && !/^\d{11}$/.test(form.contactNumber.trim())) {
            nextErrors.contactNumber = 'Contact number must be exactly 11 digits.';
        }

        if (!nextErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!nextErrors.email && users.some((u) => u._id !== modal.id && u.email === email)) {
            nextErrors.email = 'Email address already exists.';
        }

        if (!nextErrors.password && form.password.length < 8) {
            nextErrors.password = 'Password must be at least 8 characters.';
        }

        if (!nextErrors.username && /\s/.test(form.username)) {
            nextErrors.username = 'Username must not contain spaces.';
        }

        if (!nextErrors.username && users.some((u) => u._id !== modal.id && u.username === username)) {
            nextErrors.username = 'Username already exists.';
        }

        return nextErrors;
    };

    const handleSaveUser = async (event) => {
        event.preventDefault();
        const nextErrors = validate();

        if (Object.keys(nextErrors).length) {
            setFormErrors(nextErrors);
            return;
        }

        try {
            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                age: form.age.trim(),
                gender: form.gender.trim(),
                contactNumber: form.contactNumber.trim(),
                email: form.email.trim().toLowerCase(),
                type: form.type.trim().toLowerCase(),
                username: form.username.trim().toLowerCase(),
                address: form.address.trim(),
                isActive: form.isActive,
                ...(form.password ? { password: form.password } : {}),
            };

            if (modal.id) {
                await updateUser(modal.id, payload);
            } else {
                await createUser(payload);
            }

            await loadUsers();
            closeModal();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    // ─── Toggle Active ────────────────────────────────────────────────────────

    const handleToggleActive = async (id, isActive) => {
        try {
            await updateUser(id, { isActive: !isActive });
            await loadUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    // ─── Search & Filter ──────────────────────────────────────────────────────

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((user) => {
            const matchesSearch =
                !q ||
                user.firstName?.toLowerCase().includes(q) ||
                user.lastName?.toLowerCase().includes(q) ||
                user.email?.toLowerCase().includes(q) ||
                user.username?.toLowerCase().includes(q);
            const matchesRole = !filterRole || user.type === filterRole;
            const matchesGender = !filterGender || user.gender === filterGender;
            const matchesStatus =
                !filterStatus ||
                (filterStatus === 'active' && user.isActive) ||
                (filterStatus === 'inactive' && !user.isActive);
            return matchesSearch && matchesRole && matchesGender && matchesStatus;
        });
    }, [users, search, filterRole, filterGender, filterStatus]);

    const clearFilters = () => {
        setSearch('');
        setFilterRole('');
        setFilterGender('');
        setFilterStatus('');
    };

    // ─── Field Helper ─────────────────────────────────────────────────────────

    const fieldProps = (name, label, extra = {}) => ({
        name,
        label,
        value: form[name],
        onChange: handleChange,
        error: Boolean(formErrors[name]),
        helperText: formErrors[name],
        fullWidth: true,
        variant: 'outlined',
        ...extra,
    });

    // ─── Columns ──────────────────────────────────────────────────────────────

    const columns = [
        {
            field: 'fullName',
            headerName: 'Name',
            flex: 1,
            minWidth: 160,
            valueGetter: (_, row) => `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim(),
        },
        { field: 'age', headerName: 'Age', minWidth: 80 },
        { field: 'gender', headerName: 'Gender', minWidth: 100 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        {
            field: 'type',
            headerName: 'Type',
            minWidth: 110,
            valueGetter: (_, row) => labelize(row.type),
        },
        { field: 'contactNumber', headerName: 'Contact', minWidth: 140 },
        { field: 'username', headerName: 'Username', minWidth: 130 },
        { field: 'address', headerName: 'Address', flex: 1, minWidth: 150 },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 110,
            sortable: false,
            renderCell: ({ row }) => (
                <Chip
                    size="small"
                    label={row.isActive ? 'Active' : 'Inactive'}
                    color={row.isActive ? 'success' : 'default'}
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
                <Typography variant="h2" fontWeight="bold">
                    Users
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
                    Add User
                </Button>
            </Stack>

            {/* Search & Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Search"
                    placeholder="Name, email, or username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ minWidth: 220 }}
                />
                <TextField
                    label="Role"
                    select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    size="small"
                    sx={{ minWidth: 130 }}
                >
                    <MenuItem value="">All Roles</MenuItem>
                    {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>{labelize(r)}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Gender"
                    select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    size="small"
                    sx={{ minWidth: 130 }}
                >
                    <MenuItem value="">All Genders</MenuItem>
                    {GENDERS.map((g) => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Status"
                    select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    size="small"
                    sx={{ minWidth: 130 }}
                >
                    <MenuItem value="">All Statuses</MenuItem>
                    {STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>{labelize(s)}</MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="outlined"
                    onClick={clearFilters}
                    sx={{
                        color: '#283618',
                        borderColor: '#283618',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#f0f4e8', borderColor: '#283618' },
                    }}
                >
                    Clear Filters
                </Button>
            </Stack>

            {/* Data Grid */}
            <Box sx={{ height: 500, width: '100%', mb: 5 }}>
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    pageSizeOptions={[10, 20, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    disableRowSelectionOnClick
                />
            </Box>

            {/* Add/Edit Modal */}
            <Modal
                keepMounted
                open={modal.open}
                onClose={closeModal}
                aria-labelledby="user-modal-title"
                aria-describedby="user-modal-description"
            >
                <Box component="form" onSubmit={handleSaveUser} sx={MODAL_STYLE}>
                    <Typography id="user-modal-title" variant="h5" component="h2" sx={{ mb: 3 }}>
                        {modal.id ? 'Edit User' : 'Add User'}
                    </Typography>

                    <Stack spacing={2}>
                        {/* Row 1: First Name + Last Name */}
                        <Stack direction="row" spacing={2}>
                            <TextField {...fieldProps('firstName', 'First Name', { variant: 'outlined' })} />
                            <TextField {...fieldProps('lastName', 'Last Name', { variant: 'outlined' })} />
                        </Stack>

                        {/* Row 2: Age + Gender */}
                        <Stack direction="row" spacing={2}>
                            <TextField {...fieldProps('age', 'Age', { variant: 'outlined' })} />
                            <TextField {...fieldProps('gender', 'Gender', { select: true, variant: 'outlined' })}>
                                {GENDERS.map((g) => (
                                    <MenuItem key={g} value={g}>{g}</MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        {/* Row 3: Contact Number + Email Address */}
                        <Stack direction="row" spacing={2}>
                            <TextField {...fieldProps('contactNumber', 'Contact Number', { variant: 'outlined' })} />
                            <TextField {...fieldProps('email', 'Email Address', { type: 'email', variant: 'outlined' })} />
                        </Stack>

                        {/* Row 4: Role + Username */}
                        <Stack direction="row" spacing={2}>
                            <TextField {...fieldProps('type', 'Role', { select: true, variant: 'outlined' })}>
                                {ROLES.map((role) => (
                                    <MenuItem key={role} value={role}>{labelize(role)}</MenuItem>
                                ))}
                            </TextField>
                            <TextField {...fieldProps('username', 'Username', { variant: 'outlined' })} />
                        </Stack>

                        {/* Password - full width */}
                        <TextField
                            {...fieldProps('password', 'Password', {
                                variant: 'outlined',
                                type: showPassword ? 'text' : 'password',
                                InputProps: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            })}
                        />

                        {/* Address - full width multiline */}
                        <TextField {...fieldProps('address', 'Address', { variant: 'outlined', multiline: true, rows: 3 })} />

                        {/* isActive Toggle */}
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
                            label={form.isActive ? 'User status: Active' : 'User status: Inactive'}
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
                            {modal.id ? 'Save User' : 'Save User'}
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    );
};

export default UsersPage;
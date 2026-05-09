import { useState, useMemo } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DataGrid } from '@mui/x-data-grid';
import usersSeed from '../../data/users.json?raw';

const roles = ['admin', 'editor', 'viewer'];
const genders = ['male', 'female', 'other'];
const statuses = ['active', 'inactive'];

const blankForm = {
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    role: 'editor',
    username: '',
    password: '',
    address: '',
    isActive: true,
};

const labelize = (value) =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';

const loadUsers = () => {
    try {
        return {
            users: JSON.parse(usersSeed).map((user, index) => ({
                id: Number(user.id) || index + 1,
                firstName: String(user.firstName ?? '').trim(),
                lastName: String(user.lastName ?? '').trim(),
                age: String(user.age ?? '').trim(),
                gender: genders.includes(String(user.gender ?? '').trim().toLowerCase())
                    ? String(user.gender ?? '').trim().toLowerCase()
                    : '',
                contactNumber: String(user.contactNumber ?? '').trim(),
                email: String(user.email ?? '').trim().toLowerCase(),
                role: roles.includes(String(user.role ?? '').trim().toLowerCase())
                    ? String(user.role ?? '').trim().toLowerCase()
                    : 'editor',
                username: String(user.username ?? '').trim().toLowerCase(),
                password: String(user.password ?? '').trim(),
                address: String(user.address ?? '').trim(),
                isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
            })),
            error: '',
        };
    } catch {
        return {
            users: [],
            error: 'Unable to read users from src/assets/users.json.',
        };
    }
};

const seed = loadUsers();

const UsersPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [users, setUsers] = useState(seed.users);
    const [modal, setModal] = useState({ open: false, id: null });
    const [form, setForm] = useState(blankForm);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // Enhancement 2: Search and filter state
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const resetForm = () => {
        setForm({ ...blankForm });
        setErrors({});
    };

    const openModal = (user) => {
        setModal({ open: true, id: user?.id ?? null });
        setForm(user ? { ...blankForm, ...user } : { ...blankForm });
        setErrors({});
    };

    const closeModal = () => {
        setModal({ open: false, id: null });
        setShowPassword(false);
        resetForm();
    };

    const handleChange = ({ target: { name, value, checked, type } }) => {
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const nextErrors = {};
        const email = form.email.trim().toLowerCase();
        const username = form.username.trim().toLowerCase();

        [
            ['firstName', 'First name'],
            ['lastName', 'Last name'],
            ['age', 'Age'],
            ['gender', 'Gender'],
            ['contactNumber', 'Contact number'],
            ['role', 'Role'],
            ['username', 'Username'],
            ['password', 'Password'],
            ['address', 'Address'],
        ].forEach(([key, label]) => {
            if (!String(form[key]).trim()) {
                nextErrors[key] = `${label} is required.`;
            }
        });

        // Enhancement 3: Improved form validation
        if (!nextErrors.age && !/^\d+$/.test(form.age.trim())) {
            nextErrors.age = 'Age must be a number only.';
        }

        if (!nextErrors.contactNumber && !/^\d{11}$/.test(form.contactNumber.trim())) {
            nextErrors.contactNumber = 'Contact number must be exactly 11 digits.';
        }

        if (!nextErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!nextErrors.email && users.some((user) => user.id !== modal.id && user.email === email)) {
            nextErrors.email = 'Email address already exists.';
        }

        if (!nextErrors.password && form.password.length < 8) {
            nextErrors.password = 'Password must be at least 8 characters.';
        }

        if (!nextErrors.username && /\s/.test(form.username)) {
            nextErrors.username = 'Username must not contain spaces.';
        }

        if (!nextErrors.username && users.some((user) => user.id !== modal.id && user.username === username)) {
            nextErrors.username = 'Username already exists.';
        }

        return nextErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const nextErrors = validate();

        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        const nextUser = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            age: form.age.trim(),
            gender: form.gender.trim().toLowerCase(),
            contactNumber: form.contactNumber.trim(),
            email: form.email.trim().toLowerCase(),
            role: form.role.trim().toLowerCase(),
            username: form.username.trim().toLowerCase(),
            password: form.password,
            address: form.address.trim(),
            isActive: form.isActive,
        };

        setUsers((prev) =>
            modal.id
                ? prev.map((user) => (user.id === modal.id ? { ...user, ...nextUser } : user))
                : [
                    ...prev,
                    {
                        id: prev.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1,
                        ...nextUser,
                    },
                ]
        );

        closeModal();
    };

    const toggleStatus = (id) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === id ? { ...user, isActive: !user.isActive } : user
            )
        );
    };

    const fieldProps = (name, label, extra = {}) => ({
        name,
        label,
        value: form[name],
        onChange: handleChange,
        error: Boolean(errors[name]),
        helperText: errors[name],
        fullWidth: true,
        ...extra,
    });

    // Enhancement 2: Filtered users
    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((user) => {
            const matchesSearch =
                !q ||
                user.firstName.toLowerCase().includes(q) ||
                user.lastName.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q) ||
                user.username.toLowerCase().includes(q);
            const matchesRole = !filterRole || user.role === filterRole;
            const matchesGender = !filterGender || user.gender === filterGender;
            const matchesStatus =
                !filterStatus ||
                (filterStatus === 'active' && user.isActive) ||
                (filterStatus === 'inactive' && !user.isActive);
            return matchesSearch && matchesRole && matchesGender && matchesStatus;
        });
    }, [users, search, filterRole, filterGender, filterStatus]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 88 },
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 1,
            minWidth: 170,
            valueGetter: (_, row) => `${row.firstName} ${row.lastName}`.trim(),
        },
        { field: 'username', headerName: 'Username', minWidth: 150 },
        {
            field: 'age', headerName: 'Age', minWidth: 90,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            minWidth: 110,
            valueGetter: (_, row) => labelize(row.gender),
        },
        { field: 'contactNumber', headerName: 'Contact Number', minWidth: 160 },
        { field: 'email', headerName: 'Email', flex: 1.1, minWidth: 220 },
        {
            field: 'role',
            headerName: 'Role',
            minWidth: 120,
            valueGetter: (_, row) => labelize(row.role),
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            sortable: false,
            filterable: false,
            renderCell: (({ row }) => (
                <Chip
                    size="small"
                    label={row.isActive ? 'Active' : 'Inactive'}
                    color={row.isActive ? 'success' : 'default'}
                    sx={{ backgroundColor: row.isActive ? '#90a955' : undefined, color: row.isActive ? 'white' : undefined }}
                    variant={row.isActive ? 'filled' : 'outlined'}
                />
            )),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 200,
            sortable: false,
            filterable: false,
            renderCell: (({ row }) => (
                <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openModal(row)}>
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        color={row.isActive ? 'warning' : 'success'}
                        sx={{ backgroundColor: row.isActive ? '#ffb700' : '#90a955', color: 'white', borderColor: 'transparent' }}
                        onClick={() => toggleStatus(row.id)}
                    >
                        {row.isActive ? 'Disable' : 'Activate'}
                    </Button>
                </Stack>
            )),
        },
    ];

    return (
        <Box sx={{ width: '100%', minWidth: 0 }}>
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Typography variant="h4">Users</Typography>
                <Button
                    variant="contained"
                    onClick={() => openModal()}
                    sx={{ width: { xs: '100%', sm: 'auto' }, backgroundColor: '#283618', '&:hover': { backgroundColor: '#90a955' } }}
                >
                    Add User
                </Button>
            </Box>

            {/* Enhancement 2: Search bar and filters */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 2, flexWrap: 'wrap' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
            >
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
                    {roles.map((r) => (
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
                    {genders.map((g) => (
                        <MenuItem key={g} value={g}>{labelize(g)}</MenuItem>
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
                    {statuses.map((s) => (
                        <MenuItem key={s} value={s}>{labelize(s)}</MenuItem>
                    ))}
                </TextField>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearch('');
                        setFilterRole('');
                        setFilterGender('');
                        setFilterStatus('');
                    }}
                    sx={{ color: '#283618', borderColor: '#283618', '&:hover': { borderColor: '#90a955', color: '#90a955' } }}
                >
                    Clear Filters
                </Button>
            </Stack>

            {seed.error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {seed.error}
                </Alert>
            ) : null}

            <Paper sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0, overflow: 'auto' }}>
                {users.length ? (
                    <Box sx={{ height: { xs: 460, sm: 520 }, width: '100%', minWidth: 0 }}>
                        <DataGrid
                            rows={filteredUsers}
                            columns={columns}
                            disableRowSelectionOnClick
                            pageSizeOptions={[5, 10]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5, page: 0 } },
                            }}
                            sx={{
                                minWidth: 0,
                                '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
                                    outline: 'none',
                                },
                            }}
                        />
                    </Box>
                ) : (
                    <Alert severity="info">
                        No users found. Use Add User to create your first record.
                    </Alert>
                )}
            </Paper>

            <Dialog
                open={modal.open}
                onClose={closeModal}
                fullWidth
                fullScreen={isMobile}
                maxWidth="md"
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle>{modal.id ? 'Edit User' : 'Add User'}</DialogTitle>
                    <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
                        <Stack spacing={1} sx={{ pt: 1 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <TextField {...fieldProps('firstName', 'First Name')} />
                                <TextField {...fieldProps('lastName', 'Last Name')} />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <TextField {...fieldProps('age', 'Age')} />
                                <TextField {...fieldProps('gender', 'Gender', { select: true })}>
                                    {genders.map((gender) => (
                                        <MenuItem key={gender} value={gender}>
                                            {labelize(gender)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <TextField {...fieldProps('contactNumber', 'Contact Number')} />
                                <TextField {...fieldProps('email', 'Email Address', { type: 'email' })} />
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="flex-start">
                                <TextField {...fieldProps('role', 'Role', { select: true })}>
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {labelize(role)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField {...fieldProps('username', 'Username')} />
                            </Stack>
                            <TextField
                                {...fieldProps('password', 'Password', {
                                    type: showPassword ? 'text' : 'password',
                                    slotProps: {
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    },
                                })}
                            />
                            <TextField {...fieldProps('address', 'Address', { multiline: true, rows: 3 })} />
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
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={closeModal} sx={{ color: '#283618' }}>Cancel</Button>
                        <Button type="submit" variant="contained"
                            sx={{ backgroundColor: '#283618', '&:hover': { backgroundColor: '#90a955' } }}>
                            {modal.id ? 'Update User' : 'Save User'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
};

export default UsersPage;
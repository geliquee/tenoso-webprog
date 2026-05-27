import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { createUser } from '../../services/UserService';

const inputClasses =
    'mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        try {
            setLoading(true);

            // Enhancement 3: Create user via API so they can log in
            // New users from SignUp default to 'viewer' role
            await createUser({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                type: 'viewer',
                // Required fields — set defaults for self-registered users
                age: '',
                gender: '',
                contactNumber: '',
                username: form.email.trim().toLowerCase().split('@')[0],
                address: '',
                isActive: true,
            });

            navigate('/auth/signin');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Join the Collection!
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
                Create your account and start tracking every Smiski you own, want, and discover along the way.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="text-sm font-medium text-zinc-700">
                            First Name
                        </label>
                        <input
                            id="first-name"
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            autoComplete="given-name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label htmlFor="last-name" className="text-sm font-medium text-zinc-700">
                            Last Name
                        </label>
                        <input
                            id="last-name"
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            autoComplete="family-name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="signup-email" className="text-sm font-medium text-zinc-700">
                        Email
                    </label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="signup-password" className="text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                    />
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                        Use a secure password with letters, numbers, and symbols.
                    </p>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className={actionButtonClassName}
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <Button type="button" variant="secondary" className={actionButtonClassName}>
                        Sign Up with Google
                    </Button>
                    <Button type="button" variant="secondary" className={actionButtonClassName}>
                        Sign Up with Apple
                    </Button>
                </div>
            </form>

            <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
                Already part of the community?{' '}
                <Link
                    to="/auth/signin"
                    className="font-semibold text-zinc-900 transition hover:text-zinc-600"
                >
                    Sign Back In
                </Link>
            </div>
        </>
    );
};

export default SignUpPage;
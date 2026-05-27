import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { loginUser } from '../../services/UserService';

const inputClasses =
    'mt-2 w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-zinc-50';

const actionButtonClassName = 'w-full rounded-xl py-3 text-[11px] tracking-[0.2em]';

const SignInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Enhancement 1: Block viewers from logging in
        try {
            setLoading(true);
            const { data } = await loginUser({ email, password });

            // Enhancement 1: viewers cannot log in to dashboard
            if (data.type === 'viewer') {
                setError('Viewers are not allowed to access the dashboard.');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('firstName', data.firstName);
            localStorage.setItem('type', data.type);

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Welcome Back, Collector!
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
                Sign in to discover new series, what to collect next, and never miss a glowing little companion.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="signin-email" className="text-sm font-medium text-zinc-700">
                        Email Address
                    </label>
                    <input
                        id="signin-email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="signin-password" className="text-sm font-medium text-zinc-700">
                        Password
                    </label>
                    <input
                        id="signin-password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClasses}
                    />
                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                        It must be a combination of minimum 8 letters, numbers, and symbols.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                    <label className="flex items-center gap-2 text-zinc-600">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
                        />
                        <span>Remember me</span>
                    </label>
                    <button
                        type="button"
                        className="font-medium text-zinc-700 transition hover:text-zinc-900"
                    >
                        Forgot Password?
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className={actionButtonClassName}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Log In'}
                </Button>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <Button type="button" variant="secondary" className={actionButtonClassName}>
                        Log In with Google
                    </Button>
                    <Button type="button" variant="secondary" className={actionButtonClassName}>
                        Log In with Apple
                    </Button>
                </div>
            </form>

            <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
                New to the Smiski community?{' '}
                <Link
                    to="/auth/signup"
                    className="font-semibold text-zinc-900 transition hover:text-zinc-600"
                >
                    Sign Up
                </Link>
            </div>
        </>
    );
};

export default SignInPage;
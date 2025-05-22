import { useState } from 'react';
import { FiFacebook, FiGithub, FiLock, FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { BsGoogle } from 'react-icons/bs';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signInWithGoogle, signInWithFacebook, signInWithGithub } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            navigate('/');
        } catch (error) {
            setEmail(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            setLoading(true);
            await signInWithFacebook();
            navigate('/');
        } catch (error) {
            setEmail(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        try {
            setLoading(true);
            await signInWithGithub();
            navigate('/');
        } catch (error) {
            setEmail(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-800">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 slide-up">
                    {error && (
                        <div className="mb-4 bg-error-500 bg-opacity-10 text-error-500 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
          
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-neutral-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-neutral-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full flex justify-center"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                            >
                                <BsGoogle className="text-[#4285F4]" size={20} />
                            </button>

                            <button
                                onClick={handleFacebookLogin}
                                disabled={loading}
                                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                            >
                                <FiFacebook className="text-[#3b5998]" size={20} />
                            </button>

                            <button
                                onClick={handleGithubLogin}
                                disabled={loading}
                                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                            >
                                <FiGithub size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login

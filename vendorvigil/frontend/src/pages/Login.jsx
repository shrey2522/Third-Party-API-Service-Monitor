import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-gray-900 bg-none dark:bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center transition-colors duration-300">
        {/* Overlay - Only for dark mode image */}
        <div className="absolute inset-0 dark:bg-gray-900/40 backdrop-blur-sm hidden dark:block"></div>

        <div className="relative w-full max-w-md p-8 rounded-2xl bg-gray-900 dark:bg-white/10 border border-gray-700 dark:border-white/20 backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-gray-400 dark:text-gray-300 text-center mb-8">Sign in to your dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border-white/10"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                         type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                         required
                        className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border-white/10"
                        placeholder="••••••••"
                    />
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <p className="mt-6 text-center text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign up
                </Link>
            </p>
        </div>
    </div>
  );
};

export default Login;

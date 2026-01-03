import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import logo from '@/assets/logo.png';

// ========================================
// OPTIMIZED LOGIN COMPONENT
// ========================================

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ========================================
    // EMAIL/PASSWORD LOGIN
    // ========================================
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setIsLoading(true);

        try {
            const user = await login(email, password);
            console.log("[Login] User logged in:", user?.email);

            if (user) {
                toast.success("Welcome back!", "Login successful");

                // Get redirect URL from location state
                const state = location.state as { from?: string | { pathname: string } } | null;
                const from = (typeof state?.from === 'string' ? state.from : state?.from?.pathname) || '/';

                // Redirect based on role
                if (user.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (from !== '/') {
                    navigate(from, { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (error: any) {
            console.error("[Login] Error:", error);

            // Handle specific errors
            if (error.message === 'Please verify your email address' ||
                error.message?.includes('verify')) {
                toast.error(
                    "Email verification required",
                    "Redirecting you to verify your email..."
                );
                setTimeout(() => {
                    navigate('/verify-email', { state: { email } });
                }, 1500);
                return;
            }

            toast.error(
                "Login failed",
                error.message || "Please check your credentials and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // ========================================
    // GOOGLE LOGIN
    // ========================================
    const handleGoogleSuccess = ({ user, token }: { user: any, token: string }) => {
        console.log("[Login] Google sign-in successful:", user.email);

        loginWithGoogle(user, token);

        toast.success("Welcome!", `Logged in as ${user.name}`);

        // Get redirect URL
        const state = location.state as { from?: string | { pathname: string } } | null;
        const from = (typeof state?.from === 'string' ? state.from : state?.from?.pathname) || '/';

        // Redirect based on role
        // Redirect based on role
        if (user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
        } else if (from !== '/') {
            navigate(from, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    const handleGoogleError = () => {
        console.error("[Login] Google sign-in failed");
        toast.error(
            "Google sign-in failed",
            "Please try again or use email/password login."
        );
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
                {/* Header */}
                <div className="text-center">
                    <img src={logo} alt="Mansara Foods" className="h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                {/* Google Sign-In Button */}
                <div className="space-y-4">
                    <GoogleAuthButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signin_with"
                        mode="signin"
                    />
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                placeholder="name@example.com"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
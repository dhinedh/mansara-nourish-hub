
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = await login(email, password);
            console.log("Login returned user:", user); // Debug Log
            if (user) {
                toast({
                    title: "Login Successful",
                    description: "Welcome back!",
                    duration: 3000,
                });

                console.log("Redirecting based on role:", user.role); // Debug Log

                // Check if there's a return url
                const state = location.state as { from?: string | { pathname: string } } | null;
                const from = (typeof state?.from === 'string' ? state.from : state?.from?.pathname) || '/';

                if (user.role === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (from !== '/') {
                    navigate(from, { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (error: any) {
            // Check for specific verification error
            if (error.message === 'Please verify your email address' || (error.response && error.response.status === 401 && error.message.includes('verify'))) {
                toast({
                    title: "Verification Required",
                    description: "Redirecting you to verify your email...",
                    duration: 3000,
                });

                // Redirect to verify email with the email pre-filled
                navigate('/verify-email', { state: { email } });
                return;
            }

            toast({
                title: "Login Failed",
                description: error.message || "Please check your credentials and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
                <div className="text-center">
                    <img src={logo} alt="Mansara Foods" className="h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-heading font-bold text-foreground">Welcome Back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                {/* Demo Credentials Box */}
                <div className="bg-muted p-4 rounded-lg text-sm space-y-2 border border-border">
                    <p className="font-semibold text-center border-b border-border pb-2 mb-2">Demo Credentials</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium text-primary mb-1">Client:</p>
                            <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                            <p className="text-xs text-muted-foreground">password123</p>
                        </div>
                        <div>
                            <p className="font-medium text-destructive mb-1">Admin:</p>
                            <p className="text-xs text-muted-foreground">mansara@deepikaharikrishnan.com</p>
                            <p className="text-xs text-muted-foreground">Mansara@123</p>
                        </div>
                    </div>
                </div>

                <form className="mt-4 space-y-6" onSubmit={handleLogin}>
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
                            />
                        </div>
                    </div>

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
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

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

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" type="button" className="w-full" onClick={() => { }}>
                        Google
                    </Button>

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

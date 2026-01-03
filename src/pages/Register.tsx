import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import logo from '@/assets/logo.png';

// ========================================
// OPTIMIZED REGISTER COMPONENT
// ========================================

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    // ========================================
    // EMAIL/PASSWORD REGISTRATION
    // ========================================
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name || !email || !phone || !password) {
            toast.error("All fields are required", "Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", "Please make sure your passwords match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password too short", "Password must be at least 6 characters long.");
            return;
        }

        if (!phone || phone.length < 10) {
            toast.error("Invalid phone number", "Please enter a valid 10-digit phone number.");
            return;
        }

        setIsLoading(true);

        try {
            // Use whatsapp if provided, otherwise use phone
            const whatsappNumber = whatsapp || phone;

            console.log("[Register] Attempting registration:", { email, name });

            const success = await register(name, email, password, phone, whatsappNumber);

            if (success) {
                console.log("[Register] ✓ Registration successful");

                toast.success(
                    "Registration successful!",
                    "Please check your WhatsApp for the verification OTP."
                );

                // Redirect to verification page
                navigate('/verify-email', { state: { email } });
            } else {
                throw new Error("Registration failed");
            }
        } catch (error: any) {
            console.error("[Register] ✗ Error:", error);

            toast.error(
                "Registration failed",
                error.message || "Please check your details and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fill WhatsApp with phone number if they're the same
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);

        // Auto-fill WhatsApp if it's empty
        if (!whatsapp) {
            setWhatsapp(value);
        }
    };

    // ========================================
    // GOOGLE REGISTRATION
    // ========================================
    const handleGoogleSuccess = ({ user, token }: { user: any, token: string }) => {
        console.log("[Register] Google sign-up successful:", user.email);

        loginWithGoogle(user, token);

        toast.success("Welcome!", `Account created successfully as ${user.name}`);

        // Redirect to home
        navigate('/', { replace: true });
    };

    const handleGoogleError = () => {
        console.error("[Register] Google sign-up failed");

        toast.error(
            "Google sign-up failed",
            "Please try again or use email registration."
        );
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
                {/* Header */}
                <div className="text-center">
                    <img src={logo} alt="Mansara Foods" className="h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-heading font-bold text-foreground">Create an Account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join us for healthy, organic food
                    </p>
                </div>

                {/* Google Sign-Up Button */}
                <div className="space-y-4">
                    <GoogleAuthButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signup_with"
                        mode="signup"
                    />
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or register with email</span>
                    </div>
                </div>

                {/* Registration Form */}
                <form className="space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1"
                                placeholder="John Doe"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email */}
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

                        {/* Phone Number */}
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={phone}
                                onChange={handlePhoneChange}
                                className="mt-1"
                                placeholder="9876543210"
                                minLength={10}
                                maxLength={10}
                                disabled={isLoading}
                            />
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <Label htmlFor="whatsapp" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                WhatsApp Number
                            </Label>
                            <Input
                                id="whatsapp"
                                name="whatsapp"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                className="mt-1"
                                placeholder="9876543210"
                                minLength={10}
                                maxLength={10}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                OTP will be sent to this WhatsApp number
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1"
                                placeholder="••••••••"
                                minLength={6}
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Minimum 6 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* WhatsApp Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            You'll receive a verification code on WhatsApp
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            'Sign up'
                        )}
                    </Button>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';
import logo from '@/assets/logo.png';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters long.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Use whatsapp if provided, otherwise use phone
            const whatsappNumber = whatsapp || phone;
            
            const success = await register(name, email, password, phone, whatsappNumber);
            if (success) {
                toast({
                    title: "Registration Successful",
                    description: "Please check your WhatsApp for the verification OTP.",
                    duration: 5000,
                });
                navigate('/verify-email', { state: { email } });
            } else {
                throw new Error("Registration failed");
            }
        } catch (error: any) {
            toast({
                title: "Registration Failed",
                description: error.message || "Please check your details and try again.",
                variant: "destructive",
            });
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

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
                <div className="text-center">
                    <img src={logo} alt="Mansara Foods" className="h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-heading font-bold text-foreground">Create an Account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join us for healthy, organic food
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-4">
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
                            />
                        </div>

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
                            />
                        </div>

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
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                OTP will be sent to this WhatsApp number
                            </p>
                        </div>

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
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Minimum 6 characters
                            </p>
                        </div>

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
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            You'll receive a verification code on WhatsApp
                        </p>
                    </div>

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
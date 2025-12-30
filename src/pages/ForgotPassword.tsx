import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import logo from '@/assets/logo.png';
import { forgotPassword, resetPassword } from '@/lib/api';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await forgotPassword(email);
            setStep(2);
            toast({
                title: "OTP Sent",
                description: "Please check your email for the OTP.",
                duration: 5000,
            });
        } catch (error: any) {
            toast({
                title: "Request Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please ensure both passwords match.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(email, otp, newPassword);
            toast({
                title: "Password Reset Successful",
                description: "You can now login with your new password.",
                duration: 5000,
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                title: "Reset Failed",
                description: error.message || "Invalid OTP or expired.",
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
                    <h2 className="text-2xl font-heading font-bold text-foreground">
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {step === 1
                            ? 'Enter your email to receive an OTP'
                            : 'Enter the OTP sent to your email and your new password'}
                    </p>
                </div>

                {step === 1 ? (
                    <form className="mt-4 space-y-6" onSubmit={handleSendOTP}>
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

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </Button>
                    </form>
                ) : (
                    <form className="mt-4 space-y-6" onSubmit={handleResetPassword}>
                        <div className="bg-primary/5 p-3 rounded-lg flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <KeyRound size={16} />
                            </div>
                            <div className="text-sm">
                                <p className="text-muted-foreground">OTP sent to:</p>
                                <p className="font-medium">{email}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setStep(1)}>
                                Change
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 tracking-widest"
                                placeholder="123456"
                                maxLength={6}
                            />
                        </div>

                        <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>
                )}

                <div className="text-center">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

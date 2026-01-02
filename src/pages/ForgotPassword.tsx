import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, KeyRound, MessageSquare } from 'lucide-react';
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
                title: "OTP Sent Successfully",
                description: "Please check your WhatsApp for the verification code.",
                duration: 5000,
            });
        } catch (error: any) {
            toast({
                title: "Failed to Send OTP",
                description: error.message || "Unable to send OTP. Please try again.",
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
                title: "Passwords Don't Match",
                description: "Please ensure both passwords are identical.",
                variant: "destructive"
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                title: "Password Too Short",
                description: "Password must be at least 6 characters long.",
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
                description: error.message || "Invalid or expired OTP. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            await forgotPassword(email);
            toast({
                title: "OTP Resent",
                description: "A new OTP has been sent to your WhatsApp.",
                duration: 5000,
            });
        } catch (error: any) {
            toast({
                title: "Failed to Resend",
                description: error.message || "Unable to resend OTP.",
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
                            ? 'Enter your email to receive an OTP on WhatsApp'
                            : 'Enter the OTP sent to your WhatsApp and set a new password'}
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
                                <>
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Send OTP via WhatsApp
                                </>
                            )}
                        </Button>
                    </form>
                ) : (
                    <form className="mt-4 space-y-6" onSubmit={handleResetPassword}>
                        <div className="bg-primary/5 p-3 rounded-lg flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <MessageSquare size={16} />
                            </div>
                            <div className="text-sm flex-1">
                                <p className="text-muted-foreground">OTP sent to WhatsApp for:</p>
                                <p className="font-medium">{email}</p>
                            </div>
                            <Button 
                                type="button"
                                variant="ghost" 
                                size="sm" 
                                className="text-xs" 
                                onClick={() => setStep(1)}
                            >
                                Change
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="otp">Enter OTP (6 digits)</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="mt-1 tracking-widest text-center text-lg"
                                placeholder="123456"
                                maxLength={6}
                            />
                            <div className="mt-2 text-right">
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="text-xs"
                                >
                                    Resend OTP
                                </Button>
                            </div>
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
                                minLength={6}
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
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="mr-2 h-4 w-4" />
                                    Reset Password
                                </>
                            )}
                        </Button>
                    </form>
                )}

                <div className="text-center pt-4 border-t">
                    <Link 
                        to="/login" 
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifyEmail, resendOTP } from "@/lib/api";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, KeyRound, RefreshCw } from "lucide-react";

interface FormData {
    otp: string;
}

const VerifyEmail = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Email not found. Please register again.");
            navigate("/register");
        }
    }, [email, navigate]);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await verifyEmail(email, data.otp);
            toast.success("Account verified successfully! You can now login.");

            // Redirect to login page
            navigate("/login");
        } catch (error: any) {
            toast.error(error.message || "Verification failed. Please check your OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setResendLoading(true);
        try {
            await resendOTP(email);
            toast.success("New OTP has been sent to your WhatsApp and Email.");
            setCountdown(60); // 60 second cooldown
        } catch (error: any) {
            toast.error(error.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    if (!email) return null;

    return (
        <Layout>
            <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Verify Your Account
                        </h2>
                        <p className="mt-3 text-sm text-gray-600">
                            We've sent a verification code to your WhatsApp and Email
                        </p>
                        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-900">
                                {email}
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Please check your WhatsApp or Email for the 6-digit OTP
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center justify-center gap-2">
                                    <KeyRound className="h-4 w-4" />
                                    Enter OTP
                                </div>
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                required
                                placeholder="000000"
                                maxLength={6}
                                {...register("otp", {
                                    required: "OTP is required",
                                    minLength: { value: 6, message: "OTP must be 6 digits" },
                                    maxLength: { value: 6, message: "OTP must be 6 digits" },
                                    pattern: { value: /^[0-9]+$/, message: "OTP must be numbers only" }
                                })}
                                className={`text-center tracking-widest text-2xl font-semibold ${errors.otp ? "border-red-500" : ""
                                    }`}
                                autoComplete="off"
                                autoFocus
                            />
                            {errors.otp && (
                                <p className="mt-2 text-sm text-red-600 text-center">
                                    {errors.otp.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound className="h-4 w-4" />
                                        Verify Account
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendLoading || countdown > 0}
                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageSquare className="h-4 w-4" />
                                {resendLoading ? (
                                    "Sending..."
                                ) : countdown > 0 ? (
                                    `Resend OTP in ${countdown}s`
                                ) : (
                                    "Resend OTP to WhatsApp & Email"
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <Link
                                to="/register"
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Change Email / Register Again
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-xs text-yellow-800 text-center">
                            <strong>Note:</strong> OTP is valid for 10 minutes.
                            Make sure to check your WhatsApp or Email messages.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VerifyEmail;
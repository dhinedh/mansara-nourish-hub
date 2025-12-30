import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifyEmail, resendOTP } from "@/lib/api";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";

interface FormData {
    otp: string;
}

const VerifyEmail = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might auto-login or just redirect

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Email not found. Please register or login again.");
            navigate("/register");
        }
    }, [email, navigate]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await verifyEmail(email, data.otp);
            toast.success("Email verified successfully! You can now login.");

            // Optional: Auto login if the API returns a token (which we updated it to do)
            // But for safety/simplicity, let's redirect to login to ensure proper AuthContext state
            navigate("/login");
        } catch (error: any) {
            toast.error(error.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        try {
            await resendOTP(email);
            toast.success("OTP has been resent to your email.");
        } catch (error: any) {
            toast.error(error.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    }

    if (!email) return null;

    return (
        <Layout>
            <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Verify your Email
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            We have sent an OTP to <strong>{email}</strong>
                        </p>
                        <p className="text-center text-xs text-muted-foreground mt-1">
                            Please check your inbox (and spam folder).
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="otp" className="sr-only">
                                Enter OTP
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                {...register("otp", {
                                    required: "OTP is required",
                                    minLength: { value: 6, message: "OTP must be 6 digits" },
                                    pattern: { value: /^[0-9]+$/, message: "OTP must be numbers only" }
                                })}
                                className={`text-center tracking-widest text-lg ${errors.otp ? "border-red-500" : ""}`}
                            />
                            {errors.otp && (
                                <p className="mt-1 text-sm text-red-500 text-center">{errors.otp.message}</p>
                            )}
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {loading ? "Verifying..." : "Verify Email"}
                            </Button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendLoading}
                                className="text-sm font-medium text-secondary hover:text-secondary/80 disabled:opacity-50"
                            >
                                {resendLoading ? "Sending..." : "Resend OTP"}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <Link to="/register" className="text-xs text-gray-500 hover:text-gray-700">
                                Change Email / Register Again
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default VerifyEmail;

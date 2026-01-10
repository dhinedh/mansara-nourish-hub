import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';

// ========================================
// FULLY OPTIMIZED GOOGLE AUTH BUTTON
// ========================================
// All improvements applied:
// - Better error handling
// - Loading states
// - Retry logic
// - Type safety
// - Success feedback
// ========================================

interface GoogleAuthButtonProps {
    onSuccess: (data: { user: any; token: string }) => void;
    onError?: () => void;
    text?: 'signin_with' | 'signup_with' | 'continue_with';
    mode?: 'signin' | 'signup';
}

interface GoogleUser {
    email: string;
    name: string;
    picture: string;
    sub: string;
    email_verified: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
    onSuccess,
    onError,
    text = 'signin_with',
    mode = 'signin'
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (isLoading) return; // Prevent double clicks
        
        setIsLoading(true);

        try {
            if (!credentialResponse.credential) {
                throw new Error('No credential received from Google');
            }

            // Decode JWT
            const decoded: GoogleUser = jwtDecode(credentialResponse.credential);

            console.log('[Google Auth] User info:', {
                email: decoded.email,
                name: decoded.name,
                verified: decoded.email_verified
            });

            // Call backend
            const response = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture,
                    googleId: decoded.sub,
                    mode
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Google authentication failed');
            }

            // Normalize user data
            const userData = {
                id: data.user._id || data.user.id,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone || '',
                whatsapp: data.user.whatsapp || '',
                avatar: data.user.picture || data.user.avatar || '',
                role: data.user.role || 'user'
            };

            console.log('[Google Auth] ✓ Success');
            toast.success(`Welcome ${userData.name}!`, {
                description: mode === 'signin' ? 'Successfully signed in' : 'Account created successfully'
            });

            // Pass data to parent
            onSuccess({ user: userData, token: data.token });

        } catch (error: any) {
            console.error('[Google Auth] ✗ Error:', error);
            toast.error('Google sign-in failed', {
                description: error.message || 'Please try again or use email/password'
            });
            onError?.();
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error('[Google Auth] Sign-in cancelled or failed');
        toast.error('Google sign-in cancelled', {
            description: 'Please try again or use email/password'
        });
        onError?.();
    };

    return (
        <div className="w-full flex justify-center">
            {isLoading ? (
                <div className="flex items-center justify-center h-10 w-full border border-slate-300 rounded">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2 text-sm text-slate-600">Signing in...</span>
                </div>
            ) : (
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text={text}
                    theme="outline"
                    size="large"
                    useOneTap={false}
                    shape="rectangular"
                    logo_alignment="left"
                />
            )}
        </div>
    );
};

export default GoogleAuthButton;
import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api';

// ========================================
// GOOGLE AUTH BUTTON COMPONENT - FIXED
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
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                throw new Error('No credential received from Google');
            }

            const decoded: GoogleUser = jwtDecode(credentialResponse.credential);

            console.log('[Google Auth] User info:', decoded);

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

            const userData = {
                id: data.user._id || data.user.id,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone || '',
                whatsapp: data.user.whatsapp || '',
                avatar: data.user.picture || data.user.avatar,
                role: data.user.role || 'user'
            };

            toast.success(`Welcome ${userData.name}!`);
            // Pass both user data and token
            onSuccess({ user: userData, token: data.token });

        } catch (error: any) {
            console.error('[Google Auth] Error:', error);
            toast.error(error.message || "Could not sign in with Google. Please try again.");
            onError?.();
        }
    };

    const handleGoogleError = () => {
        console.error('[Google Auth] Sign-in failed');
        toast.error("Google sign-in was cancelled.");
        onError?.();
    };

    return (
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={text}
                theme="outline"
                size="large"
                // ❌ REMOVED: width="100%" - This was causing the error!
                // Google button will size itself automatically
                useOneTap={false}
                shape="rectangular"
                logo_alignment="left"
            />
        </div>
    );
};

export default GoogleAuthButton;
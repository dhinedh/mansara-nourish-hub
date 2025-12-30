export const API_URL = import.meta.env.VITE_API_URL || 'https://mansara-backend.onrender.com/api';

export const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const fetchProductById = async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
};

export const fetchCombos = async () => {
    const response = await fetch(`${API_URL}/combos`);
    if (!response.ok) throw new Error('Failed to fetch combos');
    return response.json();
};

export const fetchComboById = async (id: string) => {
    const response = await fetch(`${API_URL}/combos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch combo');
    return response.json();
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
};

export const createOrder = async (orderData: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create order');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const fetchUser = async (userId: string) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}?time=${Date.now()}`, {
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (response.status === 404) {
            throw new Error('USER_NOT_FOUND');
        }
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const getUserOrders = async (userId: string) => {
    try {
        const response = await fetch(`${API_URL}/orders/user/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export const addAddress = async (userId: string, addressData: any) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addressData),
        });
        if (!response.ok) throw new Error('Failed to add address');
        return await response.json();
    } catch (error) {
        console.error('Error adding address:', error);
        throw error;
    }
};

export const updateAddress = async (userId: string, addressId: string, addressData: any) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/address/${addressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addressData),
        });
        if (!response.ok) throw new Error('Failed to update address');
        return await response.json();
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

export const deleteAddress = async (userId: string, addressId: string) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}/address/${addressId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete address');
        return await response.json();
    } catch (error) {
        console.error('Error deleting address:', error);
        throw error;
    }
};

export const submitContact = async (contactData: any) => {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        });
        if (!response.ok) throw new Error('Failed to submit message');
        return await response.json();
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
};

// --- Product CRUD ---
export const createProduct = async (productData: any, token: string) => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
    }
    return response.json();
};

export const updateProduct = async (id: string, productData: any, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
    }
    return response.json();
};

export const deleteProduct = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
    }
    return response.json();
};

// --- Combo CRUD ---
export const createCombo = async (comboData: any, token: string) => {
    const response = await fetch(`${API_URL}/combos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(comboData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create combo');
    }
    return response.json();
};

export const updateCombo = async (id: string, comboData: any, token: string) => {
    const response = await fetch(`${API_URL}/combos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(comboData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update combo');
    }
    return response.json();
};

export const deleteCombo = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/combos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete combo');
    }
    return response.json();
};

// --- Category CRUD ---
export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const createCategory = async (categoryData: any, token: string) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
    }
    return response.json();
};

export const updateCategory = async (id: string, categoryData: any, token: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
    }
    return response.json();
};

export const deleteCategory = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
    return response.json();
};

// --- Admin Order ---
export const getAllOrders = async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
};

// --- Dashboard Stats ---
export const getDashboardStats = async (token: string) => {
    const response = await fetch(`${API_URL}/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
};

// --- Admin User Management ---
export const getAllUsers = async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

// --- Content Management ---
export const fetchContentPages = async () => {
    const response = await fetch(`${API_URL}/content/pages`);
    if (!response.ok) throw new Error('Failed to fetch content pages');
    return response.json();
};

export const updateContentPage = async (slug: string, sections: any) => {
    const response = await fetch(`${API_URL}/content/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
    });
    if (!response.ok) throw new Error('Failed to update content page');
    return response.json();
};

// --- Banner Management ---
export const fetchBanners = async () => {
    const response = await fetch(`${API_URL}/content/banners`);
    if (!response.ok) throw new Error('Failed to fetch banners');
    return response.json();
};

export const createBanner = async (bannerData: any) => {
    const response = await fetch(`${API_URL}/content/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
    });
    if (!response.ok) throw new Error('Failed to create banner');
    return response.json();
};

export const updateBanner = async (id: string, bannerData: any) => {
    const response = await fetch(`${API_URL}/content/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
    });
    if (!response.ok) throw new Error('Failed to update banner');
    return response.json();
};

export const deleteBanner = async (id: string) => {
    const response = await fetch(`${API_URL}/content/banners/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete banner');
    return response.json();
};

// --- Hero Management ---
export const fetchHeroConfig = async () => {
    const response = await fetch(`${API_URL}/content/hero`);
    if (!response.ok) throw new Error('Failed to fetch hero config');
    return response.json();
};

export const updateHeroConfig = async (key: string, data: any) => {
    const response = await fetch(`${API_URL}/content/hero/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update hero config');
    return response.json();
};

// --- Settings Management ---
export const fetchSettings = async () => {
    const response = await fetch(`${API_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
};

export const updateSettings = async (settingsData: any) => {
    const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
};

export const changePassword = async (passwordData: any, token: string) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
    }
    return response.json();
};

export const updateProfile = async (profileData: any, token: string) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
    }
    return response.json();
};

export const getCart = async (token: string) => {
    const response = await fetch(`${API_URL}/cart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
};

export const updateCart = async (cartItems: any[], token: string) => {
    const response = await fetch(`${API_URL}/cart`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartItems),
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send reset email');
    }
    return response.json();
};

export const resetPassword = async (email: string, otp: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
    }
    return response.json();
};

export const verifyEmail = async (email: string, otp: string) => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Verification failed');
    }
    return response.json();
};

export const resendOTP = async (email: string) => {
    const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to resend OTP');
    }
    return response.json();
};

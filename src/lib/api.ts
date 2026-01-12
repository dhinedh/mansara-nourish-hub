import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        metadata?: {
            startTime: number;
        };
    }
}

// ========================================
// FULLY OPTIMIZED API UTILITY
// ========================================
// All improvements applied:
// - Enhanced retry logic
// - Better request deduplication
// - Request cancellation
// - Request queue management
// - Better error handling
// - Response caching
// ========================================

export const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? "http://localhost:5000/api"
        : "https://api.mansarafoods.com/api");


// ========================================
// AXIOS INSTANCE WITH OPTIMIZATIONS
// ========================================

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// ========================================
// REQUEST QUEUE & DEDUPLICATION
// ========================================

const pendingRequests = new Map<string, Promise<any>>();
const requestQueue = new Map<string, AbortController>();

// Generate request key for deduplication
const getRequestKey = (config: AxiosRequestConfig): string => {
    return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
};

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
    (config) => {
        // Add auth token
        const token = localStorage.getItem('mansara-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp
        config.metadata = { startTime: Date.now() };

        // Add cache-busting for GET requests if needed
        if (config.method === 'get' && config.params?.noCache) {
            config.params._t = Date.now();
            delete config.params.noCache;
        }

        // Create abort controller for cancellation
        const controller = new AbortController();
        const requestKey = getRequestKey(config);
        requestQueue.set(requestKey, controller);
        config.signal = controller.signal;

        console.log(`[API] → ${config.method?.toUpperCase()} ${config.url}`);

        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// ========================================
// RESPONSE INTERCEPTOR WITH RETRY
// ========================================

api.interceptors.response.use(
    (response) => {
        // Log response time
        const duration = Date.now() - response.config.metadata?.startTime;
        console.log(`[API] ✓ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);

        // Remove from queue
        const requestKey = getRequestKey(response.config);
        requestQueue.delete(requestKey);

        return response;
    },
    async (error: AxiosError) => {
        const config = error.config as any;

        // Remove from queue
        if (config) {
            const requestKey = getRequestKey(config);
            requestQueue.delete(requestKey);
        }

        // Initialize retry count
        if (!config || !config.retry) {
            if (config) config.retry = 0;
        }

        // Determine if we should retry
        const shouldRetry =
            config &&
            config.retry < 3 &&
            (!error.response || error.response.status >= 500) &&
            error.code !== 'ECONNABORTED' && // Don't retry timeouts
            !axios.isCancel(error); // Don't retry cancelled requests

        if (shouldRetry) {
            config.retry += 1;
            const delay = Math.min(1000 * Math.pow(2, config.retry - 1), 5000); // Exponential backoff, max 5s

            console.log(`[API] Retry attempt ${config.retry}/3 in ${delay}ms`);

            await new Promise(resolve => setTimeout(resolve, delay));
            return api(config);
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
            console.error('[API] Unauthorized - clearing auth');
            localStorage.removeItem('mansara-token');
            localStorage.removeItem('mansara-user');

            // Redirect to login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Log error
        const duration = config?.metadata?.startTime
            ? Date.now() - config.metadata.startTime
            : 0;
        console.error(`[API] ✗ ${config?.method?.toUpperCase()} ${config?.url} (${duration}ms)`, error.message);

        return Promise.reject(error);
    }
);

export default api;

// ========================================
// REQUEST DEDUPLICATION HELPER
// ========================================

const dedupedFetch = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
    // Check if request is already pending
    if (pendingRequests.has(key)) {
        console.log(`[API] Using deduped request: ${key}`);
        return pendingRequests.get(key)!;
    }

    // Create new request
    const promise = fetcher().finally(() => {
        pendingRequests.delete(key);
    });

    pendingRequests.set(key, promise);
    return promise;
};

// ========================================
// CANCEL REQUEST HELPER
// ========================================

export const cancelRequest = (method: string, url: string) => {
    const key = `${method}:${url}:undefined`;
    const controller = requestQueue.get(key);
    if (controller) {
        controller.abort();
        requestQueue.delete(key);
        console.log(`[API] Cancelled request: ${key}`);
    }
};

export const cancelAllRequests = () => {
    requestQueue.forEach((controller, key) => {
        controller.abort();
        console.log(`[API] Cancelled: ${key}`);
    });
    requestQueue.clear();
};

// ========================================
// PRODUCTS API
// ========================================

export const fetchProducts = async () => {
    return dedupedFetch('products', async () => {
        // Fetch all products (up to 1000) to ensure client-side search/filtering works
        const response = await fetch(`${API_URL}/products?limit=1000`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        return data.products || data;
    });
};

export const fetchProductById = async (id: string) => {
    return dedupedFetch(`product-${id}`, async () => {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
    });
};

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

export const notifyMe = async (productId: string, whatsapp: string, userId?: string) => {
    const response = await fetch(`${API_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({ productId, whatsapp, userId }),
    });
    // Return json result regardless of status so frontend can handle messages like "Already subscribed"
    return response.json();
};

// ========================================
// PAYMENT API
// ========================================

export const createPaymentOrder = async (amount: number) => {
    const response = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify({ amount })
    });
    if (!response.ok) throw new Error('Failed to create payment order');
    return response.json();
};

export const verifyPayment = async (data: any) => {
    const response = await fetch(`${API_URL}/payment/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment verification failed');
    }
    return response.json();
};


export const fetchCombos = async () => {
    return dedupedFetch('combos', async () => {
        const response = await fetch(`${API_URL}/combos`);
        if (!response.ok) throw new Error('Failed to fetch combos');
        const data = await response.json();
        return data.combos || data;
    });
};

export const fetchComboById = async (id: string) => {
    return dedupedFetch(`combo-${id}`, async () => {
        const response = await fetch(`${API_URL}/combos/${id}`);
        if (!response.ok) throw new Error('Failed to fetch combo');
        return response.json();
    });
};

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

// ========================================
// CATEGORIES API
// ========================================

export const getCategories = async () => {
    return dedupedFetch('categories', async () => {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return response.json();
    });
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
        const errorMessage = error.message || 'Failed to create category';
        // Include stack trace if available in development
        if (error.stack) {
            console.error('[API] Server Error Stack:', error.stack);
        }
        throw new Error(errorMessage);
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

// ========================================
// UPLOAD API
// ========================================

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

// ========================================
// ORDERS API
// ========================================

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
        console.error('[API] ✗ Create order error:', error);
        throw error;
    }
};

export const getUserOrders = async (userId: string) => {
    return dedupedFetch(`user-orders-${userId}`, async () => {
        const token = localStorage.getItem('mansara-token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/orders/user/${userId}`, {
            headers
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }
        const data = await response.json();
        return data.orders || data;
    });
};

export const getAllOrders = async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data.orders || data;
};

export const getOrderById = async (orderId: string, token: string) => {
    try {
        const response = await api.get(`/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
};

export const confirmOrder = async (orderId: string, estimatedDeliveryDate?: string) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const response = await api.put(
            `/orders/${orderId}/confirm`,
            { estimatedDeliveryDate },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to confirm order');
    }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const response = await api.put(
            `/orders/${orderId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
};

export const cancelOrder = async (orderId: string) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const response = await api.put(
            `/orders/${orderId}/cancel`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
};

// ========================================
// USERS API
// ========================================

export const fetchUser = async (userId: string) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/users/${userId}?time=${Date.now()}`, {
            headers
        });
        if (response.status === 404) {
            throw new Error('USER_NOT_FOUND');
        }
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        return await response.json();
    } catch (error) {
        console.error('[API] ✗ Fetch user error:', error);
        throw error;
    }
};

export const getAllUsers = async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.users || data;
};

// ========================================
// ADDRESSES API
// ========================================

export const addAddress = async (userId: string, addressData: any) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/users/${userId}/address`, {
            method: 'POST',
            headers,
            body: JSON.stringify(addressData),
        });
        if (!response.ok) throw new Error('Failed to add address');
        return await response.json();
    } catch (error) {
        console.error('[API] ✗ Add address error:', error);
        throw error;
    }
};

export const updateAddress = async (userId: string, addressId: string, addressData: any) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/users/${userId}/address/${addressId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(addressData),
        });
        if (!response.ok) throw new Error('Failed to update address');
        return await response.json();
    } catch (error) {
        console.error('[API] ✗ Update address error:', error);
        throw error;
    }
};

export const deleteAddress = async (userId: string, addressId: string) => {
    try {
        const token = localStorage.getItem('mansara-token');
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/users/${userId}/address/${addressId}`, {
            method: 'DELETE',
            headers,
        });
        if (!response.ok) throw new Error('Failed to delete address');
        return await response.json();
    } catch (error) {
        console.error('[API] ✗ Delete address error:', error);
        throw error;
    }
};

// ========================================
// CONTACT API
// ========================================

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
        console.error('[API] ✗ Submit contact error:', error);
        throw error;
    }
};

// ========================================
// DASHBOARD STATS API
// ========================================

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

// ========================================
// CONTENT MANAGEMENT API
// ========================================

export const fetchContentPages = async () => {
    return dedupedFetch('content-pages', async () => {
        const response = await fetch(`${API_URL}/content/pages`);
        if (!response.ok) throw new Error('Failed to fetch content pages');
        return response.json();
    });
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

// ========================================
// BANNERS API
// ========================================

export const fetchBanners = async () => {
    return dedupedFetch('banners', async () => {
        const response = await fetch(`${API_URL}/content/banners`);
        if (!response.ok) throw new Error('Failed to fetch banners');
        return response.json();
    });
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

// ========================================
// HERO CONFIG API
// ========================================

export const fetchHeroConfig = async () => {
    return dedupedFetch('hero-config', async () => {
        const response = await fetch(`${API_URL}/content/hero`);
        if (!response.ok) throw new Error('Failed to fetch hero config');
        return response.json();
    });
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

// ========================================
// SETTINGS API
// ========================================

export const fetchSettings = async () => {
    return dedupedFetch('settings', async () => {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    });
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

// ========================================
// AUTH API
// ========================================

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
        throw new Error(error.message || 'Failed to send reset OTP');
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

// ========================================
// CART API
// ========================================

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
        body: JSON.stringify({ cart: cartItems }),
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
};

// ========================================
// BLOG API
// ========================================

export const fetchBlogPosts = async () => {
    try {
        const response = await fetch(`${API_URL}/blog`);
        if (!response.ok) throw new Error('Failed to fetch blog posts');
        const data = await response.json();
        return data.items || data;
    } catch (error) {
        console.error('[API] Fetch blog posts error:', error);
        throw error;
    }
};

export const fetchBlogPostById = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/blog/${id}`);
        if (!response.ok) throw new Error('Failed to fetch blog post');
        return response.json();
    } catch (error) {
        console.error('[API] Fetch blog post error:', error);
        throw error;
    }
};

export const createBlogPost = async (data: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/blog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to create blog post');
        }

        return responseData;
    } catch (error) {
        console.error('[API] Create blog post error:', error);
        throw error;
    }
};

export const updateBlogPost = async (id: string, data: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/blog/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to update blog post');
        }

        return responseData;
    } catch (error) {
        console.error('[API] Update blog post error:', error);
        throw error;
    }
};

export const deleteBlogPost = async (id: string, token: string) => {
    try {
        const response = await fetch(`${API_URL}/blog/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to delete blog post');
        }

        return response.json();
    } catch (error) {
        console.error('[API] Delete blog post error:', error);
        throw error;
    }
};

// ========================================
// PRESS API
// ========================================

export const fetchPressReleases = async () => {
    const response = await fetch(`${API_URL}/press`);
    if (!response.ok) throw new Error('Failed to fetch press releases');
    const data = await response.json();
    return data.items || data;
};

export const fetchPressReleaseById = async (id: string) => {
    const response = await fetch(`${API_URL}/press/${id}`);
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch press release');
    }
    return response.json();
};

export const createPressRelease = async (data: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/press`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create press release');
        }
        return response.json();
    } catch (error) {
        console.error('[API] Create press release error:', error);
        throw error;
    }
};

export const updatePressRelease = async (id: string, data: any, token: string) => {
    try {
        const response = await fetch(`${API_URL}/press/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update press release');
        }
        return response.json();
    } catch (error) {
        console.error('[API] Update press release error:', error);
        throw error;
    }
};

export const deletePressRelease = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/press/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete press release');
    return response.json();
};

// ========================================
// CAREERS API
// ========================================

export const fetchCareers = async () => {
    const response = await fetch(`${API_URL}/careers`);
    if (!response.ok) throw new Error('Failed to fetch careers');
    const data = await response.json();
    return data.items || data;
};

export const fetchCareerById = async (id: string) => {
    const response = await fetch(`${API_URL}/careers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch career');
    return response.json();
};

export const createCareer = async (data: any, token: string) => {
    const response = await fetch(`${API_URL}/careers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create career');
    return response.json();
};

export const updateCareer = async (id: string, data: any, token: string) => {
    const response = await fetch(`${API_URL}/careers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update career');
    return response.json();
};

export const deleteCareer = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/careers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete career');
    return response.json();
};

// ========================================
// REVIEWS API
// ========================================

export const fetchProductReviews = async (productId: string) => {
    const response = await fetch(`${API_URL}/reviews/product/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
};

export const checkReviewEligibility = async (productId: string, token: string) => {
    const response = await fetch(`${API_URL}/reviews/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to check eligibility');
    return response.json();
};

export const createReview = async (reviewData: any, token: string) => {
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
    }
    return response.json();
};

export const fetchAllReviews = async (token: string) => {
    const response = await fetch(`${API_URL}/reviews/admin`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
};

export const updateReviewStatus = async (id: string, isApproved: boolean, adminResponse: string | null, token: string) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved, adminResponse })
    });
    if (!response.ok) throw new Error('Failed to update review');
    return response.json();
};

export const deleteReview = async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return response.json();
};

export const sendContactForm = async (data: { name: string; email: string; subject: string; message: string }) => {
    const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
    }
    return response.json();
};


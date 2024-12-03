import axios from 'axios';
import { API_URL } from './config';

export const capitaliseWords = (phrase) => {
    if (!phrase) return '';
    return phrase.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const extractCategory = (fullphraseing) => {
    const [category] = fullphraseing.split(':');
    return category.trim();
};

export const extractSubcategory = (fullphraseing) => {
    const parts = fullphraseing.split(':');
    return parts[1] ? parts[1].trim() : null;
};

const AUTH_VERSION = '2';

const createAuthManager = () => {
    let refreshTokenTimeout = null;
    let isRefreshing = false;
    let failedRequests = [];
    let requestInterceptor = null;
    let responseInterceptor = null;

    const migrateStorageIfNeeded = () => {
        const currentVersion = localStorage.getItem('auth_version');
        if (currentVersion !== AUTH_VERSION) {
            clearTokens();
            localStorage.removeItem('email');
            localStorage.removeItem('deviceId');
            localStorage.setItem('auth_version', AUTH_VERSION);
            return false;
        }
        return true;
    };

    const setTokens = (authToken, refreshToken, email) => {
        if (!authToken || !refreshToken || !email) {
            // console.error('Missing required token data:', { authToken, refreshToken, email });
            return;
        }

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('email', email);
        localStorage.setItem('tokenCreatedAt', Date.now().toString());
        localStorage.setItem('auth_version', AUTH_VERSION);
        setupRefreshTimer();
    };

    const clearTokens = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenCreatedAt');
        if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
        }
    };

    const getTimeUntilRefresh = () => {
        const tokenCreatedAt = parseInt(localStorage.getItem('tokenCreatedAt') || '0');
        const now = Date.now();
        const tokenAge = now - tokenCreatedAt;
        const refreshTime = 55 * 60 * 1000;
        // const refreshTime = 10 * 1000;
        return Math.max(0, refreshTime - tokenAge);
    };

    const setupRefreshTimer = () => {
        if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
        }

        const timeUntilRefresh = getTimeUntilRefresh();
        // console.log(`Setting up refresh timer for ${timeUntilRefresh / 1000} seconds`);

        refreshTokenTimeout = setTimeout(() => {
            // console.log('Refresh timer triggered');
            refreshToken();
        }, timeUntilRefresh);
    };

    const refreshToken = async () => {
        if (isRefreshing) {
            // console.log('Already refreshing, waiting...');
            return new Promise((resolve) => {
                failedRequests.push(resolve);
            });
        }

        // console.log('Starting token refresh...');
        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const deviceId = localStorage.getItem('deviceId');
            const email = localStorage.getItem('email');
            const authVersion = localStorage.getItem('auth_version');

            // console.log('Storage state:', {
            //     email,
            //     deviceId,
            //     authVersion,
            //     refreshTokenPresent: refreshToken,
            //     authTokenPresent: localStorage.getItem('authToken')
            // });

            if (!refreshToken || !deviceId || !email) {
                const missing = [];
                if (!refreshToken) missing.push('refreshToken');
                if (!deviceId) missing.push('deviceId');
                if (!email) missing.push('email');
                throw new Error(`Missing required refresh data: ${missing.join(', ')}`);
            }

            const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                email,
                refresh_token: refreshToken,
                device_id: deviceId
            });

            // console.log('Refresh response:', response.data);

            if (response.data.token && response.data.refresh_token) {
                setTokens(response.data.token, response.data.refresh_token, email);
                return response.data.token;
            } else {
                throw new Error('Invalid token response format');
            }
        } catch (error) {
            console.error('Token refresh failed:', error.response?.data || error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.setItem('sessionExpired', 'true');
            }
            throw error;
        } finally {
            isRefreshing = false;
            failedRequests = [];
        }
    };

    const setupAxiosInterceptors = (onLogout) => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);

        requestInterceptor = axios.interceptors.request.use(
            config => {
                if (!config.url.includes('/auth/login') && !config.url.includes('/auth/refresh-token')) {
                    const token = localStorage.getItem('authToken');
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            error => Promise.reject(error)
        );

        responseInterceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                const skipUrls = ['/auth/login', '/auth/refresh-token'];
                if (error.response?.status === 401 && !originalRequest._retry &&
                    !skipUrls.some(url => originalRequest.url.includes(url))) {

                    originalRequest._retry = true;

                    try {
                        // console.log('Attempting token refresh...');
                        const newToken = await refreshToken();
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        // console.error('Token refresh failed:', refreshError);
                        clearTokens();
                        onLogout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    const initializeFromStorage = () => {
        if (!migrateStorageIfNeeded()) {
            return false;
        }

        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (authToken && refreshToken) {
            setupRefreshTimer();
            return true;
        }
        return false;
    };

    return {
        setTokens,
        clearTokens,
        getTimeUntilRefresh,
        setupRefreshTimer,
        refreshToken,
        setupAxiosInterceptors,
        initializeFromStorage,
        migrateStorageIfNeeded
    };
};

export const authManager = createAuthManager();
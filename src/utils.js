import axios from 'axios';
import { API_URL, REFRESH_INTERVAL } from './config';

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

const AUTH_VERSION = '3';

const createAuthManager = () => {
    let refreshTokenTimeout = null;
    let isRefreshing = false;
    let failedRequests = [];
    let requestInterceptor = null;
    let responseInterceptor = null;

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = `web-${window.navigator.userAgent}-${window.screen.width}x${window.screen.height}-${Date.now()}`;
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    };

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
            return;
        }

        const deviceId = getDeviceId();
        localStorage.setItem(`authToken_${deviceId}`, authToken);
        localStorage.setItem(`refreshToken_${deviceId}`, refreshToken);
        localStorage.setItem('email', email);
        localStorage.setItem(`tokenCreatedAt_${deviceId}`, Date.now().toString());
        localStorage.setItem('auth_version', AUTH_VERSION);
        setupRefreshTimer();
    };

    const clearTokens = () => {
        const deviceId = getDeviceId();
        localStorage.removeItem(`authToken_${deviceId}`);
        localStorage.removeItem(`refreshToken_${deviceId}`);
        localStorage.removeItem(`tokenCreatedAt_${deviceId}`);
        localStorage.removeItem('sessionExpired');
        localStorage.removeItem('email');
        if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
        }
    };

    const getTimeUntilRefresh = () => {
        const deviceId = getDeviceId();
        const tokenCreatedAt = parseInt(localStorage.getItem(`tokenCreatedAt_${deviceId}`) || '0');
        const now = Date.now();
        const tokenAge = now - tokenCreatedAt;
        const refreshTime = REFRESH_INTERVAL || 55 * 60 * 1000;
        return Math.max(0, refreshTime - tokenAge);
    };

    const setupRefreshTimer = () => {
        if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
        }

        const timeUntilRefresh = getTimeUntilRefresh();
        refreshTokenTimeout = setTimeout(() => {
            refreshToken();
        }, timeUntilRefresh);
    };

    const refreshToken = async () => {
        if (isRefreshing) {
            return new Promise((resolve) => {
                failedRequests.push(resolve);
            });
        }

        isRefreshing = true;
        const deviceId = getDeviceId();

        try {
            const refreshToken = localStorage.getItem(`refreshToken_${deviceId}`);
            const email = localStorage.getItem('email');

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

            if (response.data.token && response.data.refresh_token) {
                setTokens(response.data.token, response.data.refresh_token, email);
                failedRequests.forEach(callback => callback(response.data.token));
                return response.data.token;
            } else {
                throw new Error('Invalid token response format');
            }
        } catch (error) {
            failedRequests.forEach(callback => callback(null));
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
                    const deviceId = getDeviceId();
                    const token = localStorage.getItem(`authToken_${deviceId}`);
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                        config.headers['X-Device-ID'] = deviceId;
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

                const skipUrls = ['/auth/login', '/auth/refresh-token', '/auth/verify'];
                if (error.response?.status === 401 && !originalRequest._retry &&
                    !skipUrls.some(url => originalRequest.url.includes(url))) {

                    originalRequest._retry = true;

                    try {
                        const newToken = await refreshToken();
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
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

        const deviceId = getDeviceId();
        const authToken = localStorage.getItem(`authToken_${deviceId}`);
        const refreshToken = localStorage.getItem(`refreshToken_${deviceId}`);

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
        migrateStorageIfNeeded,
        getDeviceId
    };
};

export const authManager = createAuthManager();
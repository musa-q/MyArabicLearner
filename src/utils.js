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

const createAuthManager = () => {
    let refreshTokenTimeout = null;
    let isRefreshing = false;
    let failedRequests = [];
    let requestInterceptor = null;
    let responseInterceptor = null;

    const setTokens = (authToken, refreshToken) => {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('tokenCreatedAt', Date.now().toString());
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

        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const deviceId = localStorage.getItem('deviceId');
            const email = localStorage.getItem('email');

            if (!refreshToken || !deviceId || !email) {
                throw new Error('Missing required refresh data');
            }

            const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                email,
                refresh_token: refreshToken,
                device_id: deviceId
            });

            const { token: newAuthToken, refresh_token: newRefreshToken } = response.data;
            setTokens(newAuthToken, newRefreshToken);

            failedRequests.forEach(callback => callback(newAuthToken));
            failedRequests = [];

            return newAuthToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            failedRequests.forEach(callback => callback(null));
            failedRequests = [];
            throw error;
        } finally {
            isRefreshing = false;
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

                if (error.response?.status === 401 && !originalRequest._retry) {
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
        const authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (authToken && refreshToken) {
            setupRefreshTimer();
        }
    };

    return {
        setTokens,
        clearTokens,
        getTimeUntilRefresh,
        setupRefreshTimer,
        refreshToken,
        setupAxiosInterceptors,
        initializeFromStorage
    };
};

export const authManager = createAuthManager();
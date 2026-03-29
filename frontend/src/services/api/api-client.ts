import axios from 'axios';
import { API_CONFIG, CACHE_CONFIG } from '@/constants';

/**
 * Создание axios инстанса
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout,
});

/**
 * Интерцептор для обработки ошибок
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;

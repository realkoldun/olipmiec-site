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
    const errorDetails = error.response?.data || error.message || 'Unknown error';
    console.error('API Error:', errorDetails);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the request took too long to complete');
    }
    
    return Promise.reject(error);
  },
);

export default apiClient;

// Утилита для предотвращения слишком частых запросов
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // минимальный интервал между запросами в мс

export const throttleRequest = async <T>(
  requestFn: () => Promise<T>
): Promise<T> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  return requestFn();
};

// Функция для проверки CORS доступности API
export const checkCorsAvailability = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        Origin: 'http://localhost:4000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    return response.ok;
  } catch (error) {
    console.warn('CORS preflight check failed:', error);
    return false;
  }
};

// Функция для автоматического обновления токена
export const autoRefreshToken = async (
  refreshFn: () => Promise<any>,
  maxAttempts: number = 3
): Promise<any> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await refreshFn();
    } catch (error: any) {
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt) * 1000; // экспоненциальная задержка
        console.log(
          `Token refresh failed, retrying in ${delay}ms... (attempt ${attempt}/${maxAttempts})`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max token refresh attempts exceeded');
};

// Альтернативный подход для случаев, когда CORS недоступен
export const fetchWithCorsFallback = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  try {
    // Сначала пробуем с CORS
    return await fetch(url, {
      ...options,
      mode: 'cors',
      headers: {
        ...options.headers,
        Origin: 'http://localhost:4000'
      }
    });
  } catch (error: any) {
    if (error.message?.includes('CORS') || error.message?.includes('blocked')) {
      console.warn('CORS failed, trying without CORS mode...');
      // Пробуем без CORS режима
      return await fetch(url, {
        ...options,
        mode: 'no-cors' as RequestMode,
        headers: {
          ...options.headers,
          Origin: 'http://localhost:4000'
        }
      });
    }
    throw error;
  }
};

// Утилита для повторных попыток при ошибке 429
export const retryOnRateLimit = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      if (
        error.message?.includes('Too many requests') &&
        attempt < maxRetries
      ) {
        const delay = Math.pow(2, attempt) * 1000; // экспоненциальная задержка
        console.log(`Rate limited, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      if (error.message?.includes('CORS error') && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 500; // меньшая задержка для CORS ошибок
        console.log(`CORS error, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

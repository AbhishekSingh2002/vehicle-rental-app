// frontend/src/services/apiInterceptor.js
// API request/response interceptor for global handling

/**
 * Request interceptor - Add common headers, logging, etc.
 */
export function requestInterceptor(url, options = {}) {
  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
  }

  // Add timestamp to prevent caching (optional)
  const timestamp = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  const urlWithTimestamp = `${url}${separator}_t=${timestamp}`;

  // You can add more request modifications here
  return { url: urlWithTimestamp, options };
}

/**
 * Response interceptor - Handle common errors, logging, etc.
 */
export async function responseInterceptor(response, url) {
  // Log response in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Response] ${response.status} ${url}`);
  }

  // Handle specific status codes globally
  if (response.status === 401) {
    // Unauthorized - clear auth and redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (response.status === 403) {
    // Forbidden
    throw new Error('You do not have permission to access this resource.');
  }

  if (response.status === 429) {
    // Too many requests
    throw new Error('Too many requests. Please try again later.');
  }

  if (response.status >= 500) {
    // Server error
    throw new Error('Server error. Please try again later.');
  }

  return response;
}

/**
 * Error interceptor - Handle network errors and other exceptions
 */
export function errorInterceptor(error) {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', error);
  }

  // Handle network errors
  if (error.message === 'Failed to fetch') {
    return {
      error: 'Network error. Please check your internet connection.',
      isNetworkError: true,
    };
  }

  // Handle timeout errors
  if (error.name === 'AbortError') {
    return {
      error: 'Request timeout. Please try again.',
      isTimeout: true,
    };
  }

  // Return original error
  return error;
}

/**
 * Retry logic for failed requests
 */
export async function retryRequest(fetchFunction, retries = 3, delay = 1000) {
  try {
    return await fetchFunction();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      await sleep(delay);
      return retryRequest(fetchFunction, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Determine if request should be retried
 */
function shouldRetry(error) {
  // Don't retry on client errors (4xx)
  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  // Retry on network errors and server errors (5xx)
  return true;
}

/**
 * Sleep utility for retry delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  requestInterceptor,
  responseInterceptor,
  errorInterceptor,
  retryRequest,
};
export class APIError extends Error {
  statusCode?: number;
  originalError?: unknown;

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
};

/**
 * Delays execution for a specified number of milliseconds
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculates exponential backoff delay
 */
const getBackoffDelay = (attempt: number, config: RetryConfig): number => {
  const exponentialDelay = config.baseDelay * Math.pow(2, attempt);
  return Math.min(exponentialDelay, config.maxDelay);
};

/**
 * Determines if an error is retryable (network errors, 5xx errors)
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof APIError) {
    // Retry on 5xx server errors
    if (error.statusCode && error.statusCode >= 500) {
      return true;
    }
  }
  // Retry on network errors (TypeError for fetch failures)
  if (error instanceof TypeError) {
    return true;
  }
  return false;
};

/**
 * Wraps a fetch request with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Merge abort signals if one was provided
    const signal = options.signal
      ? AbortSignal.any([options.signal, controller.signal])
      : controller.signal;

    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new APIError("Request timed out or was cancelled");
    }
    throw error;
  }
};

/**
 * Main API client function with retry logic and error handling
 */
export const apiClient = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body,
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRY_CONFIG.maxRetries,
    signal,
  } = options;

  const url = endpoint;
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions, timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.error || `Request failed with status ${response.status}`,
          response.status
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;

      // Don't retry if request was cancelled
      if (error instanceof Error && error.name === "AbortError") {
        throw new APIError("Request was cancelled");
      }

      // Don't retry if it's the last attempt
      if (attempt === retries) {
        break;
      }

      // Only retry if error is retryable
      if (!isRetryableError(error)) {
        break;
      }

      // Wait before retrying with exponential backoff
      const backoffDelay = getBackoffDelay(attempt, DEFAULT_RETRY_CONFIG);
      await delay(backoffDelay);
    }
  }

  // If we get here, all retries failed
  if (lastError instanceof APIError) {
    throw lastError;
  }

  throw new APIError(
    "Network error. Please check your connection.",
    undefined,
    lastError
  );
};

/**
 * User-friendly error message mapper
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    // Map technical errors to user-friendly messages
    if (
      error.message.includes("timeout") ||
      error.message.includes("timed out")
    ) {
      return "The request took too long. Please try again.";
    }
    if (error.message.includes("cancelled")) {
      return "Request was cancelled.";
    }
    if (error.statusCode === 404) {
      return "The requested resource was not found.";
    }
    if (error.statusCode === 400) {
      return "Invalid request. Please check your input.";
    }
    if (error.statusCode && error.statusCode >= 500) {
      return "Server error. Please try again later.";
    }
    // Return sanitized message (avoid exposing technical details)
    return error.message || "An unexpected error occurred.";
  }

  if (error instanceof TypeError) {
    return "Network error. Please check your connection.";
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * API Configuration
 * Controls whether to use Laravel backend or local fixtures
 */

export interface APIConfig {
  useBackend: boolean;
  backendUrl?: string;
}

// Default configuration - can be overridden by environment variables
const config: APIConfig = {
  useBackend: process.env.NEXT_PUBLIC_USE_BACKEND === "true",
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
};

export const getAPIConfig = (): APIConfig => config;

export const setUseBackend = (useBackend: boolean): void => {
  config.useBackend = useBackend;
};

export const isBackendEnabled = (): boolean => config.useBackend;

export const getBackendUrl = (): string => config.backendUrl || "http://localhost:8000";

const env = (globalThis as any)?.process?.env || {};
export const API_CONFIG = {
  baseUrl: env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'
};


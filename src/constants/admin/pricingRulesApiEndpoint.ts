export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const PRICING_RULES_API_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/admin/pricing-rules`,
  CREATE: `${API_BASE_URL}/api/admin/pricing-rules`,
  DETAIL: (id: number | string) => `${API_BASE_URL}/api/admin/pricing-rules/${id}`,
  UPDATE: (id: number | string) => `${API_BASE_URL}/api/admin/pricing-rules/${id}`,
  DELETE: (id: number | string) => `${API_BASE_URL}/api/admin/pricing-rules/${id}`,
};

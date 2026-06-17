export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const SPARE_PART_API_ENDPOINTS = {
    SPARE_PART: `${API_BASE_URL}/api/inventory/part`,
}; 
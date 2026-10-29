export const API_BASE = process.env.NODE_ENV === 'production' ? '' : (process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002').replace(/\/$/, '');

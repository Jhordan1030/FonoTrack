// src/services/api.js
import axios from 'axios';

// Configurar axios para conectar con tu backend
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Servicios para Pacientes
export const patientsService = {
  getAll: () => api.get('/pacientes'),
  getById: (id) => api.get(`/pacientes/${id}`),
  create: (data) => api.post('/pacientes', data),
  update: (id, data) => api.put(`/pacientes/${id}`, data),
  delete: (id) => api.delete(`/pacientes/${id}`),
};

// Servicios para Evaluaciones
export const evaluationsService = {
  getAll: () => api.get('/evaluaciones'),
  getById: (id) => api.get(`/evaluaciones/${id}`),
  getByPatient: (patientId) => api.get(`/evaluaciones/patient/${patientId}`),
  create: (data) => api.post('/evaluaciones', data),
  update: (id, data) => api.put(`/evaluaciones/${id}`, data),
  delete: (id) => api.delete(`/evaluaciones/${id}`),
};

// Servicios para Documentos
export const documentsService = {
  getAll: () => api.get('/documentos'),
  getByPatient: (patientId) => api.get(`/documentos/patient/${patientId}`),
  download: (id) => api.get(`/documentos/download/${id}`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/documentos/${id}`),
};

// Servicios para Dashboard
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getMonthlyStats: () => api.get('/dashboard/monthly-stats'),
};

// Servicios para Búsqueda
export const searchService = {
  patients: (query, page = 1, limit = 10) => 
    api.get(`/buscar/pacientes?q=${query}&page=${page}&limit=${limit}`),
  global: (query) => api.get(`/buscar/global?q=${query}`),
};

export default api;
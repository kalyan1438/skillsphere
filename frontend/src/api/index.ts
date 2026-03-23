import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Public
export const getCourses       = ()           => api.get('/courses');
export const getCourseById    = (id: string) => api.get(`/courses/${id}`);
export const getFaculty       = ()           => api.get('/faculty');
export const getAnnouncements = ()           => api.get('/announcements');

// Registration OTP flow
export const requestRegistration = (d: object) => api.post('/registrations/request', d);
export const verifyOTP           = (d: object) => api.post('/registrations/verify-otp', d);
export const resendOTP           = (d: object) => api.post('/registrations/resend-otp', d);

// Admin auth
export const loginAdmin    = (d: object) => api.post('/admin/login', d);
export const getDashboard  = ()          => api.get('/admin/dashboard');

// Admin courses
export const adminGetCourses  = ()                    => api.get('/courses/all');
export const createCourse     = (d: object)           => api.post('/courses', d);
export const updateCourse     = (id: string, d: object) => api.put(`/courses/${id}`, d);
export const deleteCourse     = (id: string)          => api.delete(`/courses/${id}`);

// Admin faculty
export const adminGetFaculty  = ()                    => api.get('/faculty/all');
export const createFaculty    = (d: object)           => api.post('/faculty', d);
export const updateFaculty    = (id: string, d: object) => api.put(`/faculty/${id}`, d);
export const deleteFaculty    = (id: string)          => api.delete(`/faculty/${id}`);

// Admin announcements
export const adminGetAnnouncements = ()           => api.get('/announcements/all');
export const createAnnouncement    = (d: object)  => api.post('/announcements', d);
export const deleteAnnouncement    = (id: string) => api.delete(`/announcements/${id}`);

// Admin registrations
export const getRegistrations        = (p?: object)           => api.get('/registrations', { params: p });
export const updateRegistrationStatus = (id: string, d: object) => api.patch(`/registrations/${id}/status`, d);

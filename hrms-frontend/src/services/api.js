import axios from 'axios';

// We create an Axios instance so we don't have to type the base URL every time.
const api = axios.create({
    // VITE_API_BASE_URL will be set in Vercel to point to your Render backend
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getEmployees = () => api.get('employees/');
export const createEmployee = (employeeData) => api.post('employees/', employeeData);
export const deleteEmployee = (employeeId) => api.delete(`employees/${employeeId}`);

export const getAttendance = (employeeId) => api.get(`attendance/${employeeId}`);
export const markAttendance = (attendanceData) => api.post('attendance/', attendanceData);

export default api;

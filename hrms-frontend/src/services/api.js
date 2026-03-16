import axios from 'axios';

// We create an Axios instance so we don't have to type the base URL every time.
// This is exactly like configuring new HttpClient { BaseAddress = new Uri("http://localhost:8000/api/") } in C#.
const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
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

import React, { useState, useEffect } from 'react';
import { getEmployees, getAttendance, markAttendance } from '../services/api';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    
    // State for Marking Attendance
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default today's date
        status: 'Present'
    });

    // 1. Load employees on page load for the dropdown
    useEffect(() => {
        const fetchEmps = async () => {
            try {
                const res = await getEmployees();
                setEmployees(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEmps();
    }, []);

    // 2. Load attendance when an employee is selected from the dropdown
    useEffect(() => {
        if (selectedEmployee) {
            fetchAttendance(selectedEmployee);
        } else {
            setAttendanceRecords([]);
        }
    }, [selectedEmployee]); // This array means "Run this effect whenever selectedEmployee changes"

    const fetchAttendance = async (empId) => {
        try {
            const res = await getAttendance(empId);
            setAttendanceRecords(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 3. EVENT HANDLERS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            alert('Please select an employee first!');
            return;
        }

        try {
            await markAttendance({
                employee_id: selectedEmployee,
                ...formData
            });
            // Refresh
            fetchAttendance(selectedEmployee);
        } catch (err) {
            const backendError = err.response?.data?.detail || 'Failed to mark attendance.';
            alert(backendError);
        }
    };

    return (
        <div>
            {/* DROP DOWN SELECTOR */}
            <div className="card">
                <h2>Manage Attendance</h2>
                <div className="form-group">
                    <label>Select Employee *</label>
                    <select 
                        className="form-control" 
                        value={selectedEmployee} 
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        <option value="">-- Select an Employee --</option>
                        {employees.map(emp => (
                            <option key={emp.employee_id} value={emp.employee_id}>
                                {emp.full_name} ({emp.employee_id})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* If an employee is selected, show the rest of the UI */}
            {selectedEmployee && (
                <>
                    {/* MARK ATTENDANCE FORM */}
                    <div className="card">
                        <h3>Mark Daily Attendance</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Date</label>
                                <input type="date" name="date" className="form-control" value={formData.date} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Status</label>
                                <select name="status" className="form-control" value={formData.status} onChange={handleInputChange}>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Mark Attendance</button>
                            </div>
                        </form>
                    </div>

                    {/* ATTENDANCE HISTORY GRID */}
                    <div className="card">
                        <h3>Attendance History</h3>
                        {attendanceRecords.length === 0 ? (
                            <div className="empty-state">No attendance records found for this employee.</div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceRecords.map((record) => (
                                        <tr key={record.id}>
                                            <td>{record.date}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.85em',
                                                    backgroundColor: record.status === 'Present' ? '#d4edda' : '#f8d7da',
                                                    color: record.status === 'Present' ? '#155724' : '#721c24'
                                                }}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Attendance;

import React, { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

const Employees = () => {
    // 1. STATE (Like private variables that trigger a UI refresh when changed)
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for the new employee form
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });

    // 2. EFFECT (Runs once on page load to fetch data)
    useEffect(() => {
        fetchEmployees();
    }, []);

    // Helper to fetch data
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await getEmployees();
            setEmployees(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    };

    // 3. EVENT HANDLERS
    // Handle typing in the textboxes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // ...formData copies existing state, then we override the specific field
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            await createEmployee(formData);
            // Clear form
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            // Refresh grid
            fetchEmployees();
        } catch (err) {
            // Show error message from backend if validation failed (e.g. Duplicate ID)
            const backendError = err.response?.data?.detail || 'Failed to add employee.';
            alert(backendError);
        }
    };

    // Handle delete button
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                // Refresh grid
                fetchEmployees();
            } catch (err) {
                alert('Failed to delete employee.');
            }
        }
    };

    // 4. RENDER UI
    if (loading && employees.length === 0) return <div className="loading-state">Loading employees...</div>;

    return (
        <div>
            {/* ADD EMPLOYEE FORM */}
            <div className="card">
                <h2>Add New Employee</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Employee ID *</label>
                        <input type="text" name="employee_id" className="form-control" value={formData.employee_id} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Department *</label>
                        <input type="text" name="department" className="form-control" value={formData.department} onChange={handleInputChange} required />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <button type="submit" className="btn btn-primary">Add Employee</button>
                    </div>
                </form>
            </div>

            {/* EMPLOYEE LIST DATA GRID */}
            <div className="card">
                <h2>Employee Directory</h2>
                {error && <div className="error-state" style={{padding: '1rem', marginBottom: '1rem'}}>{error}</div>}
                
                {employees.length === 0 ? (
                    <div className="empty-state">No employees found. Please add some!</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.employee_id}>
                                    <td>{emp.employee_id}</td>
                                    <td>{emp.full_name}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.department}</td>
                                    <td>
                                        <button onClick={() => handleDelete(emp.employee_id)} className="btn btn-danger" style={{padding: '0.25rem 0.5rem'}}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Employees;

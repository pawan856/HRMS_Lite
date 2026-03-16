import React, { useState, useEffect } from 'react';
import { getEmployees } from '../services/api';

const Dashboard = () => {
    // State to hold our data
    const [stats, setStats] = useState({ totalEmployees: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // useEffect runs once when the component mounts (like Page_Load)
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all employees to get the count
                const res = await getEmployees();
                setStats({ totalEmployees: res.data.length });
                setLoading(false);
            } catch (err) {
                setError('Failed to load dashboard data.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Empty array means run once on mount

    if (loading) return <div className="loading-state">Loading dashboard...</div>;
    if (error) return <div className="error-state">{error}</div>;

    return (
        <div className="card">
            <h1>HRMS Overview</h1>
            <p>Welcome to the Human Resource Management System.</p>
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eef2f5', borderRadius: '8px', display: 'inline-block' }}>
                <h2>Total Employees</h2>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {stats.totalEmployees}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

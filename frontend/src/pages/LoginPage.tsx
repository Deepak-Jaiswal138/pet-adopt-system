import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.replace('/'); // Simple reload to update Navbar state
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }} className="animate-fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Login</h1>
            {error && <div className="badge badge-error" style={{ marginBottom: '1rem', display: 'block' }}>{error}</div>}
            <form onSubmit={submitHandler} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                    Sign In
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                New Customer? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register</Link>
            </p>
        </div>
    );
};

export default LoginPage;

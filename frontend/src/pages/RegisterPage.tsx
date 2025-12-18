import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/register', {
                name,
                email,
                password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.reload(); // Quick refresh to update auth state
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }} className="animate-fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Register</h1>
            {message && <div className="badge badge-error" style={{ marginBottom: '1rem', display: 'block' }}>{message}</div>}
            <form onSubmit={submitHandler} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Confirm Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                    Register
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                Have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
            </p>
        </div>
    );
};

export default RegisterPage;

import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    // Mock auth state for now, will replace with context later
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo') || 'null'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/login');
    };

    return (
        <nav style={{
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    <PawPrint size={32} />
                    PetAdopt
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Pets</Link>

                    {userInfo ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {userInfo.isAdmin && (
                                <Link to="/admin/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    <LayoutDashboard size={16} /> Admin
                                </Link>
                            )}
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text)' }}>
                                <User size={20} />
                                {userInfo.name.split(' ')[0]}
                            </Link>
                            <button onClick={logoutHandler} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" style={{ color: 'var(--text)', fontWeight: 500 }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="container" style={{ padding: '2rem 1rem', flex: 1 }}>
                <Outlet />
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border)',
                marginTop: 'auto'
            }}>
                <p>&copy; {new Date().getFullYear()} Pet Adoption System.</p>
            </footer>
        </>
    );
};

export default Layout;

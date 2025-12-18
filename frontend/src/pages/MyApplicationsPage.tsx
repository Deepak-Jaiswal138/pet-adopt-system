import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    useEffect(() => {
        const fetchApplications = async () => {
            if (!userInfo) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5001/api/applications/my', config);
                setApplications(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (!userInfo) return <div className="container" style={{ paddingTop: '2rem' }}>Please login to view your applications.</div>;
    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Applications</h1>
            {applications.length === 0 ? (
                <div className="card">You haven't applied for any pets yet. <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Find a pet</Link> to adopt!</div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {applications.map((app: any) => (
                        <div key={app._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                                    {app.pet?.imageUrl ? (
                                        <img src={app.pet.imageUrl} alt={app.pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : null}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem' }}>{app.pet?.name || 'Unknown Pet'}</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Status: <span style={{ fontWeight: 600, color: app.status === 'Approved' ? 'var(--success)' : app.status === 'Rejected' ? 'var(--error)' : 'var(--primary)' }}>{app.status}</span></p>
                                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Link to={`/pets/${app.pet?._id}`} className="btn btn-secondary">
                                View Pet
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Calendar, Info, Heart } from 'lucide-react';

const PetDetailsPage = () => {
    const { id } = useParams();
    const [pet, setPet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);
    const [applicationMsg, setApplicationMsg] = useState('');
    const [applicationStatus, setApplicationStatus] = useState<any>(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/pets/${id}`);
                setPet(data);
                setLoading(false);
            } catch (err) {
                setError('Pet not found');
                setLoading(false);
            }
        };

        const checkApplication = async () => {
            if (userInfo && id) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    // Ideally we should have an endpoint to check if user applied to specific pet, 
                    // or fetch all user applications and check. For now, we'll fetch my applications to check.
                    const { data } = await axios.get('http://localhost:5001/api/applications/my', config);
                    const existingApp = data.find((app: any) => app.pet._id === id);
                    if (existingApp) {
                        setApplicationStatus(existingApp);
                    }
                } catch (err) {
                    console.error('Error checking application', err);
                }
            }
        };

        fetchPet();
        if (userInfo) checkApplication();
    }, [id]);

    const handleApply = async () => {
        if (!window.confirm('Are you sure you want to apply to adopt this pet?')) return;

        try {
            setApplying(true);
            await axios.post(
                'http://localhost:5001/api/applications',
                { petId: id, message: 'I would love to adopt this pet!' },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            setApplicationMsg('Application submitted successfully!');
            setApplying(false);
            // Re-fetch application status
            setApplicationStatus({ status: 'Pending' });
        } catch (err: any) {
            setApplicationMsg(err.response?.data?.message || 'Application failed');
            setApplying(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;
    if (error) return <div className="container" style={{ paddingTop: '2rem' }}>{error} <Link to="/">Go Back</Link></div>;
    if (!pet) return null;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                <ChevronLeft size={16} /> Back to Pets
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    {pet.imageUrl ? (
                        <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', display: 'block' }} />
                    ) : (
                        <div style={{ padding: '5rem', backgroundColor: '#e2e8f0', textAlign: 'center', color: '#94a3b8' }}>No Image Available</div>
                    )}
                </div>

                <div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{pet.name}</h1>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>{pet.species}</span>
                        <span className="badge" style={{ backgroundColor: 'var(--surface-hover)' }}>{pet.breed}</span>
                        {pet.adopted && <span className="badge badge-success">Adopted</span>}
                    </div>

                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} /> Age
                                </h3>
                                <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{pet.age} Years</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={14} /> Status
                                </h3>
                                <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{pet.adopted ? 'Adopted' : 'Available'}</p>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>About {pet.name}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
                        {pet.description}
                    </p>

                    {userInfo ? (
                        applicationStatus ? (
                            <div className="card" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: 'var(--primary)' }}>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Application Status: <span style={{ fontWeight: 'bold' }}>{applicationStatus.status}</span></h3>
                                <p>You have submitted an application for {pet.name}.</p>
                            </div>
                        ) : !pet.adopted ? (
                            <>
                                {applicationMsg && <div className="badge badge-success" style={{ marginBottom: '1rem', display: 'block' }}>{applicationMsg}</div>}
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                                >
                                    <Heart style={{ marginRight: '0.5rem' }} /> {applying ? 'Submitting...' : 'Apply to Adopt'}
                                </button>
                            </>
                        ) : (
                            <button disabled className="btn btn-secondary" style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }}>
                                This pet has been adopted
                            </button>
                        )
                    ) : (
                        <div className="card" style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: '1rem' }}>Please login to apply for adoption.</p>
                            <Link to="/login" className="btn btn-primary">Login to Apply</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;

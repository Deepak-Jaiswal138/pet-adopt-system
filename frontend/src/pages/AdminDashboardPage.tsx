import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Check, X } from 'lucide-react';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'pets'
    const [applications, setApplications] = useState<any[]>([]);
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const navigate = useNavigate();

    // Pet Form State (for adding/editing - kept simple for this file, ideally a separate component or modal)
    const [showPetForm, setShowPetForm] = useState(false);
    const [petFormData, setPetFormData] = useState({
        name: '', species: 'Dog', breed: '', age: '', description: '', imageUrl: ''
    });

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            try {
                const [appsRes, petsRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/applications', config),
                    axios.get('http://localhost:5001/api/pets', config) // Admin access might not be needed for just reading pets, but good for consistency
                ]);
                setApplications(appsRes.data);
                setPets(petsRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]); // simplistic dependency

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`http://localhost:5001/api/applications/${id}`, { status }, config);
            // Optimistic update
            setApplications(apps => apps.map((app: any) => app._id === id ? { ...app, status } : app));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDeletePet = async (id: string) => {
        if (!window.confirm('Delete this pet?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`http://localhost:5001/api/pets/${id}`, config);
            setPets(curPets => curPets.filter((p: any) => p._id !== id));
        } catch (error) {
            alert('Failed to delete pet');
        }
    };

    const handleCreatePet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('http://localhost:5001/api/pets', petFormData, config);
            setPets([...pets, data]);
            setShowPetForm(false);
            setPetFormData({ name: '', species: 'Dog', breed: '', age: '', description: '', imageUrl: '' });
        } catch (error) {
            alert('Failed to create pet');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab('applications')}
                    style={{
                        padding: '1rem',
                        borderBottom: activeTab === 'applications' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'applications' ? 'var(--primary)' : 'var(--text-muted)',
                        background: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600
                    }}
                >
                    Applications
                </button>
                <button
                    onClick={() => setActiveTab('pets')}
                    style={{
                        padding: '1rem',
                        borderBottom: activeTab === 'pets' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'pets' ? 'var(--primary)' : 'var(--text-muted)',
                        background: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600
                    }}
                >
                    Manage Pets
                </button>
            </div>

            {activeTab === 'applications' && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Pet</th>
                                <th style={{ padding: '1rem' }}>Applicant</th>
                                <th style={{ padding: '1rem' }}>Message</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app: any) => (
                                <tr key={app._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{app.pet?.name || 'Unknown'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div>{app.user?.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.user?.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '300px' }}>{app.message}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge ${app.status === 'Approved' ? 'badge-success' : app.status === 'Rejected' ? 'badge-error' : ''}`}
                                            style={{ backgroundColor: app.status === 'Pending' ? 'var(--surface-hover)' : undefined }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {app.status === 'Pending' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleStatusUpdate(app._id, 'Approved')} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--success)', color: 'white' }} title="Approve">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--error)', color: 'white' }} title="Reject">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'pets' && (
                <div>
                    <button onClick={() => setShowPetForm(!showPetForm)} className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
                        <Plus size={16} /> Add New Pet
                    </button>

                    {showPetForm && (
                        <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                            <h2 style={{ marginBottom: '1rem' }}>Add New Pet</h2>
                            <form onSubmit={handleCreatePet} style={{ display: 'grid', gap: '1rem' }}>
                                <input type="text" placeholder="Name" className="input" value={petFormData.name} onChange={e => setPetFormData({ ...petFormData, name: e.target.value })} required />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <select className="input" value={petFormData.species} onChange={e => setPetFormData({ ...petFormData, species: e.target.value })}>
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input type="text" placeholder="Breed" className="input" value={petFormData.breed} onChange={e => setPetFormData({ ...petFormData, breed: e.target.value })} required />
                                </div>
                                <input type="number" placeholder="Age" className="input" value={petFormData.age} onChange={e => setPetFormData({ ...petFormData, age: e.target.value })} required />
                                <input type="text" placeholder="Image URL" className="input" value={petFormData.imageUrl} onChange={e => setPetFormData({ ...petFormData, imageUrl: e.target.value })} />
                                <textarea placeholder="Description" className="input" rows={4} value={petFormData.description} onChange={e => setPetFormData({ ...petFormData, description: e.target.value })} required></textarea>
                                <button type="submit" className="btn btn-primary">Create Pet</button>
                            </form>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {pets.map((pet: any) => (
                            <div key={pet._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: 600 }}>{pet.name}</h3>
                                    <button onClick={() => handleDeletePet(pet._id)} style={{ color: 'var(--error)', background: 'none' }} title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pet.breed} • {pet.age} years</p>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                    Status: {pet.adopted ? <span style={{ color: 'var(--success)' }}>Adopted</span> : 'Available'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [filters, setFilters] = useState({
        species: '',
        age: '',
        breed: ''
    });

    useEffect(() => {
        const fetchPets = async () => {
            try {
                // Construct query string manually for now or use URLSearchParams
                let query = `?keyword=${keyword}`;
                // Note: Backend might need updates to handle specific field filters separately if we want strict filtering
                // For now, keyword search on backend covers name and breed. 
                // We'll implement client-side filtering for species/age for simplicity unless backend supports it fully.

                const { data } = await axios.get(`http://localhost:5001/api/pets${query}`);

                // Client-side filtering for properties not covered by backend 'keyword' search yet
                let filteredData = data;
                if (filters.species) {
                    filteredData = filteredData.filter((pet: any) => pet.species.toLowerCase() === filters.species.toLowerCase());
                }
                // Add logic for age if needed (e.g., ranges)

                setPets(filteredData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pets:', error);
                setLoading(false);
            }
        };

        fetchPets();
    }, [keyword, filters]);

    return (
        <div className="animate-fade-in">
            <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
                    Find Your New Best Friend
                </h1>
                <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Browse our available pets and give them the loving home they deserve.
                </p>
            </section>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input"
                        style={{ paddingLeft: '3rem' }}
                        placeholder="Search by name or breed..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        className="input"
                        style={{ width: 'auto', cursor: 'pointer' }}
                        value={filters.species}
                        onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                    >
                        <option value="">All Species</option>
                        <option value="Dog">Dogs</option>
                        <option value="Cat">Cats</option>
                        <option value="Bird">Birds</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading pets...</div>
            ) : pets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No pets found matching your criteria.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {pets.map((pet: any) => (
                        <div key={pet._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ height: '200px', backgroundColor: '#e2e8f0', borderRadius: 'calc(var(--radius) - 4px)', marginBottom: '1rem', overflow: 'hidden' }}>
                                {pet.imageUrl ? (
                                    <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{pet.name}</h3>
                                    <span className="badge" style={{ backgroundColor: 'var(--surface-hover)' }}>{pet.species}</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{pet.breed} • {pet.age} years old</p>
                                <p style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
                                    {pet.description}
                                </p>
                            </div>
                            <Link to={`/pets/${pet._id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;

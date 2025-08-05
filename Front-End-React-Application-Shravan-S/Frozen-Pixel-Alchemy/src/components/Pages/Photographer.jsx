import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Photographer = () => {
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    // Fetch photographers from MySQL database
    const fetchPhotographers = useCallback(async (attempt = 1) => {
        try {
            if (attempt > 1) {
                setIsRetrying(true);
            } else {
                setLoading(true);
            }
            
            // Fetch from Spring Boot backend
            const response = await fetch('http://localhost:8080/api/photographers', {
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setPhotographers(data);
            setError('');
            setRetryCount(attempt);
        } catch (err) {
            console.error('Error fetching photographers:', err);
            
            if (attempt < 3) {
                // Retry up to 3 times
                setTimeout(() => {
                    fetchPhotographers(attempt + 1);
                }, 2000 * attempt); // Exponential backoff
            } else {
                setError(`Failed to load photographers from database. ${err.message}`);
                // Use fallback data if available
                setPhotographers(getFallbackPhotographers());
            }
            setRetryCount(attempt);
        } finally {
            setLoading(false);
            setIsRetrying(false);
        }
    }, []);

    useEffect(() => {
        fetchPhotographers();
    }, [fetchPhotographers]);

    const handleRetry = () => {
        setRetryCount(0);
        setError('');
        const newAttempt = retryCount + 1;
        fetchPhotographers(newAttempt);
    };

    // Fallback data in case database is not available
    const getFallbackPhotographers = () => [
        {
            photographerId: 1,
            firstName: "John",
            lastName: "Smith",
            bio: "Professional landscape photographer with 10+ years experience.",
            profilePictureUrl: "https://via.placeholder.com/150"
        },
        {
            photographerId: 2,
            firstName: "Sarah",
            lastName: "Johnson",
            bio: "Wedding and portrait specialist focused on natural lighting.",
            profilePictureUrl: "https://via.placeholder.com/150"
        },
        {
            photographerId: 3,
            firstName: "Mike",
            lastName: "Chen",
            bio: "Street photography and urban exploration enthusiast.",
            profilePictureUrl: "https://via.placeholder.com/150"
        }
    ];

    if (loading) {
        return (
            <div>
                <nav className='pg-list'>
                    <h1>Photographers</h1>
                </nav>
                <div className="loading-spinner">
                    <p>Loading photographers from database...</p>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <nav className='pg-list'>
                <h1>Our Photographers</h1>
            </nav>

            {error && (
                <div className="warning-banner">
                    <p>⚠️ {error}</p>
                    <p>Showing sample data. Database may be offline.</p>
                    <button onClick={handleRetry} disabled={isRetrying}>
                        {isRetrying ? 'Retrying...' : 'Retry Connection'}
                    </button>
                </div>
            )}

            {!error && photographers.length > 0 && (
                <div className="success-banner">
                    <p>✅ Successfully loaded {photographers.length} photographers from database!</p>
                </div>
            )}

            <div className="photographer-list">
                {photographers.length > 0 ? (
                    photographers.map((photographer) => (
                        <div key={photographer.photographerId} className="card">
                            <div className="photographer-info">
                                <img 
                                    src={photographer.profilePictureUrl || "https://via.placeholder.com/150"} 
                                    alt={`${photographer.firstName} ${photographer.lastName}`}
                                    className="photographer-image"
                                />
                                <h3 className="photographer-name">
                                    {photographer.firstName} {photographer.lastName}
                                </h3>
                                <p className="photographer-bio">
                                    {photographer.bio || "Professional photographer"}
                                </p>
                                <Link 
                                    to={`/photographer/${photographer.photographerId}`}
                                    className="photographer-link"
                                >
                                    View Portfolio
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-photographers">
                        <p>No photographers found in the database.</p>
                        <button onClick={handleRetry}>Retry</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Photographer;

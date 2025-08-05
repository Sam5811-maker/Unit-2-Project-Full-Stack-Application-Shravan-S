import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Photographer = () => {
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);
    const [selectedPhotographer, setSelectedPhotographer] = useState(null);

    // Helper function to validate and sanitize image URLs
    const getValidImageUrl = (url, photographerId) => {
        console.log(`Processing image URL for photographer ID ${photographerId}:`, {
            originalUrl: url,
            photographerId: photographerId
        });
        
        // Primary fallback images (different from emergency fallbacks)
        const primaryFallbacks = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", // Professional man
            "https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=150&h=150&fit=crop&crop=face", // Professional woman
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", // Creative man
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", // Creative woman
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", // Artist man
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", // Artist woman
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face", // Photographer man
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"  // Photographer woman
        ];
        
        // If no URL provided, select based on photographer ID for consistency
        if (!url) {
            const imageIndex = photographerId ? photographerId % primaryFallbacks.length : 0;
            const selectedImage = primaryFallbacks[imageIndex];
            console.log(`No URL provided, using primary fallback image ${imageIndex}:`, selectedImage);
            return selectedImage;
        }
        
        // Check for known invalid URLs
        if (url.includes('default-profile-picture.com') || 
            url.includes('example.com') || 
            url.includes('placeholder.com/default') ||
            url.includes('via.placeholder.com')) {
            const imageIndex = photographerId ? photographerId % primaryFallbacks.length : 0;
            const selectedImage = primaryFallbacks[imageIndex];
            console.log(`Invalid URL detected, using primary fallback image ${imageIndex}:`, selectedImage);
            return selectedImage;
        }
        
        // Return the URL if it seems valid
        console.log(`Using original URL:`, url);
        return url;
    };

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
            firstName: "Emily",
            lastName: "Rodriguez",
            bio: "Award-winning nature photographer specializing in wildlife and landscapes.",
            profilePictureUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        },
        {
            photographerId: 2,
            firstName: "Eli",
            lastName: "Carter",
            bio: "Professional event and corporate photographer with expertise in lighting.",
            profilePictureUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
            photographerId: 3,
            firstName: "Nina",
            lastName: "Gray",
            bio: "Creative portrait photographer specializing in artistic compositions.",
            profilePictureUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
            photographerId: 4,
            firstName: "Michael",
            lastName: "Chen",
            bio: "Wedding and portrait photographer with 10 years of experience.",
            profilePictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            photographerId: 5,
            firstName: "Sarah",
            lastName: "Williams",
            bio: "Street and urban photography specialist capturing city life.",
            profilePictureUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=150&h=150&fit=crop&crop=face"
        }
    ];

    if (loading) {
        return (
            <div>
                <nav className='pg-list'>
                    <h1>Photographers</h1>
                </nav>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                    <div className="loading-spinner" />
                    <p style={{ marginTop: '1rem', fontWeight: 500 }}>Loading photographers from database...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <nav className='pg-list'>
                <h1>Photographers Portfolio</h1>
                {selectedPhotographer && (
                    <button 
                        onClick={() => setSelectedPhotographer(null)}
                        className="back-button"
                    >
                        ← Back to List
                    </button>
                )}
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

            {selectedPhotographer ? (
                // Detailed view for selected photographer
                <div className="photographer-detail">
                    <div className="detail-card">
                        <div className="photographer-detail-info">
                            <img 
                                src={getValidImageUrl(selectedPhotographer.profilePictureUrl, selectedPhotographer.photographerId)} 
                                alt={`${selectedPhotographer.firstName} ${selectedPhotographer.lastName}`}
                                className="photographer-detail-image"
                                onError={(e) => {
                                    // Only log a warning if the originalUrl is not null and not a fallback
                                    const originalUrl = selectedPhotographer.profilePictureUrl;
                                    const fallbackUrls = [
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
                                    ];
                                    if (originalUrl && !fallbackUrls.includes(originalUrl)) {
                                        console.warn(`Image failed for ${selectedPhotographer.firstName} ${selectedPhotographer.lastName}:`, {
                                            originalUrl: originalUrl,
                                            currentSrc: e.target.src,
                                            photographerId: selectedPhotographer.photographerId
                                        });
                                    }
                                    // Use emergency fallback for detail view
                                    const emergencyFallbacks = [
                                        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=300&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&crop=face"
                                    ];
                                    const imageIndex = selectedPhotographer.photographerId % emergencyFallbacks.length;
                                    const emergencyUrl = emergencyFallbacks[imageIndex];
                                    if (!e.target.src.includes('photo-1560250097') && !e.target.src.includes('photo-1506794778202')) {
                                        e.target.src = emergencyUrl;
                                    } else {
                                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTYwIDI0MEM2MCAyMDAgMTAwIDE4MCAxNTAgMTgwUzI0MCAyMDAgMjQwIDI0MFYzMDBINjBWMjQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                                    }
                                }}
                            />
                            <div className="photographer-detail-text">
                                <h2 className="photographer-detail-name">
                                    {selectedPhotographer.firstName} {selectedPhotographer.lastName}
                                </h2>
                                <p className="photographer-detail-bio">
                                    {selectedPhotographer.bio || "Professional photographer"}
                                </p>
                                {selectedPhotographer.specialties && (
                                    <div className="photographer-specialties">
                                        <h4>Specialties:</h4>
                                        <p>{selectedPhotographer.specialties}</p>
                                    </div>
                                )}
                                {selectedPhotographer.email && (
                                    <div className="photographer-contact">
                                        <h4>Contact:</h4>
                                        <p>{selectedPhotographer.email}</p>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // List view - names and bios only
                <div className="photographer-list">
                    {photographers.length > 0 ? (
                        photographers.map((photographer) => (
                            <div 
                                key={photographer.photographerId} 
                                className="photographer-list-item"
                                onClick={() => setSelectedPhotographer(photographer)}
                            >
                                <h3 className="photographer-list-name">
                                    {photographer.firstName} {photographer.lastName}
                                </h3>
                                <p className="photographer-list-bio">
                                    {photographer.bio || "Professional photographer"}
                                </p>
                                <div className="photographer-list-action">
                                    <span>Click to view details →</span>
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
            )}
        </div>
    );
};

export default Photographer;

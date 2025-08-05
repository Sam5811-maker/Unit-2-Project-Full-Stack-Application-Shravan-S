
import { useNavigate } from "react-router-dom";
import Button from "../Shared/Button";
import LoadingSpinner from "../Shared/LoadingSpinner";
import usePexelsImages from "../../hooks/usePexelsImages";
import "../../stylesheets/HomeStyleSheet.css";

const Home = () => {
  const navigate = useNavigate();
  
  // Fetch different types of images using Pexels API
  const { 
    images: homeImages, 
    loading: homeLoading, 
    error: homeError 
  } = usePexelsImages("photography portfolio", 6);
  
  const { 
    images: recentImages, 
    loading: recentLoading, 
    error: recentError 
  } = usePexelsImages("recent photographs", 8);
  
  return (
      <div>
        <h1 className="h-title">Welcome to Frozen Pixel Alchemy....!</h1>
          <h2>"Photography is the pause button of life."</h2>
            <p>
                Jack Monroe is a passionate visual storyteller, renowned for capturing the unseen beauty in everyday moments and monumental events alike. With an instinctive eye for light, composition, and emotion, Jack has spent over a decade transforming fleeting instants into timeless imagery. From quiet portraits to bustling cityscapes and sunlit weddings, his portfolio spans across genres but remains united by a single goal: to tell authentic human stories.
            </p>
            <p>
                Over the years, Jack's work has been featured by leading publications, exhibited in art galleries, and trusted by clients ranging from young couples to international brands. His approach is grounded in empathy, artistry, and a deep understanding of what makes a moment truly unforgettable.
            </p>
            <p>
                Whether you're looking to document your milestone, launch a creative brand, or simply celebrate who you are, Jack offers more than just photography—he offers connection, clarity, and a vision.
          </p>
      
      <div className="home-imgs">
        {homeLoading ? (
          <LoadingSpinner message="Loading portfolio images..." />
        ) : homeError ? (
          <div className="error-message">
            <p>Error loading images: {homeError}</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Please make sure you have configured your Pexels API key in the .env file.
            </p>
          </div>
        ) : (
          homeImages.map((image) => (
            <div key={image.id} className="image-container">
              <img 
                src={image.src} 
                width="250px" 
                height="250px" 
                alt={image.alt}
                loading="lazy"
              />
              <div className="image-credit">
                Photo by <a href={image.photographer_url} target="_blank" rel="noopener noreferrer">
                  {image.photographer}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <br />

      <Button className="learn-more-btn" onClick={() => navigate("/about")}>
        → Learn More About Jack
      </Button>

      <br />

      <h1>Recent Clicks...</h1>

      <div className="clicks">
        {recentLoading ? (
          <LoadingSpinner message="Loading recent images..." />
        ) : recentError ? (
          <div className="error-message">
            <p>Error loading recent images: {recentError}</p>
          </div>
        ) : (
          recentImages.map((image) => (
            <div key={image.id} className="image-container">
              <img 
                src={image.src} 
                width="250px" 
                height="250px" 
                alt={image.alt}
                loading="lazy"
              />
              <div className="image-credit">
                Photo by <a href={image.photographer_url} target="_blank" rel="noopener noreferrer">
                  {image.photographer}
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};export default Home;
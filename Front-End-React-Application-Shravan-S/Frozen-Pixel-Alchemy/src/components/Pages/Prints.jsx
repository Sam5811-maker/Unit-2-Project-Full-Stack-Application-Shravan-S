// import React from 'react';
import '../../stylesheets/PrintStylingSheet.css';

const images = import.meta.glob('/src/assets/Images/Prints/*.{png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default',
});

function Prints() {
  const imageList = Object.values(images).map((src, index) => (
    <figure key={index} className="gallery-item">
      <img
        src={src}
        alt={`Gallery Print ${index + 1}`}
        className="gallery-prints"
        loading="lazy"
      />
    </figure>
  ));

  return (
    <div  >
      <h2 >Gallery Prints</h2>
      <div className="gallery-container">
        {imageList.length > 0 ? imageList : <p>No images found.</p>}
      </div>
    </div>
  );
}

export default Prints;

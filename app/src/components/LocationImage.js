import React from 'react';
import './LocationImage.css';

function LocationImage({ locationImage }) {
  if (!locationImage) {
    return <div className="location-image-placeholder">Select a location to view image</div>;
  }

  return (
    <div className="location-image-container">
      <img 
        src={`/${locationImage}`} 
        alt="Location" 
        className="location-image" 
      />
    </div>
  );
}

export default LocationImage;

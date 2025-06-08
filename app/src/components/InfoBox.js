import React from 'react';
import './InfoBox.css';

// Import all location images
import blankMap from '../maps/000-BLANK.png';
// You can dynamically import more images as needed

function InfoBox({ locations, selectedLocation }) {
  // Function to extract the display name from location image path
  const getLocationName = (imagePath) => {
    if (!imagePath) return '';
    return imagePath
      .replace('maps/', '')
      .replace('.png', '')
      .replace(/-/g, ' ');
  };

  // Get the proper image source based on the path in data.json
  const getImageSource = (imagePath) => {
    if (!imagePath) return null;
    
    // For demonstration - in a real app you'd either:
    // 1. Import all images and use a mapping object
    // 2. Use require.context for dynamic imports
    // 3. Or keep images in public folder
    
    // This is a simple fallback to the blank map
    return blankMap;
  };

  // If no location is selected or locations not yet loaded
  if (!selectedLocation || !locations[selectedLocation]) {
    return (
      <div className="info-box-wrapper">
        <h3>Location Information</h3>
        <div className="location-image-placeholder">Select a location on the map or from the list to view details.</div>
      </div>
    );
  }

  const location = locations[selectedLocation];
  const locationName = getLocationName(location.image);

  return (
    <div className="info-box-wrapper">
      <h3>{locationName}</h3>
      <div className="location-image-container">
        <img 
          src={getImageSource(location.image)} 
          alt={locationName}
          className="location-image" 
        />
      </div>
      <p>
        Location ID: {selectedLocation}<br />
        Click on the location to play its background music.
      </p>
    </div>
  );
}

export default InfoBox;

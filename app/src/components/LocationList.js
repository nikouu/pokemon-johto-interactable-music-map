import React from 'react';
import './LocationList.css';

function LocationList({ locations, selectedLocation, isPlaying, onLocationSelect, onLocationHover }) {
  // Function to extract the display name from location image path
  const getLocationName = (imagePath) => {
    if (!imagePath) return '';
    return imagePath
      .replace('maps/', '')
      .replace('.png', '')
      .replace(/-/g, ' ');
  };

  return (
    <div className="location-list-wrapper">
      <h2>Locations</h2>
      <div className="location-list-scroll">
        {Object.entries(locations).map(([id, location]) => (
          <div
            key={id}
            className={`location-item ${selectedLocation === id ? 'selected' : ''} ${selectedLocation === id && isPlaying ? 'playing' : ''}`}
            onClick={() => onLocationSelect(id)}
            onMouseEnter={() => onLocationHover(id)}
            onMouseLeave={() => onLocationHover(null)}
          >
            {getLocationName(location.image)}
            {selectedLocation === id && (
              <span className="play-status">
                {isPlaying ? '▶️' : '⏸️'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationList;

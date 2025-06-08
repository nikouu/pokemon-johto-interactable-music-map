import React, { useState, useEffect } from 'react';
import './LocationList.css';

function LocationList({ locations, selectedLocation, hoveredLocation, isPlaying, onLocationSelect, onLocationHover }) {
  const [musicGroups, setMusicGroups] = useState({});
  
  // Group locations by their YouTube links to find related ones
  useEffect(() => {
    const groupedByMusic = {};
    
    Object.entries(locations).forEach(([id, data]) => {
      if (data.youtube) {
        if (!groupedByMusic[data.youtube]) {
          groupedByMusic[data.youtube] = [];
        }
        groupedByMusic[data.youtube].push(id);
      }
    });
    
    setMusicGroups(groupedByMusic);
  }, [locations]);
  
  // Get related locations with the same music
  const getRelatedLocations = (locationId) => {
    if (!locationId || !locations[locationId] || !locations[locationId].youtube) {
      return [];
    }
    const youtubeLink = locations[locationId].youtube;
    return musicGroups[youtubeLink] || [];
  };

  // Find locations related to current selection and hover
  const relatedToSelected = selectedLocation ? getRelatedLocations(selectedLocation) : [];
  const relatedToHovered = hoveredLocation ? getRelatedLocations(hoveredLocation) : [];

  const handleLocationClick = (id) => {
    onLocationSelect(id);
  };

  const handleLocationHover = (id) => {
    onLocationHover && onLocationHover(id);
  };

  const handleLocationLeave = () => {
    onLocationHover && onLocationHover(null);
  };

  return (
    <div className="location-list-wrapper">
      <h2>Locations</h2>
      <div className="location-list-scroll">
        {Object.entries(locations).map(([id, location]) => {
          // Skip the blank/default location in the list
          if (id === '000') return null;
          
          // Determine classes based on selection/hover state
          const isSelected = selectedLocation === id;
          const isHovered = hoveredLocation === id;
          const isRelatedToSelected = relatedToSelected.includes(id) && id !== selectedLocation;
          const isRelatedToHovered = relatedToHovered.includes(id) && id !== hoveredLocation;
          
          let className = 'location-item';
          if (isSelected) className += ' selected';
          if (isHovered) className += ' hovered';
          if (isRelatedToSelected) className += ' related-selected';
          if (isRelatedToHovered) className += ' related-hovered';
          if (isSelected && isPlaying) className += ' playing';
          
          return (
            <div
              key={id}
              className={className}
              onClick={() => handleLocationClick(id)}
              onMouseEnter={() => handleLocationHover(id)}
              onMouseLeave={handleLocationLeave}
            >
              {id.padStart(3, '0')} {location.name}
              {isSelected && isPlaying && <span className="play-status">▶</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LocationList;

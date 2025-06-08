import React, { useState } from 'react';
import Map from './components/Map';
import LocationList from './components/LocationList';
import InfoBox from './components/InfoBox';
import MusicPlayer from './components/MusicPlayer';
import locationData from './data';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLocationSelect = (locationId) => {
    // If the same location is clicked again, toggle play/pause state
    if (selectedLocation === locationId) {
      setIsPlaying(!isPlaying);
    } else {
      // When selecting a new location, set it as selected and start playing
      setSelectedLocation(locationId);
      setIsPlaying(true);
    }
  };

  const handleLocationHover = (locationId) => {
    setHoveredLocation(locationId);
  };

  return (
    <div className="app-container">
      <div className="content-area">
        <div className="top-section">
          <div className="map-container">
            <Map 
              locations={locationData} 
              selectedLocation={selectedLocation}
              hoveredLocation={hoveredLocation}
              onLocationSelect={handleLocationSelect}
              onLocationHover={handleLocationHover}
            />
          </div>
          <div className="locations-container">
            <LocationList 
              locations={locationData}
              selectedLocation={selectedLocation}
              isPlaying={isPlaying}
              onLocationSelect={handleLocationSelect}
              onLocationHover={handleLocationHover}
            />
          </div>
        </div>
        <div className="bottom-section">
          <div className="info-container">
            <InfoBox 
              locations={locationData}
              selectedLocation={selectedLocation} 
            />
          </div>
          <div className="music-container">
            <MusicPlayer 
              locations={locationData}
              selectedLocation={selectedLocation}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import Map from './components/Map';
import LocationList from './components/LocationList';
import MusicPlayer from './components/MusicPlayer';
import locationData from './data';
import './App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mapWrapperRef = useRef(null);
  const locationListRef = useRef(null);
  
  // More precise height synchronization
  useEffect(() => {
    const syncHeights = () => {
      try {
        // Get the map wrapper element (includes the title)
        const mapWrapper = document.querySelector('.map-wrapper');
        // Get the locations list container
        const locationList = locationListRef.current;
        
        if (!mapWrapper || !locationList) {
          console.log('Elements not found yet');
          return;
        }
        
        // Get the actual height of the map wrapper
        const mapHeight = mapWrapper.offsetHeight;
        
        // Set the height of the locations container
        locationList.style.height = `${mapHeight}px`;
        
        // Find the location list header
        const locationHeader = locationList.querySelector('h2');
        const headerHeight = locationHeader ? locationHeader.offsetHeight + 20 : 50;
        
        // Calculate height for the scrollable area
        const scrollArea = locationList.querySelector('.location-list-scroll');
        if (scrollArea) {
          scrollArea.style.height = `${mapHeight - headerHeight}px`;
          console.log(`Heights synced - Map: ${mapHeight}px, Scroll Area: ${mapHeight - headerHeight}px`);
        }
      } catch (e) {
        console.error('Error syncing heights:', e);
      }
    };
    
    // Run sync when the image loads
    const mapImage = document.querySelector('.region-map');
    if (mapImage) {
      if (mapImage.complete) {
        syncHeights();
      } else {
        mapImage.onload = () => {
          syncHeights();
          // Run again after a short delay to account for any rendering delays
          setTimeout(syncHeights, 100);
        };
      }
    }

    // Initial sync with delay to ensure DOM is ready
    const initialSyncTimer = setTimeout(syncHeights, 300);
    
    // Also sync on window resize
    window.addEventListener('resize', syncHeights);
    
    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver(syncHeights);
    if (document.body) {
      observer.observe(document.body, { 
        childList: true,
        subtree: true,
        attributes: true
      });
    }
    
    // Cleanup
    return () => {
      clearTimeout(initialSyncTimer);
      window.removeEventListener('resize', syncHeights);
      observer.disconnect();
      if (mapImage) mapImage.onload = null;
    };
  }, [selectedLocation]);

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

  // Update to ensure we pass hoveredLocation to LocationList
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Johto Music Map</h1>
      </header>
      <div className="content-area">
        <div className="top-section">
          <div className="map-container" ref={mapWrapperRef}>
            <Map 
              locations={locationData} 
              selectedLocation={selectedLocation}
              hoveredLocation={hoveredLocation}
              onLocationSelect={handleLocationSelect}
              onLocationHover={handleLocationHover}
            />
          </div>
          <div className="locations-container" ref={locationListRef}>
            <LocationList 
              locations={locationData}
              selectedLocation={selectedLocation}
              hoveredLocation={hoveredLocation}
              isPlaying={isPlaying}
              onLocationSelect={handleLocationSelect}
              onLocationHover={handleLocationHover}
            />
          </div>
        </div>
        <div className="bottom-section">
          <div className="info-container">
            <h2>About This Project</h2>
            <div className="info-content">
              <h3>How to Use:</h3>
              <ul>
                <li>Click on any location on the map or in the list to select it and play its music</li>
                <li>Hover over a location to see other areas that share the same music theme (highlighted in the same color)</li>
                <li>Notice how routes, cities, and caves are connected through their musical identity</li>
                <li>Click the same location again to pause the music</li>
              </ul>
			  <br/>
              <p>
                <a href="https://github.com/nikouu/pokemon-johto-interactable-music-map" target="_blank" rel="noopener noreferrer">
                  View project on GitHub
                </a>. It's an experiment on vibe coding. <i>And you can tell.</i>
              </p>
            </div>
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

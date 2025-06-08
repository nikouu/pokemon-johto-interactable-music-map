import React, { useState, useEffect, useRef } from 'react';
import './Map.css';
import mapImage from '../maps/000-BLANK.png';

function Map({ locations, selectedLocation, hoveredLocation, onLocationSelect, onLocationHover }) {
  const [mapAreas, setMapAreas] = useState([]);
  const mapContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  
  // Calculate scale factor whenever the container size changes
  useEffect(() => {
    const updateScale = () => {
      if (mapContainerRef.current) {
        const imgElement = mapContainerRef.current.querySelector('.region-map');
        if (imgElement && imgElement.naturalWidth) {
          // Calculate scale based on actual rendered size vs. natural size
          const newScale = imgElement.clientWidth / imgElement.naturalWidth;
          setScale(newScale);
        }
      }
    };

    // Run on mount and whenever window is resized
    updateScale();
    window.addEventListener('resize', updateScale);
    
    // Create a new observer for the image load event
    const observer = new ResizeObserver(updateScale);
    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    // Define clickable areas for each location on the map
    // These coordinates are based on the original pixel art coordinates
    const areas = [
      { id: '001', name: 'New Bark Town', coords: '136,96,144,104' },
      { id: '002', name: 'Route 29', coords: '104,96,136,104' },
      { id: '003', name: 'Cherrygrove City', coords: '96,96,104,104' },
      { id: '004', name: 'Route 30', coords: '96,64,104,96' },
      { id: '005', name: 'Route 31', coords: '88,56,104,64' },
      { id: '006', name: 'Violet City', coords: '80,56,88,64' },
      { id: '007', name: 'Sprout Tower', coords: '83,56,87,60' },
      { id: '008', name: 'Route 32', coords: '80,64,88,120' },
      { id: '009', name: 'Ruins of Alph', coords: '73,73,79,79' },
      { id: '010', name: 'Union Cave', coords: '80,120,88,128' },
      { id: '011', name: 'Route 33', coords: '72,120,80,128' },
      { id: '012', name: 'Azalea Town', coords: '64,120,72,128' },
      { id: '013', name: 'Slowpoke Well', coords: '68,120,72,124' },
      { id: '014', name: 'Ilex Forest', coords: '48,120,64,128' },
      { id: '015', name: 'Route 34', coords: '48,96,56,120' },
      { id: '016', name: 'Goldenrod City', coords: '48,88,56,96' },
      { id: '017', name: 'Radio Tower', coords: '48,90,52,94' },
      { id: '018', name: 'Route 35', coords: '48,64,56,88' },
      { id: '019', name: 'National Park', coords: '48,56,56,64' },
      // Add more areas for all locations in the same format
      // Format: { id: 'locationId', name: 'Location Name', coords: 'x1,y1,x2,y2' }
    ];
    
    setMapAreas(areas);
  }, []);

  const handleAreaClick = (id) => {
    onLocationSelect(id);
  };

  const handleAreaHover = (id) => {
    onLocationHover(id);
  };

  const handleAreaLeave = () => {
    onLocationHover(null);
  };

  return (
    <div className="map-wrapper">
      <h2>Johto Region Map</h2>
      <div className="map-content" ref={mapContainerRef}>
        <div className="map-container">
          <img 
            src={mapImage} 
            alt="Johto Region Map" 
            className="region-map"
            useMap="#johto-map"
          />
          <map name="johto-map">
            {mapAreas.map(area => (
              <area
                key={area.id}
                shape="rect"
                coords={area.coords}
                alt={area.name}
                title={area.name}
                className={`map-area ${selectedLocation === area.id ? 'selected' : ''} ${hoveredLocation === area.id ? 'hovered' : ''}`}
                onClick={() => handleAreaClick(area.id)}
                onMouseEnter={() => handleAreaHover(area.id)}
                onMouseLeave={handleAreaLeave}
              />
            ))}
          </map>
          
          {/* Overlay for highlighting selected/hovered areas - with scaling */}
          <svg className="map-overlay">
            {mapAreas.map(area => {
              const [x1, y1, x2, y2] = area.coords.split(',').map(Number);
              // Apply scaling factor to coordinates
              const scaledX1 = x1 * scale;
              const scaledY1 = y1 * scale;
              const scaledWidth = (x2 - x1) * scale;
              const scaledHeight = (y2 - y1) * scale;
              
              return (
                <rect
                  key={area.id}
                  x={scaledX1}
                  y={scaledY1}
                  width={scaledWidth}
                  height={scaledHeight}
                  className={`overlay-area 
                    ${selectedLocation === area.id ? 'selected' : ''} 
                    ${hoveredLocation === area.id ? 'hovered' : ''}`}
                  onClick={() => handleAreaClick(area.id)}
                  onMouseEnter={() => handleAreaHover(area.id)}
                  onMouseLeave={handleAreaLeave}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Map;

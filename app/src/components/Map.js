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
      { id: '020', name: 'Route 36', coords: '56,56,80,64' },
      { id: '021', name: 'Route 37', coords: '64,48,72,56' },
      { id: '022', name: 'Ecruteak City', coords: '64,40,72,48' },
      { id: '023', name: 'Tin Tower', coords: '68,40,72,44' },
      { id: '024', name: 'Burned Tower', coords: '64,40,68,44' },
      { id: '025', name: 'Route 38', coords: '40,40,64,48' },
      { id: '026', name: 'Route 39', coords: '32,40,40,56' },
      { id: '027', name: 'Olivine City', coords: '32,56,40,64' },
      { id: '028', name: 'Lighthouse', coords: '36,60,40,64' },
      { id: '029', name: 'Battle Tower', coords: '26,54,30,58' },
      { id: '030', name: 'Route 40', coords: '24,64,32,88' },
      { id: '031', name: 'Whirl Islands', coords: '24,88,32,96' },
      { id: '032', name: 'Route 41', coords: '24,96,32,104' },
      { id: '033', name: 'Cianwood City', coords: '16,96,24,104' },
      { id: '034', name: 'Route 42', coords: '72,40,104,48' },
      { id: '035', name: 'Mt Mortar', coords: '80,40,88,48' },
      { id: '036', name: 'Mahogany Town', coords: '104,40,112,48' },
      { id: '037', name: 'Route 43', coords: '104,32,112,40' },
      { id: '038', name: 'Lake of Rage', coords: '104,24,112,32' },
      { id: '039', name: 'Route 44', coords: '112,40,128,48' },
      { id: '040', name: 'Ice Path', coords: '128,36,132,40' },
      { id: '041', name: 'Blackthorn City', coords: '128,40,136,48' },
      { id: '042', name: 'Dragons Den', coords: '128,32,136,40' },
      { id: '043', name: 'Route 45', coords: '128,48,136,80' },
      { id: '044', name: 'Dark Cave', coords: '110,70,114,74' },
      { id: '045', name: 'Route 46', coords: '120,72,128,96' },
      { id: '046', name: 'Silver Cave', coords: '144,64,152,72' }
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

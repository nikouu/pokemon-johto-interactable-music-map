import React, { useState, useEffect, useRef } from 'react';
import './Map.css';
import blankMapImage from '../maps/000-BLANK.png';
import locationData from '../data.json';

// Import all map images here
import map001 from '../maps/001-NEW-BARK-TOWN.png';
import map002 from '../maps/002-ROUTE-29.png';
import map003 from '../maps/003-CHERRYGROVE-CITY.png';
import map004 from '../maps/004-ROUTE-30.png';
import map005 from '../maps/005-ROUTE-31.png';
import map006 from '../maps/006-VIOLET-CITY.png';
import map007 from '../maps/007-SPROUT-TOWER.png';
import map008 from '../maps/008-ROUTE-32.png';
import map009 from '../maps/009-RUINS OF ALPH.png';
import map010 from '../maps/010-UNION-CAVE.png';
import map011 from '../maps/011-ROUTE-33.png';
import map012 from '../maps/012-AZALEA-TOWN.png';
import map013 from '../maps/013-SLOWPOKE-WELL.png';
import map014 from '../maps/014-ILEX FOREST.png';
import map015 from '../maps/015-ROUTE-34.png';
import map016 from '../maps/016-GOLDENROD-CITY.png';
import map017 from '../maps/017-RADIO-TOWER.png';
import map018 from '../maps/018-ROUTE-35.png';
import map019 from '../maps/019-NATIONAL-PARK.png';
import map020 from '../maps/020-ROUTE-36.png';
import map021 from '../maps/021-ROUTE-37.png';
import map022 from '../maps/022-ECRUTEAK-CITY.png';
import map023 from '../maps/023-TIN-TOWER.png';
import map024 from '../maps/024-BURNED-TOWER.png';
import map025 from '../maps/025-ROUTE-38.png';
import map026 from '../maps/026-ROUTE-39.png';
import map027 from '../maps/027-OLIVINE-CITY.png';
import map028 from '../maps/028-LIGHTHOUSE.png';
import map029 from '../maps/029-BATTLE-TOWER.png';
import map030 from '../maps/030-ROUTE-40.png';
import map031 from '../maps/031-WHIRL-ISLANDS.png';
import map032 from '../maps/032-ROUTE-41.png';
import map033 from '../maps/033-CIANWOOD-CITY.png';
import map034 from '../maps/034-ROUTE-42.png';
import map035 from '../maps/035-MT-MORTAR.png';
import map036 from '../maps/036-MAHOGANY-TOWN.png';
import map037 from '../maps/037-ROUTE-43.png';
import map038 from '../maps/038-LAKE-OF-RAGE.png';
import map039 from '../maps/039-ROUTE-44.png';
import map040 from '../maps/040-ICE-PATH.png';
import map041 from '../maps/041-BLACKTHORN-CITY.png';
import map042 from '../maps/042-DRAGONS-DEN.png';
import map043 from '../maps/043-ROUTE-45.png';
import map044 from '../maps/044-DARK-CAVE.png';
import map045 from '../maps/045-ROUTE-46.png';
import map046 from '../maps/046-SILVER-CAVE.png';

function Map({ locations, selectedLocation, hoveredLocation, onLocationSelect, onLocationHover }) {
  const [mapAreas, setMapAreas] = useState([]);
  const [relatedLocations, setRelatedLocations] = useState([]);
  const mapContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  
  // Map of location IDs to their corresponding images
  const locationMaps = {
    '000': blankMapImage,      // Blank
    '001': map001,             // New Bark Town
    '002': map002,             // Route 29
    '003': map003,             // Cherrygrove City
    '004': map004,             // Route 30
    '005': map005,             // Route 31
    '006': map006,             // Violet City
    '007': map007,             // Sprout Tower
    '008': map008,             // Route 32
    '009': map009,             // Ruins of Alph
    '010': map010,             // Union Cave
    '011': map011,             // Route 33
    '012': map012,             // Azalea Town
    '013': map013,             // Slowpoke Well
    '014': map014,             // Ilex Forest
    '015': map015,             // Route 34
    '016': map016,             // Goldenrod City
    '017': map017,             // Radio Tower
    '018': map018,             // Route 35
    '019': map019,             // National Park
    '020': map020,             // Route 36
    '021': map021,             // Route 37
    '022': map022,             // Ecruteak City
    '023': map023,             // Tin Tower
    '024': map024,             // Burned Tower
    '025': map025,             // Route 38
    '026': map026,             // Route 39
    '027': map027,             // Olivine City
    '028': map028,             // Lighthouse
    '029': map029,             // Battle Tower
    '030': map030,             // Route 40
    '031': map031,             // Whirl Islands
    '032': map032,             // Route 41
    '033': map033,             // Cianwood City
    '034': map034,             // Route 42
    '035': map035,             // Mt Mortar
    '036': map036,             // Mahogany Town
    '037': map037,             // Route 43
    '038': map038,             // Lake of Rage
    '039': map039,             // Route 44
    '040': map040,             // Ice Path
    '041': map041,             // Blackthorn City
    '042': map042,             // Dragons Den
    '043': map043,             // Route 45
    '044': map044,             // Dark Cave
    '045': map045,             // Route 46
    '046': map046              // Silver Cave
  };
  
  // Function to get the current map image based on selection
  const getCurrentMapImage = () => {
    if (!selectedLocation) return blankMapImage;
    return locationMaps[selectedLocation] || blankMapImage;
  };
  
  // Group locations by their YouTube links
  useEffect(() => {
    // Create a map of YouTube links to location IDs
    const musicMap = {};
    
    Object.entries(locations).forEach(([id, data]) => {
      if (data.youtube) {
        if (!musicMap[data.youtube]) {
          musicMap[data.youtube] = [];
        }
        musicMap[data.youtube].push(id);
      }
    });
    
    // Store this mapping for later use
    setRelatedLocations(musicMap);
  }, [locations]);
  
  // Find locations with the same music as the current hovered/selected location
  const getRelatedLocationIds = (locationId) => {
    if (!locationId || !locations[locationId]) return [];
    
    const youtubeLink = locations[locationId].youtube;
    return relatedLocations[youtubeLink] || [];
  };

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
    // Define clickable areas for each location on the map using data from locations
    const areas = Object.entries(locations).map(([id, location]) => {
      // Skip the blank/default location
      if (id === '000') return null;
      
      // Use the predefined coordinates based on ID
      const coordsMap = {
        '001': '136,96,144,104',     // New Bark Town
        '002': '104,96,136,104',     // Route 29
        '003': '96,96,104,104',      // Cherrygrove City
        '004': '96,64,104,96',       // Route 30
        '005': '88,56,104,64',       // Route 31
        '006': '80,56,88,64',        // Violet City
        '007': '83,56,87,60',        // Sprout Tower
        '008': '80,64,88,120',       // Route 32
        '009': '72,72,80,80',        // Ruins of Alph
        '010': '80,120,88,128',      // Union Cave
        '011': '72,120,80,128',      // Route 33
        '012': '64,120,72,128',      // Azalea Town
        '013': '68,120,72,124',      // Slowpoke Well
        '014': '48,120,64,128',      // Ilex Forest
        '015': '48,96,56,120',       // Route 34
        '016': '48,88,56,96',        // Goldenrod City
        '017': '48,90,52,94',        // Radio Tower
        '018': '48,64,56,88',        // Route 35
        '019': '48,56,56,64',        // National Park
        '020': '56,56,80,64',        // Route 36
        '021': '64,48,72,56',        // Route 37
        '022': '64,40,72,48',        // Ecruteak City
        '023': '68,40,72,44',        // Tin Tower
        '024': '64,40,68,44',        // Burned Tower
        '025': '40,40,64,48',        // Route 38
        '026': '32,40,40,56',        // Route 39
        '027': '32,56,40,64',        // Olivine City
        '028': '36,60,40,64',        // Lighthouse
        '029': '26,54,30,58',        // Battle Tower
        '030': '24,56,32,88',        // Route 40
        '031': '24,88,32,96',        // Whirl Islands
        '032': '24,96,32,104',       // Route 41
        '033': '16,96,24,104',       // Cianwood City
        '034': '72,40,104,48',       // Route 42
        '035': '80,40,88,48',        // Mt Mortar
        '036': '104,40,112,48',      // Mahogany Town
        '037': '104,32,112,40',      // Route 43
        '038': '104,24,112,32',      // Lake of Rage
        '039': '112,40,128,48',      // Route 44
        '040': '128,36,132,40',      // Ice Path
        '041': '128,40,136,48',      // Blackthorn City
        '042': '128,32,136,40',      // Dragons Den
        '043': '128,48,136,80',      // Route 45
        '044': '110,70,114,74',      // Dark Cave
        '045': '120,72,128,96',      // Route 46
        '046': '144,64,152,72'       // Silver Cave
      };
      
      return {
        id: id,
        name: location.name,
        coords: coordsMap[id] || ''
      };
    }).filter(area => area !== null);
    
    setMapAreas(areas);
  }, [locations]);

  const handleAreaClick = (id) => {
    onLocationSelect(id);
  };

  const handleAreaHover = (id) => {
    onLocationHover(id);
  };

  const handleAreaLeave = () => {
    onLocationHover(null);
  };

  // Get related locations for currently hovered or selected location
  const relatedToHovered = hoveredLocation ? getRelatedLocationIds(hoveredLocation) : [];
  const relatedToSelected = selectedLocation ? getRelatedLocationIds(selectedLocation) : [];

  return (
    <div className="map-wrapper">
      <h2>Johto Region Map</h2>
      <div className="map-content" ref={mapContainerRef}>
        <div className="map-container">
          <img 
            src={getCurrentMapImage()} 
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
              
              // Determine class based on selection/hover state
              const isSelected = selectedLocation === area.id;
              const isHovered = hoveredLocation === area.id;
              
              // Determine if locations share music
              const isRelatedToSelected = relatedToSelected.includes(area.id) && area.id !== selectedLocation;
              
              // Check if hovered location shares music with selected location
              const hoveredSharesMusicWithSelected = hoveredLocation && 
                relatedToSelected.includes(hoveredLocation);
              
              // Only apply related-hovered when the hovered location DOESN'T share music with selected
              const isRelatedToHovered = !hoveredSharesMusicWithSelected && 
                relatedToHovered.includes(area.id) && 
                area.id !== hoveredLocation;
              
              // Check if selected and hovered are the same location
              const isSelectedAndHoveredSame = selectedLocation === hoveredLocation && 
                selectedLocation !== null;
              
              let className = 'overlay-area';
              if (isSelected) className += ' selected';
              
              // Only add hover classes if we're not hovering the selected location
              if (!isSelectedAndHoveredSame) {
                if (isHovered) className += ' hovered';
                if (isRelatedToHovered) className += ' related-hovered';
              }
              
              if (isRelatedToSelected) className += ' related-selected';
              
              return (
                <rect
                  key={area.id}
                  x={scaledX1}
                  y={scaledY1}
                  width={scaledWidth}
                  height={scaledHeight}
                  className={className}
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

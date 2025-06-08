// Configuration for the app

// Base path for GitHub Pages
export const BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/pokemon-johto-interactable-music-map'
  : '';

// Public URL for assets
export const PUBLIC_URL = process.env.PUBLIC_URL || BASE_PATH;

// Helper function for asset paths
export const getAssetPath = (path) => `${PUBLIC_URL}${path}`;

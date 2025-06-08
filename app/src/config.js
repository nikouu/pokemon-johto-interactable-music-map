// This file handles environment-specific configuration

// Base path for GitHub Pages
const isProduction = process.env.NODE_ENV === 'production';
export const BASE_PATH = isProduction ? '/pokemon-johto-interactable-music-map' : '';

// Helper function for asset paths
export const getAssetPath = (path) => `${BASE_PATH}${path}`;

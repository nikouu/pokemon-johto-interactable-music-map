import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

function MusicPlayer({ locations, selectedLocation, isPlaying }) {
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  
  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  };

  // Get video ID (if applicable)
  const videoId = selectedLocation && locations[selectedLocation] 
    ? getYoutubeVideoId(locations[selectedLocation].youtube) 
    : null;

  // Load the YouTube API script
  useEffect(() => {
    // Create YouTube API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize YouTube API callback
    window.onYouTubeIframeAPIReady = () => {
      setPlayerReady(true);
    };

    return () => {
      // Cleanup
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Initialize and control player
  useEffect(() => {
    if (!videoId) return;

    // Function to initialize player
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (playerRef.current) {
          // Destroy existing player if there is one
          playerRef.current.destroy();
        }
        
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              // Set volume to 50% when player is ready
              event.target.setVolume(50);
              if (isPlaying) {
                event.target.playVideo();
              } else {
                event.target.pauseVideo();
              }
            },
            onStateChange: (event) => {
              // Handle state changes if needed
            }
          }
        });
      }
    };

    // Initialize player when API is ready
    if (playerReady) {
      initPlayer();
    } else {
      // If API is not ready yet, set up a listener for when it becomes ready
      const checkYT = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkYT);
          setPlayerReady(true);
          initPlayer();
        }
      }, 100);
      
      return () => clearInterval(checkYT);
    }

    return () => {
      // Cleanup when component unmounts or videoId changes
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying YouTube player:", e);
        }
      }
    };
  }, [videoId, playerReady]);

  // Control playback based on isPlaying state
  useEffect(() => {
    if (!playerRef.current || !videoId) return;
    
    try {
      if (isPlaying) {
        playerRef.current.playVideo && playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo && playerRef.current.pauseVideo();
      }
    } catch (error) {
      console.error('Error controlling YouTube player:', error);
    }
  }, [isPlaying, videoId]);

  // Early return cases
  if (!selectedLocation || !locations[selectedLocation]) {
    return (
      <div className="music-player-wrapper">
        <h3>Music Player</h3>
        <p>Select a location to play music.</p>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="music-player-wrapper">
        <h3>Music Player</h3>
        <p>No music available for this location.</p>
      </div>
    );
  }

  return (
    <div className="music-player-wrapper">
      <div id="youtube-player"></div>
    </div>
  );
}

export default MusicPlayer;

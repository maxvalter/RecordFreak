import React, { useEffect, useState, useCallback } from "react";
import { Album } from "../types/Album";
import "../styles/Body.css";
import { spotifyApi } from "../api/apiClient";

interface BodyProps {
  accessToken: string;
}

export default function Body({ accessToken }: BodyProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch saved albums function
  const getAlbums = useCallback(async () => {
    try {
      setLoading(true);
      const data = await spotifyApi.getSavedAlbums(accessToken);
      setAlbums(data); // Assuming `data.items` contains the list of albums
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAlbums();
  }, [getAlbums]);

  // Refetch when refreshTrigger changes (e.g., when a new album is saved)
  useEffect(() => {
    if (refreshTrigger > 0) {
      getAlbums();
    }
  }, [refreshTrigger, getAlbums]);

  // Callback for when an album is saved
  const handleAlbumSaved = () => {
    // Wait a moment before refreshing to let Spotify API update
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 1000);
  };

  if (loading && albums.length === 0) {
    return <div className="loading-container">Loading your albums...</div>;
  }

  if (error && albums.length === 0) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="body-container">
      <div className="main-content">
        {/* Album Suggestions Section */}
        <div className="suggestions-section">
          {/* <AlbumSuggestions
            savedAlbums={albums}
            onAlbumSaved={handleAlbumSaved}
          /> */}
        </div>

        {/* Saved Albums Section */}
        <div className="saved-albums-section">
          <h2>Your Saved Albums</h2>
          {loading && <div className="loading">Refreshing...</div>}
          <div className="album-grid">
            {albums.map((album) => (
              <div key={album.id} className="album-card">
                <div className="album-image-container">
                  <img
                    src={album.images.big}
                    alt={album.name}
                    className="album-image"
                  />
                </div>
                <div className="album-details">
                  <h3 className="album-title">{album.name}</h3>
                  <p className="album-artist">{album.artists}</p>
                  <p className="album-date">
                    Added: {new Date(album.added_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

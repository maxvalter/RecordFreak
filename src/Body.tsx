import { useEffect, useState, useCallback } from "react";
import { Album } from "./types/Album";
import AlbumSuggestions from "./components/AlbumSuggestions";
import "./styles/Body.css";

export default function Body({ accessToken }: { accessToken: string }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch albums function that can be called multiple times
  const fetchAlbums = useCallback(async () => {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.spotify.com/v1/me/albums?limit=50", // Fetch up to 50 albums
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }

      const data = await response.json();

      // Map and sort albums by added_at date (descending)
      const sortedAlbums = data.items
        .map((item: any) => ({
          ...item.album,
          added_at: item.added_at, // Include the added_at field
        }))
        .sort(
          (a: Album, b: Album) =>
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
        );

      setAlbums(sortedAlbums);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // Initial fetch on mount and when accessToken changes
  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums, accessToken]);

  // Refetch when refreshTrigger changes (when a new album is saved)
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchAlbums();
    }
  }, [refreshTrigger, fetchAlbums]);

  // Callback for when an album is saved
  const handleAlbumSaved = () => {
    // Wait a moment before refreshing to let Spotify API update
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
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
          <AlbumSuggestions 
            savedAlbums={albums} 
            accessToken={accessToken} 
            onAlbumSaved={handleAlbumSaved}
          />
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
                    src={album.images[0]?.url} 
                    alt={album.name} 
                    className="album-image" 
                  />
                </div>
                <div className="album-details">
                  <h3 className="album-title">{album.name}</h3>
                  <p className="album-artist">
                    {album.artists.map((artist) => artist.name).join(", ")}
                  </p>
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
import { useState, useEffect } from 'react';
import { getAlbumSuggestions } from '../api/gemini/Gemini';
import { searchSpotifyAlbum, saveAlbumToLibrary, checkAlbumSaved } from '../api/SpotifyAPI';
import { Album } from '../types/Album';
import '../styles/AlbumSuggestions.css';

interface AlbumSuggestionsProps {
  savedAlbums: Album[];
  accessToken: string;
  onAlbumSaved?: () => void; // Optional callback when an album is saved
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
}

export default function AlbumSuggestions({ savedAlbums, accessToken, onAlbumSaved }: AlbumSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SpotifyAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [savingAlbum, setSavingAlbum] = useState<Record<string, boolean>>({});

  // Fetch suggestions when component mounts or savedAlbums changes
  useEffect(() => {
    async function fetchSuggestions() {
      // Only fetch suggestions if we have saved albums
      if (savedAlbums.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const albumSuggestions = await getAlbumSuggestions(savedAlbums);
        setSuggestions(albumSuggestions);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to get album suggestions');
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [savedAlbums]);

  // Check if albums are saved when search results load
  useEffect(() => {
    async function checkSavedStatus() {
      if (!searchResults.length) return;
      
      const albumIds = searchResults.map(album => album.id);
      const savedStatusMap: Record<string, boolean> = {};
      
      for (const albumId of albumIds) {
        try {
          savedStatusMap[albumId] = await checkAlbumSaved(albumId, accessToken);
        } catch (error) {
          console.error(`Error checking saved status for album ${albumId}:`, error);
          savedStatusMap[albumId] = false;
        }
      }
      
      setSavedStatus(savedStatusMap);
    }
    
    checkSavedStatus();
  }, [searchResults, accessToken]);

  // Handle clicking on a suggestion
  const handleSuggestionClick = async (album: string) => {
    setSelectedAlbum(album);
    
    try {
      setLoading(true);
      const results = await searchSpotifyAlbum(album, accessToken);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching Spotify:', err);
      setError('Failed to search for album on Spotify');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving an album
  const handleSaveAlbum = async (albumId: string) => {
    setSavingAlbum(prev => ({ ...prev, [albumId]: true }));
    
    try {
      const success = await saveAlbumToLibrary(albumId, accessToken);
      
      if (success) {
        setSavedStatus(prev => ({ ...prev, [albumId]: true }));
        // Notify parent component that an album was saved
        if (onAlbumSaved) onAlbumSaved();
      }
    } catch (err) {
      console.error('Error saving album:', err);
      setError('Failed to save album');
    } finally {
      setSavingAlbum(prev => ({ ...prev, [albumId]: false }));
    }
  };

  // If no saved albums, show a message
  if (savedAlbums.length === 0) {
    return <div className="album-suggestions">Save some albums to get recommendations!</div>;
  }

  return (
    <div className="album-suggestions-container">
      <h2>Recommended for You</h2>
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="suggestion-circles">
        {suggestions.map((album, index) => (
          <div 
            key={index} 
            className={`suggestion-circle ${selectedAlbum === album ? 'selected' : ''}`}
            onClick={() => handleSuggestionClick(album)}
          >
            {album}
          </div>
        ))}
      </div>

      {searchResults && searchResults.length > 0 && (
        <div className="search-results">
          <h3>Found on Spotify</h3>
          <div className="result-list">
            {searchResults.map((album) => (
              <div key={album.id} className="result-item">
                <img 
                  src={album.images[0]?.url} 
                  alt={album.name} 
                  className="result-image"
                />
                <div className="result-details">
                  <h4>{album.name}</h4>
                  <p>{album.artists.map((artist) => artist.name).join(', ')}</p>
                  <div className="button-group">
                    <button 
                      onClick={() => window.open(album.external_urls.spotify, '_blank')}
                      className="play-button"
                    >
                      Play on Spotify
                    </button>
                    
                    {savedStatus[album.id] ? (
                      <button 
                        className="saved-button"
                        disabled
                      >
                        Saved
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSaveAlbum(album.id)}
                        className="save-button"
                        disabled={savingAlbum[album.id]}
                      >
                        {savingAlbum[album.id] ? 'Saving...' : 'Add to Library'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { recommendationsApi } from "../api/apiClient";
import "../styles/AlbumSuggestions.css";

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
}

interface AlbumSuggestionsProps {
  savedAlbums: Album[];
  onAlbumSaved: () => void;
}

export default function AlbumSuggestions({
  savedAlbums,
  onAlbumSaved,
}: AlbumSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch album suggestions based on saved albums
  useEffect(() => {
    async function fetchSuggestions() {
      try {
        setLoading(true);
        const albumIds = savedAlbums.map((album) => album.id).join(",");
        const data = await recommendationsApi.getAlbumRecommendations(savedAlbums.map((album) => album.id));
        setSuggestions(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching suggestions.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (savedAlbums.length > 0) {
      fetchSuggestions();
    }
  }, [savedAlbums]);

  if (loading) {
    return (
      <div className="loading-container">Loading album suggestions...</div>
    );
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="album-suggestions-container">
      <h2>Album Suggestions</h2>
      <div className="suggestions-grid">
        {suggestions.map((album) => (
          <div
            key={album.id}
            className="suggestion-box"
            onClick={() => onAlbumSaved(album.id)}
          >
            <img
              src={album.images[0]?.url}
              alt={album.name}
              className="suggestion-image"
            />
            <div className="suggestion-details">
              <h3>{album.name}</h3>
              <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

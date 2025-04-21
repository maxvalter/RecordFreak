import { useEffect, useState } from "react";
import Featured from "./vendor/Featured.tsx"; // Import the Featured component
import { Album } from "./types/Album"; // Import the Album interface

export default function Body({ accessToken }: { accessToken: string }) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchAlbums = async () => {
      try {
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
      }
    };

    fetchAlbums();
  }, [accessToken]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Saved Albums</h2>
      <div className="album-list">
        {albums.slice(-4).map((album) => (
          <div key={album.id} className="album">
            <img src={album.images[0]?.url} alt={album.name} width="100" />
            <h3>{album.name}</h3>
            <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
            <p>Added on: {new Date(album.added_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

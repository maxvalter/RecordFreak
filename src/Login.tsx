import { useEffect, useState } from "react";
import { redirectToSpotifyAuthorize } from "./auth.ts";

interface LoginProps {
  onTokenReceived: (token: string) => void;
}

export default function Login({ onTokenReceived }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle login button click
  const handleLogin = async () => {
    try {
      setLoading(true);
      await redirectToSpotifyAuthorize();
      // No need to set loading to false as we're redirecting away
    } catch (error) {
      console.error("Failed to redirect:", error);
      setError("Failed to start login process. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Redirecting to Spotify...</div>;
  }

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <button onClick={handleLogin}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <p>Welcome to RecordFreak! Connect your Spotify account to view your album collection.</p>
      <button onClick={handleLogin} className="login-button">
        Login with Spotify
      </button>
    </div>
  );
}

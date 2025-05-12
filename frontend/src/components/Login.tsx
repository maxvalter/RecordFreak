import React, { useEffect, useState } from "react";
import { authApi } from "../api/apiClient";

interface LoginProps {
  onTokenReceived: (token: string) => void;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle login button click
  const handleLogin = async () => {
    try {
      setLoading(true);
      const token = await authApi.login();
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

  //HELLO SERVER REMOVE
  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await fetch("http://localhost:5000/hello", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the "Hello, World!" message
      } catch (err) {
        console.error("Failed to fetch hello:", err);
      }
    };

    fetchHello();
  }, []);

  return (
    <div className="login-container">
      <p>
        Welcome to RecordFreak! Connect your Spotify account to view your album
        collection.
      </p>
      <button onClick={handleLogin} className="login-button">
        Login with Spotify
      </button>
    </div>
  );
}

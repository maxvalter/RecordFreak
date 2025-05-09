import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import { authApi } from "./api/apiClient";
import { mainModule } from "process";

// Callback component to handle Spotify redirect
function CallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Just redirect to home where the token logic is handled
    navigate("/");
  }, [navigate]);

  return <div className="loading">Processing authentication...</div>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const authStatus = await authApi.isAuthenticated();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error("Failed to check authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>RecordFreak</h1>
      </header>
      <main>{isAuthenticated ? <Body /> : <Login />}</main>
      {/* <main>
        <Login />
      </main> */}
    </div>
  );
}

export default App;

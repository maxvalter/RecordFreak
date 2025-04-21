import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Body from "./Body";
import { isLoggedIn, getAccessToken, logout } from "./auth";

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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check for existing authentication on mount or URL change
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        // Check if we already have a valid token
        if (isLoggedIn()) {
          const token = await getAccessToken();
          if (token) {
            setAccessToken(token);
            return;
          }
        }

        // Check if we have a code in the URL (after Spotify redirect)
        if (location.search.includes("code=")) {
          console.log("Auth code found in URL, attempting to get token");
          const token = await getAccessToken();
          if (token) {
            console.log("Token successfully obtained");
            setAccessToken(token);
          } else {
            console.error("Failed to get token from code");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [location]);

  const handleLogout = () => {
    logout();
    setAccessToken(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>RecordFreak</h1>
        {accessToken && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/callback" element={<CallbackHandler />} />
          <Route
            path="*"
            element={
              !accessToken ? (
                <Login onTokenReceived={(token) => setAccessToken(token)} />
              ) : (
                <Body accessToken={accessToken} />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

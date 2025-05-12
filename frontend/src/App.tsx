import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the access token from the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
      // Clear the token from the URL
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="app-container">
      <header>
        <h1>RecordFreak</h1>
      </header>
      <main>
        {accessToken ? <Body accessToken={accessToken} /> : <Login />}
      </main>
    </div>
  );
}

export default App;

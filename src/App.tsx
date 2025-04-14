import { useState } from "react";
import Login from "./Login";
import AlbumList from "./Album";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <div>
      <header>
        <h1>RecordFreak</h1>
      </header>
      <main>
        {!accessToken ? (
          <Login onTokenReceived={(token) => setAccessToken(token)} />
        ) : (
          <AlbumList accessToken={accessToken} />
        )}
      </main>
    </div>
  );
}

export default App;

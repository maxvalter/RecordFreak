import { useEffect, useState } from "react";
import { getAccessToken } from "./auth.ts";
import credentials from "./credentials.ts";

const { clientId } = credentials;

const redirectUri = "http://localhost:5173/";

interface LoginProps {
  onTokenReceived: (token: string) => void;
}

export default function Login({ onTokenReceived }: LoginProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange the code for an access token
      getAccessToken(code).then((token) => {
        if (token) {
          setAccessToken(token);
          onTokenReceived(token); // Pass the token to the parent
          console.log("Access Token:", token);
        }
      });
    }
  }, []);

  const scope =
    "user-read-private user-read-email user-library-read user-library-modify";
  const url = "https://accounts.spotify.com/authorize?";
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  };

  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${url}${queryString}`;

  return (
    <div>
      {!accessToken ? (
        <a href={fullUrl}>Login with Spotify</a>
      ) : (
        <p>Logged in successfully!</p>
      )}
    </div>
  );
}

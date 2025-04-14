import SpotifyWebApi from "spotify-web-api-node";
import credentials from "./credentials";

const { clientId, clientSecret } = credentials;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: "http://localhost:5173/",
});

export async function getAccessToken(code: string): Promise<string | null> {
  const clientId = "077b0a8f569941c1af45cc2a893eddfa";
  const clientSecret = "510a2d6558b44628a0aedd52a9416b6e";
  const redirectUri = "http://localhost:5173/";

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const credentials = btoa(`${clientId}:${clientSecret}`); // Base64 encode clientId:clientSecret

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch access token. Status code: ${response.status}, Response: ${await response.text()}`
      );
    }

    const data = await response.json();
    console.log("Access Token Response:", data);

    return data.access_token; // Return the access token
  } catch (err) {
    console.error("Error fetching access token:", err);
    return null; // Return null in case of an error
  }
}

export default spotifyApi;
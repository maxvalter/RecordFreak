import { clientId, clientSecret, redirectUri } from "./credentials";

// Generate a random string for the state parameter
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
}

// Generate a code verifier for PKCE
function generateCodeVerifier(): string {
  return generateRandomString(64);
}

// Create a code challenge from the code verifier
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Redirect to Spotify authorization page
export async function redirectToSpotifyAuthorize(): Promise<void> {
  const scope = 'user-read-private user-read-email user-library-read user-library-modify';
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  // Store the code verifier in localStorage to use it later
  localStorage.setItem('code_verifier', codeVerifier);
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: scope,
    state: generateRandomString(16)
  });
  
  // Log the redirect for debugging
  console.log(`Redirecting to Spotify auth with redirect_uri: ${redirectUri}`);
  
  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Extract code from URL after redirect
function getCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

// Exchange the code for an access token
export async function getAccessToken(): Promise<string | null> {
  // First, check if we already have a valid token in localStorage
  const savedToken = localStorage.getItem('access_token');
  const tokenExpiry = localStorage.getItem('token_expiry');
  
  if (savedToken && tokenExpiry && parseInt(tokenExpiry) > Date.now()) {
    return savedToken;
  }
  
  // If we don't have a token or it's expired, look for a code in the URL
  const code = getCodeFromUrl();
  
  if (!code) {
    // No code in URL, need to redirect for authorization
    return null;
  }
  
  // Use the code to get an access token
  const codeVerifier = localStorage.getItem('code_verifier');
  
  if (!codeVerifier) {
    console.error('No code verifier found');
    return null;
  }
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save the token and its expiry time
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_expiry', (Date.now() + (data.expires_in * 1000)).toString());
    
    // Clean up URL to remove the code
    window.history.replaceState({}, document.title, redirectUri);
    
    return data.access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

// Check if the user is logged in
export function isLoggedIn(): boolean {
  const token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  return !!token && !!expiry && parseInt(expiry) > Date.now();
}

// Log out user by removing tokens
export function logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_expiry');
  localStorage.removeItem('code_verifier');
}
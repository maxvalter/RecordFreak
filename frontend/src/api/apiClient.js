/**
 * API client for interacting with the backend
 * Centralizes all API calls and authentication logic
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithAuth(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const requestOptions = {
    ...options,
    headers,
    credentials: 'include', // Include cookies for authentication
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Auth API calls
 */
export const authApi = {
  // Redirect to the backend for Spotify login
  login: () => {
    // Redirect to the backend for Spotify login
    window.location.href = `${API_BASE_URL}/spotify/auth/login`;
  },
  // login: async () => {
  //   const response = await fetch(`${API_BASE_URL}/spotify/auth/login`);
  //   if (response.ok) {
  //     const data = await response.json();
  //     return data['access_token'];
  // }
  //   throw new Error('Failed to initiate login');

// },

  // Check if the user is authenticated
  isAuthenticated: async () => {
    try {
      const response = await fetchWithAuth('/spotify/auth/status');
      return response.isAuthenticated;
      // console.log("Try to check auth")
      // const response = await fetch('http://localhost:5000/hello');
    } catch {
      console.error("failed to check authentication status")
      return false;
    }
  },

  // Log out the user
  logout: async () => {
    await fetchWithAuth('/auth/logout', { method: 'POST' });
    window.location.reload(); // Reload the app after logout
  },
};

/**
 * Spotify API calls
 */
export const spotifyApi = {
  // Search for albums
  searchAlbums: async (query) => {
    return fetchWithAuth(`/spotify/search/albums?query=${encodeURIComponent(query)}`);
  },

  // Save an album to the user's library
  saveAlbum: async (albumId) => {
    return fetchWithAuth('/spotify/me/albums', {
      method: 'PUT',
      body: JSON.stringify({ albumId }),
    });
  },

  // Check if albums are saved
  checkAlbumSaved: async (albumId) => {
    return fetchWithAuth(`/spotify/me/albums/contains?ids=${albumId}`);
  },
  
  fetchSavedAlbums: async (access_token) => {
    // Fetch saved albums from Spotify API
    const response = await fetch('https://api.spotify.com/v1/me/albums?limit=50', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch saved albums');
    }
    const data = await response.json();
    return data.items.map((item) => ({
      id: item.album.id,
      name: item.album.name,
      artists: item.album.artists.map((artist) => artist.name).join(', '),
      images: item.album.images,
    }));
  }
  
};

/**
 * Recommendations API calls
 */
export const recommendationsApi = {
  // Get album recommendations
  getAlbumRecommendations: async (count = 5) => {
    return fetchWithAuth(`/recommendations/albums?count=${count}`);
  },
};
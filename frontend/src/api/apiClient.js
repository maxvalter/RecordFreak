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
  // login: async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/spotify/auth/login`);
  //     console.log('Response:', response);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Login fetch error:', error);
  //     throw error;
  //   }
  // },
  
  login: async () => {
    // Redirect to the backend for Spotify login
    window.location.href = `${API_BASE_URL}/spotify/auth/login`;
  },

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
    const response = await fetch(`${API_BASE_URL}/spotify/me/albums?access_token=${access_token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`, // Pass the access token in the Authorization header
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch saved albums');
    }
    const data = await response.json();
    console.log('Fetched saved albums:', data);
    return data;
  },

  getSavedAlbums: async (access_token ) => {
  const raw_data = await spotifyApi.fetchSavedAlbums(access_token);
    return raw_data.albums.map((item) => ({
      id: item.album.id,
      name: item.album.name,
      artists: item.album.artists.map((artist) => artist.name).join(', '),
      images: {
        big: item.album.images[0]?.url || null, // Largest image
        medium: item.album.images[1]?.url || null, // Medium-sized image
        small: item.album.images[2]?.url || null, // Smallest image
      },
      label: item.album.label,
      releaseDate: item.album.release_date,
      totalTracks: item.album.total_tracks,
      popularity: item.album.popularity,
      addedAt: item.added_at, // When the album was added to the user's library
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
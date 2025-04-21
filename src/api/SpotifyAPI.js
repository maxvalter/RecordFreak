/**
 * Function to search for an album on Spotify
 * @param {string} query - The search query (album title)
 * @param {string} accessToken - The Spotify access token
 * @returns {Promise<Object>} - Search results
 */
export async function searchSpotifyAlbum(query, accessToken) {
  try {
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    
    // Make the search request to Spotify
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.albums.items;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    throw error;
  }
}

/**
 * Function to open an album in Spotify (either app or web player)
 * @param {string} albumUri - The Spotify album URI
 */
export function openInSpotify(albumUri) {
  // Try to open in Spotify app first, fall back to web player
  window.location.href = albumUri;
}

/**
 * Function to save an album to the user's Spotify library
 * @param {string} albumId - The Spotify album ID
 * @param {string} accessToken - The Spotify access token
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export async function saveAlbumToLibrary(albumId, accessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/albums?ids=${albumId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error saving album:', error);
    throw error;
  }
}

/**
 * Function to check if an album is saved in the user's Spotify library
 * @param {string} albumId - The Spotify album ID
 * @param {string} accessToken - The Spotify access token
 * @returns {Promise<boolean>} - Whether the album is saved
 */
export async function checkAlbumSaved(albumId, accessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/albums/contains?ids=${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0] || false;
  } catch (error) {
    console.error('Error checking if album is saved:', error);
    return false;
  }
}
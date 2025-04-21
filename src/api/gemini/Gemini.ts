import { GoogleGenAI } from "@google/genai";
import { Album } from '../../types/Album';

const API_KEY = "AIzaSyA4xKYHj-6ogJPSvYcjfyME5KalD9Rpkn8";
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Get album suggestions based on the user's saved albums
 * @param savedAlbums User's saved albums from Spotify
 * @param count Number of suggestions to return (default: 5)
 * @returns Array of suggested album titles
 */
export async function getAlbumSuggestions(savedAlbums: Album[], count: number = 5): Promise<string[]> {
  try {
    // Format the user's album collection as a string
    const albumString = savedAlbums
      .map(album => `${album.name} by ${album.artists.map(artist => artist.name).join(', ')}`)
      .join('; ');
    
    // Create a prompt for Gemini
    const prompt = `Based on this collection of albums: "${albumString}", 
      suggest exactly ${count} albums I might enjoy. 
      Format your response as a simple JSON array containing ONLY the album names. 
      For example: ["Album 1", "Album 2", "Album 3", "Album 4", "Album 5"]
      Do not include any additional text, just return the valid JSON array.`;
    
    // Generate content with Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    // Parse the response as JSON
    const responseText = response.text();
    const suggestions = JSON.parse(responseText);
    
    // Ensure we're returning exactly the requested number of suggestions
    return suggestions.slice(0, count);
  } catch (error) {
    console.error("Error getting album suggestions:", error);
    
    // Fallback suggestions if the API fails
    return [
      "The Dark Side of the Moon",
      "Rumours", 
      "Nevermind",
      "OK Computer",
      "The Miseducation of Lauryn Hill"
    ].slice(0, count);
  }
}
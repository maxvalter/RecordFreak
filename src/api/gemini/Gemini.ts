import { GoogleGenAI } from "@google/genai";
import { Album } from '../../types/Album.ts'

const ai = new GoogleGenAI({ apiKey: "AIzaSyA4xKYHj-6ogJPSvYcjfyME5KalD9Rpkn8" });
const example_albums = 'Exile on Main Street, Siamese Dream, Dookie'

export async function album_suggestions(saved_albums: Album[]) {
    let txt = "";
    
    


    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Here's my collection: 'Exile on Main Street, Siamese Dream, Dookie', give me suggestions within some genre",
      });
    return response
}

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Classic rock album suggestions",
  });
  console.log(response.text);
}

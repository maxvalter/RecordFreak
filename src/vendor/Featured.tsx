import { album_suggestions } from "../api/gemini/Gemini";
import { Album } from "../types/Album"; // Import the Album interface
import { useState, useEffect, use } from "react";

export default async function Featured(saved_albums: Album[]) {
  const ai_response = album_suggestions(saved_albums);
  const [response, setResponse] = useState("");
  useEffect(() => {
    setResponse(ai_response.text);
  }, [ai_response]);

  return (
    <div>
      <p>{ai_response.text}</p>
    </div>
  );
}

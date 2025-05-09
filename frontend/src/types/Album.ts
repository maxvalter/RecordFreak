export interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
  added_at: string; // Include the added_at field for sorting
}
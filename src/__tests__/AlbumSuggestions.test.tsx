import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlbumSuggestions from '../components/AlbumSuggestions';
import * as GeminiAPI from '../api/gemini/Gemini';
import * as SpotifyAPI from '../api/SpotifyAPI';
import { Album } from '../types/Album';

// Mock the Gemini API
vi.mock('../api/gemini/Gemini', () => ({
  getAlbumSuggestions: vi.fn()
}));

// Mock the Spotify API
vi.mock('../api/SpotifyAPI', () => ({
  searchSpotifyAlbum: vi.fn(),
  saveAlbumToLibrary: vi.fn(),
  checkAlbumSaved: vi.fn()
}));

// Sample albums for testing
const sampleAlbums: Album[] = [
  {
    id: '1',
    name: 'Album 1',
    artists: [{ name: 'Artist 1' }],
    images: [{ url: 'https://example.com/album1.jpg' }],
    added_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Album 2',
    artists: [{ name: 'Artist 2' }],
    images: [{ url: 'https://example.com/album2.jpg' }],
    added_at: '2023-02-01T00:00:00Z'
  }
];

// Sample Spotify search results
const sampleSearchResults = [
  {
    id: 's1',
    name: 'Suggested Album 1',
    artists: [{ name: 'Artist X' }],
    images: [{ url: 'https://example.com/suggested1.jpg' }],
    external_urls: { spotify: 'https://open.spotify.com/album/123' }
  }
];

describe('AlbumSuggestions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock implementation of getAlbumSuggestions
    vi.mocked(GeminiAPI.getAlbumSuggestions).mockResolvedValue([
      'Suggested Album 1', 
      'Suggested Album 2'
    ]);
    
    // Mock implementation of searchSpotifyAlbum
    vi.mocked(SpotifyAPI.searchSpotifyAlbum).mockResolvedValue(sampleSearchResults);
    
    // Mock implementation of checkAlbumSaved
    vi.mocked(SpotifyAPI.checkAlbumSaved).mockResolvedValue(false);
    
    // Mock implementation of saveAlbumToLibrary
    vi.mocked(SpotifyAPI.saveAlbumToLibrary).mockResolvedValue(true);
  });

  it('renders a message when no albums are provided', () => {
    render(<AlbumSuggestions savedAlbums={[]} accessToken="test-token" />);
    expect(screen.getByText(/Save some albums to get recommendations/i)).toBeInTheDocument();
  });

  it('fetches suggestions when there are saved albums', async () => {
    render(<AlbumSuggestions savedAlbums={sampleAlbums} accessToken="test-token" />);
    
    // Verify that getAlbumSuggestions was called with the saved albums
    expect(GeminiAPI.getAlbumSuggestions).toHaveBeenCalledWith(sampleAlbums);
    
    // Wait for the suggestions to be displayed
    await waitFor(() => {
      expect(screen.getByText('Suggested Album 1')).toBeInTheDocument();
      expect(screen.getByText('Suggested Album 2')).toBeInTheDocument();
    });
  });

  it('searches Spotify when a suggestion is clicked', async () => {
    render(<AlbumSuggestions savedAlbums={sampleAlbums} accessToken="test-token" />);
    
    // Wait for suggestions to load
    await waitFor(() => {
      expect(screen.getByText('Suggested Album 1')).toBeInTheDocument();
    });
    
    // Click on a suggestion
    fireEvent.click(screen.getByText('Suggested Album 1'));
    
    // Verify searchSpotifyAlbum was called
    expect(SpotifyAPI.searchSpotifyAlbum).toHaveBeenCalledWith('Suggested Album 1', 'test-token');
    
    // Wait for search results to be displayed
    await waitFor(() => {
      expect(screen.getByText('Found on Spotify')).toBeInTheDocument();
      expect(screen.getByText('Artist X')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Play on Spotify/i })).toBeInTheDocument();
    });
  });
  
  it('shows the save button for albums that are not in the library', async () => {
    render(<AlbumSuggestions savedAlbums={sampleAlbums} accessToken="test-token" />);
    
    // Wait for suggestions to load and click one
    await waitFor(() => {
      expect(screen.getByText('Suggested Album 1')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Suggested Album 1'));
    
    // Wait for search results and check for save button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add to Library/i })).toBeInTheDocument();
    });
  });
  
  it('saves an album when the save button is clicked', async () => {
    const mockOnAlbumSaved = vi.fn();
    
    render(
      <AlbumSuggestions 
        savedAlbums={sampleAlbums} 
        accessToken="test-token" 
        onAlbumSaved={mockOnAlbumSaved} 
      />
    );
    
    // Wait for suggestions to load and click one
    await waitFor(() => {
      expect(screen.getByText('Suggested Album 1')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Suggested Album 1'));
    
    // Wait for search results and click save button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add to Library/i })).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Add to Library/i }));
    
    // Verify saveAlbumToLibrary was called with correct args
    expect(SpotifyAPI.saveAlbumToLibrary).toHaveBeenCalledWith('s1', 'test-token');
    
    // Wait for saved status update and verify callback was called
    await waitFor(() => {
      expect(mockOnAlbumSaved).toHaveBeenCalled();
    });
  });
  
  it('shows "Saved" for albums already in the library', async () => {
    // Mock that the album is already saved
    vi.mocked(SpotifyAPI.checkAlbumSaved).mockResolvedValue(true);
    
    render(<AlbumSuggestions savedAlbums={sampleAlbums} accessToken="test-token" />);
    
    // Wait for suggestions to load and click one
    await waitFor(() => {
      expect(screen.getByText('Suggested Album 1')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Suggested Album 1'));
    
    // Wait for search results and check for "Saved" button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Saved/i })).toBeInTheDocument();
    });
  });
});
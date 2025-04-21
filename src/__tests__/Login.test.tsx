import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login';
import * as auth from '../auth';

vi.mock('../auth', () => ({
  redirectToSpotifyAuthorize: vi.fn(),
}));

describe('Login Component', () => {
  it('renders welcome message and login button', () => {
    render(<Login onTokenReceived={() => {}} />);
    
    expect(screen.getByText(/Welcome to RecordFreak/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login with Spotify/i })).toBeInTheDocument();
  });

  it('calls redirectToSpotifyAuthorize when login button is clicked', async () => {
    const mockRedirect = vi.mocked(auth.redirectToSpotifyAuthorize);
    mockRedirect.mockResolvedValue();
    
    render(<Login onTokenReceived={() => {}} />);
    
    const loginButton = screen.getByRole('button', { name: /Login with Spotify/i });
    fireEvent.click(loginButton);
    
    expect(mockRedirect).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/Redirecting to Spotify/i)).toBeInTheDocument();
  });

  it('shows error message when login fails', async () => {
    const mockRedirect = vi.mocked(auth.redirectToSpotifyAuthorize);
    mockRedirect.mockRejectedValue(new Error('Login failed'));
    
    render(<Login onTokenReceived={() => {}} />);
    
    const loginButton = screen.getByRole('button', { name: /Login with Spotify/i });
    fireEvent.click(loginButton);
    
    expect(await screen.findByText(/Failed to start login process/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });
});

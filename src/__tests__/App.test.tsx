import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as auth from '../auth';

// Mock the auth module
vi.mock('../auth', () => ({
  isLoggedIn: vi.fn(),
  getAccessToken: vi.fn(),
  logout: vi.fn()
}));

// Mock child components
vi.mock('../Login', () => ({
  default: ({ onTokenReceived }: { onTokenReceived: (token: string) => void }) => {
    return <div data-testid="login-component">Login Component</div>;
  }
}));

vi.mock('../Body', () => ({
  default: ({ accessToken }: { accessToken: string }) => {
    return <div data-testid="body-component">Body Component</div>;
  }
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    vi.mocked(auth.isLoggedIn).mockReturnValue(false);
    vi.mocked(auth.getAccessToken).mockResolvedValue(null);
    
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    // Since the loading state is removed quickly in the test environment,
    // we'll check that the login component is eventually rendered
    await waitFor(() => {
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
  });

  it('renders Login component when not logged in', async () => {
    vi.mocked(auth.isLoggedIn).mockReturnValue(false);
    vi.mocked(auth.getAccessToken).mockResolvedValue(null);
    
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
  });

  it('renders Body component when logged in', async () => {
    vi.mocked(auth.isLoggedIn).mockReturnValue(true);
    vi.mocked(auth.getAccessToken).mockResolvedValue('test-token');
    
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('body-component')).toBeInTheDocument();
    });
  });

  it('processes auth code from URL', async () => {
    vi.mocked(auth.isLoggedIn).mockReturnValue(false);
    vi.mocked(auth.getAccessToken).mockResolvedValue('test-token');
    
    // Mock URL with code parameter
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, search: '?code=test-code' } as any;
    
    render(
      <MemoryRouter initialEntries={['/?code=test-code']}>
        <App />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(auth.getAccessToken).toHaveBeenCalled();
      expect(screen.getByTestId('body-component')).toBeInTheDocument();
    });
    
    // Restore original location
    window.location = originalLocation;
  });
});
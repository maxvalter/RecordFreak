import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isLoggedIn, logout } from '../auth';

describe('auth.ts', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;
  });

  describe('isLoggedIn', () => {
    it('returns false when no token exists', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
      expect(isLoggedIn()).toBe(false);
    });

    it('returns false when token is expired', () => {
      vi.spyOn(localStorage, 'getItem')
        .mockImplementation((key) => {
          if (key === 'access_token') return 'token123';
          if (key === 'token_expiry') return (Date.now() - 1000).toString();
          return null;
        });
      expect(isLoggedIn()).toBe(false);
    });

    it('returns true when token exists and is not expired', () => {
      vi.spyOn(localStorage, 'getItem')
        .mockImplementation((key) => {
          if (key === 'access_token') return 'token123';
          if (key === 'token_expiry') return (Date.now() + 1000).toString();
          return null;
        });
      expect(isLoggedIn()).toBe(true);
    });
  });

  describe('logout', () => {
    it('removes auth-related items from localStorage', () => {
      logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token_expiry');
      expect(localStorage.removeItem).toHaveBeenCalledWith('code_verifier');
    });
  });
});

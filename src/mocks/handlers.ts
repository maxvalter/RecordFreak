import { http, HttpResponse } from 'msw';

export const handlers = [
  // Spotify token endpoint mock
  http.post('https://accounts.spotify.com/api/token', () => {
    return HttpResponse.json({
      access_token: 'test_access_token',
      refresh_token: 'test_refresh_token',
      expires_in: 3600
    });
  }),
  
  // Spotify API endpoint mocks
  http.get('https://api.spotify.com/v1/me/albums', () => {
    return HttpResponse.json({
      items: [
        {
          added_at: '2023-05-01T12:00:00Z',
          album: {
            id: 'album1',
            name: 'Test Album 1',
            artists: [{ name: 'Artist 1' }],
            images: [{ url: 'https://example.com/album1.jpg' }]
          }
        },
        {
          added_at: '2023-06-01T12:00:00Z',
          album: {
            id: 'album2',
            name: 'Test Album 2',
            artists: [{ name: 'Artist 2' }],
            images: [{ url: 'https://example.com/album2.jpg' }]
          }
        }
      ]
    });
  })
];

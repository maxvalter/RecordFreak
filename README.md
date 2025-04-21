# RecordFreak

A Spotify integration app for viewing and managing your album collection.

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Spotify developer account and app credentials

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Testing
The app uses Vitest and React Testing Library for testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Project Structure
- `/src` - Main application code
  - `/api` - API integration code
  - `/mocks` - Mock API handlers for testing
  - `/types` - TypeScript interfaces
  - `/error` - Error handling utilities
  - `/__tests__` - Test files
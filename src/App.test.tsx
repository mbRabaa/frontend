// src/App.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('App', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
  });
});
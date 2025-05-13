// src/__tests__/Reservations.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReservationsPage from '../pages/Reservations';
import '@testing-library/jest-dom/vitest';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

// Mock pour la navigation
const MockLocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

// Mock pour useToast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

describe('ReservationPage Logic', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast.mockClear();
    mockedAxios.post.mockResolvedValue({ data: {} });
  });

  const renderComponent = (initialEntries: Array<string | { pathname: string; state?: { journeyId: string } }> = ['/reservations']) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries.map(entry => 
          typeof entry === 'string' ? { pathname: entry } : entry
        )}>
          <Routes>
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/paiements" element={<MockLocationDisplay />} />
            <Route path="/" element={<MockLocationDisplay />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should pre-fill form when journeyId is provided', async () => {
    renderComponent([{ pathname: '/reservations', state: { journeyId: '1' } }]);

    await waitFor(() => {
      // Trouve les boutons par leur label puis vérifie le contenu de leur span
      const departureLabel = screen.getByText('Point de départ');
      const destinationLabel = screen.getByText('Destination');
      
      const departureButton = departureLabel.nextElementSibling;
      const destinationButton = destinationLabel.nextElementSibling;

      expect(departureButton).toContainHTML('<span style="pointer-events: none;">Tunis</span>');
      expect(destinationButton).toContainHTML('<span style="pointer-events: none;">Sousse</span>');
    });
  });

  it('should show error when form is submitted with missing fields', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Réserver et Payer'));

    await waitFor(() => {
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
    });
  });

  it('should submit form successfully and navigate to payments', async () => {
    const user = userEvent.setup();
    const mockReservation = { id: 123, trajet_id: 1, seats: 2 };
    mockedAxios.post.mockResolvedValueOnce({ data: mockReservation });

    renderComponent([{ pathname: '/reservations', state: { journeyId: '1' } }]);

    await user.click(screen.getByText('Réserver et Payer'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/reservations'),
        {
          seats: 1,
          trajet_id: 1
        }
      );
      expect(screen.getByTestId('location-display')).toHaveTextContent('/paiements');
    });
  });

  it('should handle API error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Plus de places disponibles';
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: errorMessage } }
    });

    renderComponent([{ pathname: '/reservations', state: { journeyId: '1' } }]);

    await user.click(screen.getByText('Réserver et Payer'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    });
  });

  it('should cancel and navigate to home', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByText('Annuler'));

    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/');
      expect(mockToast).toHaveBeenCalledWith({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée"
      });
    });
  });
});
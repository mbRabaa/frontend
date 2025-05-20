import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentsPage from '../pages/Paiements';

// Mock axios
vi.mock('axios');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
  };
});

// Mock lucide-react complet
vi.mock('lucide-react', () => ({
  Calendar: () => <div>CalendarIcon</div>,
  Loader2: () => <div>LoaderIcon</div>,
  Ticket: () => <div>TicketIcon</div>,
  CreditCard: () => <div>CreditCardIcon</div>,
  Banknote: () => <div>BanknoteIcon</div>,
  ArrowLeft: () => <div>ArrowLeftIcon</div>,
  Circle: () => <div>CircleIcon</div>,
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('PaymentsPage', () => {
  const mockReservation = {
    origin: 'Tunis',
    destination: 'Sfax',
    date: new Date('2024-06-15'),
    seats: 2,
    price: 50,
    pricePerSeat: 25,
  };

  beforeEach(() => {
    vi.mocked(useLocation).mockReturnValue({
      state: { reservation: mockReservation },
      key: '',
      pathname: '',
      search: '',
      hash: '',
    });
    mockNavigate.mockReset();
    mockToast.mockReset();
    vi.mocked(axios.post).mockReset();
  });

  it('affiche le loader si la réservation est en cours de chargement', () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      key: '',
      pathname: '',
      search: '',
      hash: '',
    });

    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('LoaderIcon')).toBeInTheDocument();
  });

  it('affiche correctement le formulaire de paiement avec les informations de réservation', () => {
    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Paiement sécurisé')).toBeInTheDocument();
    expect(screen.getByText('Tunis → Sfax')).toBeInTheDocument();
    
    // Vérification des prix avec getAllByText
    const priceElements = screen.getAllByText('25,000 DT');
    expect(priceElements.length).toBeGreaterThan(0);
    
    const totalPriceElements = screen.getAllByText('50,000 DT');
    expect(totalPriceElements.length).toBeGreaterThan(0);
  });

  it('valide les champs du formulaire avant soumission', async () => {
    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Payer Maintenant'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: expect.stringContaining('Numéro de carte invalide'),
        variant: 'destructive',
      });
    });
  });

  it('formate correctement le numéro de carte et la date d\'expiration', () => {
    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    const cardNumberInput = screen.getByPlaceholderText('XXXX XXXX XXXX XXXX');
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');

    const expiryDateInput = screen.getByPlaceholderText('MM/AA');
    fireEvent.change(expiryDateInput, { target: { value: '1225' } });
    expect(expiryDateInput).toHaveValue('12/25');
  });

  it('soumet le formulaire avec succès', async () => {
    const mockResponse = {
      data: {
        id: 'pay_123',
        montant: 50,
        statut: 'succeeded',
        created_at: new Date().toISOString(),
        mode_paiement: 'credit',
      },
    };
    vi.mocked(axios.post).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Ex: MOHAMED BEN ALI'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('XXXX XXXX XXXX XXXX'), {
      target: { value: '4111111111111111' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { value: '12/25' },
    });
    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Payer Maintenant'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: "Paiement réussi",
        description: expect.stringContaining("50,000 DT"),
        variant: "default",
      });
    });
  });

  it('gère les erreurs de paiement', async () => {
    vi.mocked(axios.post).mockRejectedValue({
      response: { data: { error: 'Carte refusée' } },
    });

    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Ex: MOHAMED BEN ALI'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('XXXX XXXX XXXX XXXX'), {
      target: { value: '4111111111111111' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { value: '12/25' },
    });
    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Payer Maintenant'));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erreur de paiement',
        description: 'Carte refusée',
        variant: 'destructive',
        duration: 10000,
      });
    });
  });
});
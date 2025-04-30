import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

// Types
interface Reservation {
  id: string;
  origin: string;
  destination: string;
  date: Date;
  seats: number;
  price: number;
}

interface PaiementResponse {
  id: string;
  reservation_id: string;
  montant: number;
  statut: 'pending' | 'completed' | 'failed';
  created_at: string;
}

// Helpers
const formatCardNumber = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);

const formatExpiryDate = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

// Component
export default function PaiementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit'>('credit');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8000';

  const serviceCharge = 100;
  const totalPrice = reservation ? reservation.price + serviceCharge : 0;

  useEffect(() => {
    if (location.state?.reservation) {
      setReservation(location.state.reservation as Reservation);
    } else {
      navigate('/', { replace: true });
      toast({
        title: "Erreur",
        description: "Aucune réservation trouvée.",
        variant: "destructive",
      });
    }
  }, [location.state, navigate, toast]);

  const validateCard = (): string | null => {
    if (cardNumber.replace(/\s/g, '').length !== 16) return "Numéro de carte invalide.";
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return "Date d'expiration invalide (MM/AA).";
    if (cvc.length !== 3) return "Code CVC invalide.";
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateCard();
    if (validationError) {
      toast({
        title: "Erreur de validation",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        reservation_id: reservation?.id,
        montant: totalPrice,
        mode_paiement: paymentMethod,
        metadata: {
          card_last4: cardNumber.slice(-4),
          card_brand: paymentMethod === 'credit' ? 'visa' : 'mastercard',
        },
      };

      const { data } = await axios.post<PaiementResponse>(`${API_GATEWAY_URL}/api/paiements`, paymentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (data.statut !== 'completed') {
        throw new Error("Le paiement n'a pas été finalisé.");
      }

      navigate('/confirmation', {
        state: {
          paiement: data,
          reservation,
        },
        replace: true,
      });
    } catch (error) {
      console.error('Erreur de paiement:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : (error as Error).message;

      toast({
        title: "Échec du paiement",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Retour
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulaire de paiement */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold mb-6">Paiement sécurisé</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Résumé du trajet */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Votre trajet</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{reservation.origin} → {reservation.destination}</span>
                    <span className="text-blue-600 font-bold">{reservation.price} DT</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    {format(reservation.date, 'PPPP', { locale: fr })}
                  </div>
                  <div className="mt-2 text-sm">{reservation.seats} {reservation.seats > 1 ? 'places' : 'place'}</div>
                </div>
              </div>

              {/* Moyen de paiement */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Moyen de paiement</h3>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'credit' | 'debit')} className="space-y-3">
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:border-blue-500">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex-1 cursor-pointer">Carte de crédit</Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-md p-3 hover:border-blue-500">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit" className="flex-1 cursor-pointer">Carte de débit</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Informations de paiement */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informations de paiement</h3>

                <div>
                  <Label htmlFor="cardHolder">Nom sur la carte</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d'expiration (MM/AA)</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/AA"
                      value={formatExpiryDate(expiryDate)}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Traitement en cours...
                  </>
                ) : (
                  `Payer ${totalPrice.toLocaleString('fr-TN')} DT`
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit sticky top-8">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>
            <div className="space-y-6">
              <div className="flex justify-between">
                <span>Prix du trajet</span>
                <span>{reservation.price} DT</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de service</span>
                <span>{serviceCharge} DT</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{totalPrice} DT</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
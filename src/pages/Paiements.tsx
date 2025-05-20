import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Loader2, Ticket, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface Reservation {
  id?: string;
  origin: string;
  destination: string;
  date: Date | string;
  seats: number;
  price: number;
  pricePerSeat?: number;
}

interface PaiementResponse {
  id: string;
  montant: number;
  statut: string;
  created_at: string;
  mode_paiement: string;
}

const formatCardNumber = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);

const formatExpiryDate = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

const safeFormatDate = (date: Date | string | undefined, formatStr: string, defaultValue = 'Date non spécifiée') => {
  if (!date) return defaultValue;
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? defaultValue : format(dateObj, formatStr, { locale: fr });
  } catch {
    return defaultValue;
  }
};

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
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaiementResponse | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Calcul des prix (sans frais de service)
  const totalPrice = reservation?.price || 0;
  const formattedTotalPrice = totalPrice.toLocaleString('fr-TN', { minimumFractionDigits: 3 });
  const formattedReservationPrice = (reservation?.price || 0).toLocaleString('fr-TN', { minimumFractionDigits: 3 });
  const pricePerSeat = reservation ? (reservation.pricePerSeat || (reservation.price / reservation.seats)) : 0;
  const formattedPricePerSeat = pricePerSeat.toLocaleString('fr-TN', { minimumFractionDigits: 3 });

  useEffect(() => {
    if (!location.state?.reservation) {
      toast({
        title: "Information requise",
        description: "Les détails de la réservation sont manquants",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const res = location.state.reservation;
    console.log("Réservation reçue:", res);
    
    setReservation({
      origin: res.origin || "Non spécifié",
      destination: res.destination || "Non spécifié",
      date: res.date ? new Date(res.date) : new Date(),
      seats: Number(res.seats) || 1,
      price: Number(res.price) || 0,
      pricePerSeat: res.pricePerSeat || (res.price / res.seats)
    });
  }, [location.state, navigate, toast]);

  const validateCard = (): string | null => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    if (cleanCardNumber.length !== 16) return "Numéro de carte invalide (16 chiffres requis)";
    if (!/^\d{16}$/.test(cleanCardNumber)) return "Le numéro ne doit contenir que des chiffres";
    
    const [month, year] = expiryDate.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return "Format de date invalide (MM/AA requis)";
    }
    
    if (!/^\d{3}$/.test(cvc)) return "Code de sécurité invalide (3 chiffres requis)";
    if (cardHolder.trim().length < 3) return "Nom sur carte invalide (3 caractères minimum)";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Email invalide";

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateCard();
    if (validationError) {
      toast({ title: "Erreur", description: validationError, variant: "destructive" });
      return;
    }

    if (!reservation?.origin || !reservation?.destination) {
      toast({
        title: "Erreur de trajet",
        description: "Les informations de trajet sont incomplètes",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        montant: totalPrice,
        mode_paiement: paymentMethod,
        client_email: email,
        client_name: cardHolder,
        card_last4: cardNumber.replace(/\s/g, '').slice(-4),
        card_brand: paymentMethod === 'credit' ? 'visa' : 'mastercard',
        trajet: `${reservation.origin} → ${reservation.destination}`,
        date_trajet: reservation?.date ? safeFormatDate(reservation.date, 'yyyy-MM-dd') : null
      };

      const { data } = await axios.post<PaiementResponse>(
        `${API_URL}/api/paiements`,
        paymentData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      setPaymentDetails(data);
      setPaymentSuccess(true);

      toast({
        title: "Paiement réussi",
        description: `Votre paiement de ${formattedTotalPrice} DT a été confirmé`,
        variant: "default",
      });

      localStorage.setItem('lastPayment', JSON.stringify({
        id: data.id,
        amount: totalPrice,
        date: new Date().toISOString()
      }));

    } catch (error: any) {
      console.error("Erreur de paiement:", error);
      
      const serverError = error.response?.data;
      toast({
        title: "Erreur de paiement",
        description: serverError?.error || error.message || "Une erreur est survenue",
        variant: "destructive",
        duration: 10000
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

  if (paymentSuccess && paymentDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <Ticket className="w-12 h-12 mx-auto text-green-500" />
            <h1 className="text-2xl font-bold mt-4">Paiement confirmé</h1>
            <p className="text-gray-600 mt-2">Votre transaction a été effectuée avec succès</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-3">Détails du trajet</h2>
              <p>{reservation.origin} → {reservation.destination}</p>
              <p className="text-sm text-gray-500 mt-1">
                {safeFormatDate(reservation.date, 'PPPP')}
              </p>
              <p className="mt-2">Places: {reservation.seats}</p>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-3">Détails de paiement</h2>
              <p>Montant: {formattedTotalPrice} DT</p>
              <p>Référence: {paymentDetails.id}</p>
              <p>Méthode: {paymentMethod === 'credit' ? 'Carte de crédit' : 'Carte de débit'}</p>
              <p className="text-sm text-gray-500 mt-2">
                Effectué le {safeFormatDate(new Date(paymentDetails.created_at), 'PPpp')}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              Retour à l'accueil
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="w-full"
            >
              Imprimer le reçu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Paiement sécurisé</h1>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <h2 className="font-semibold text-lg mb-3">Informations de paiement</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardHolder">Nom sur la carte *</Label>
                  <Input
                    id="cardHolder"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Ex: MOHAMED BEN ALI"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Numéro de carte *</Label>
                  <Input
                    id="cardNumber"
                    value={formatCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d'expiration (MM/AA) *</Label>
                    <Input
                      id="expiryDate"
                      value={formatExpiryDate(expiryDate)}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                      placeholder="MM/AA"
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">Code CVC *</Label>
                    <Input
                      id="cvc"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      maxLength={3}
                      placeholder="123"
                      className="focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-3">Coordonnées</h2>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 border-gray-300"
                />
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-3">Méthode de paiement *</h2>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'credit' | 'debit')}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit" className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Carte de crédit
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                  <RadioGroupItem value="debit" id="debit" />
                  <Label htmlFor="debit" className="flex items-center gap-2">
                    <Banknote className="h-5 w-5" />
                    Carte de débit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Traitement en cours...
                </>
              ) : (
                "Payer Maintenant"
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Paiement sécurisé via SSL 256-bit. Nous ne stockons pas vos informations de carte bancaire.
            </p>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Trajet</span>
              <span className="font-medium">
                {reservation.origin} → {reservation.destination}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Date</span>
              <span>{safeFormatDate(reservation.date, 'PP')}</span>
            </div>

            <div className="flex justify-between">
              <span>Places</span>
              <span>{reservation.seats}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between">
              <span>Prix unitaire</span>
              <span>{formattedPricePerSeat} DT</span>
            </div>

            <div className="flex justify-between">
              <span>{reservation.seats} place(s)</span>
              <span>{formattedReservationPrice} DT</span>
            </div>
            <hr className="my-2 border-t-2" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total à payer</span>
              <span>{formattedTotalPrice} DT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
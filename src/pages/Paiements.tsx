
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  origin: string;
  destination: string;
  date: Date;
  seats: number;
  price: number;
}

export default function PaiementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (location.state?.reservation) {
      setReservation(location.state.reservation);
    } else {
      // Si pas de réservation, retour à la page d'accueil
      navigate('/');
    }
  }, [location.state, navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardHolder || !cardNumber || !expiryDate || !cvc) {
      toast({
        title: "Informations de paiement incomplètes",
        description: "Veuillez remplir tous les champs de paiement",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simuler un traitement de paiement
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Paiement réussi!",
        description: "Votre réservation a été confirmée. Vous recevrez un email de confirmation.",
        variant: "default",
      });
      navigate('/');
    }, 2000);
  };
  
  if (!reservation) {
    return <div className="p-8 text-center">Chargement...</div>;
  }
  
  const serviceCharge = 100;
  const totalPrice = reservation.price + serviceCharge;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-tunisbus-700"
        >
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
            className="mr-2"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Paiement
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold mb-6">Créer une réservation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Trajet</Label>
                <div className="border border-gray-200 rounded-md p-3 flex items-center mt-1">
                  {reservation.origin} → {reservation.destination} ({reservation.price} DT)
                </div>
              </div>
              
              <div>
                <Label>Date du voyage</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-500" />
                  </div>
                  <Input
                    type="text"
                    value={format(reservation.date, 'dd/MM/yyyy', { locale: fr })}
                    readOnly
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label>Nombre de places</Label>
                <Input
                  type="number"
                  value={reservation.seats}
                  readOnly
                  className="w-full"
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Moyen de paiement</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem id="credit" value="credit" />
                    <Label htmlFor="credit" className="flex-1 cursor-pointer">Carte de crédit</Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem id="debit" value="debit" />
                    <Label htmlFor="debit" className="flex-1 cursor-pointer">Carte de débit</Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-md p-3">
                    <RadioGroupItem id="transfer" value="transfer" />
                    <Label htmlFor="transfer" className="flex-1 cursor-pointer">Virement bancaire</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="cardHolder">Nom sur la carte</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d'expiration</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-tunisbus-600 hover:bg-tunisbus-700 text-white mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </span>
                ) : (
                  `Confirmer le paiement (${totalPrice.toLocaleString()} DT)`
                )}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit">
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
            
            <div className="space-y-6">
              <div>
                <div className="text-lg font-medium mb-2">
                  {reservation.origin} → {reservation.destination}
                </div>
                <div className="text-sm text-gray-500">
                  {format(reservation.date, 'dd/MM/yyyy', { locale: fr })} • {reservation.seats > 1 ? `${reservation.seats} places` : '1 place'}
                </div>
              </div>
              
              <div className="py-4 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{reservation.price.toLocaleString()} DT</span>
                </div>
                <div className="flex justify-between mb-4 text-sm text-gray-500">
                  <span>Frais de service</span>
                  <span>{serviceCharge.toLocaleString()} DT</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{totalPrice.toLocaleString()} DT</span>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check size={18} className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Paiement sécurisé</h3>
                    <p className="mt-1 text-sm text-green-700">
                      Vos données de paiement sont sécurisées et cryptées pour votre protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

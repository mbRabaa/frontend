import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Loader2 } from 'lucide-react'; // Ajout de Loader2 ici
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const cities = [
  "Tunis", "Sousse", "Sfax", "Monastir", "Gabès", "Bizerte", "Tozeur", "Mahdia", 
  "Kairouan", "Nabeul", "Hammamet", "Djerba", "Tabarka", "Zarzis", "Béja"
];

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL + '/api/reservations';

// Fonction pour obtenir le prix selon le trajet (à adapter avec votre API)
const getPricePerSeat = (origin: string, destination: string): number => {
  // Exemple de logique de prix - à remplacer par vos règles métiers
  if (origin === 'Tunis' && destination === 'Sfax') return 30.7;
  if (origin === 'Tunis' && destination === 'Sousse') return 15.5;
  // Ajoutez d'autres combinaisons selon vos besoins
  return 25.0; // Prix par défaut
};

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [seats, setSeats] = useState('1');
  const [trajetId, setTrajetId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const selectedJourneyId = location.state?.journeyId;

  useEffect(() => {
    if (selectedJourneyId) {
      if (selectedJourneyId === '1') {
        setOrigin('Tunis');
        setDestination('Sousse');
        setDate(new Date('2025-06-15'));
        setTrajetId('1');
      }
    }
  }, [selectedJourneyId]);

  const handleCancel = () => {
    toast({
      title: "Réservation annulée",
      description: "Votre réservation a été annulée",
    });
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!origin || !destination || !date) {
      toast({
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const seatsNumber = parseInt(seats);
    if (isNaN(seatsNumber) || seatsNumber <= 0) {
      toast({
        title: "Nombre de places invalide",
        description: "Veuillez entrer un nombre valide (minimum 1)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Créer la réservation côté serveur
      const { data: reservation } = await axios.post(API_GATEWAY_URL, {
        seats: seatsNumber,
        trajet_id: parseInt(trajetId)
      });

      // 2. Calculer les prix
      const pricePerSeat = getPricePerSeat(origin, destination);
      const totalPrice = pricePerSeat * seatsNumber;

      // 3. Préparer les données pour la page de paiement
      const fullReservation = {
        ...reservation,
        origin,
        destination,
        date: date.toISOString(),
        seats: seatsNumber,
        price: totalPrice,
        pricePerSeat
      };

      console.log("Données envoyées au paiement:", fullReservation);

      // 4. Rediriger vers la page de paiement avec toutes les données
      navigate('/paiements', {
        state: { 
          reservation: fullReservation 
        },
      });

    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de réserver. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Réservez maintenant</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Point de départ
              </label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un point de départ" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une destination" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de réservation
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center border border-gray-300 rounded-md p-3 text-left",
                      !date && "text-gray-500"
                    )}
                  >
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    {date ? format(date, 'PPP', { locale: fr }) : "Choisir une date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de places
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-tunisbus-600 hover:bg-tunisbus-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Traitement...
                  </>
                ) : (
                  "Réserver et Payer"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
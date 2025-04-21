
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
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

const cities = [
  "Tunis", "Sousse", "Sfax", "Monastir", "Gabès", "Bizerte", "Tozeur", "Mahdia", 
  "Kairouan", "Nabeul", "Hammamet", "Djerba", "Tabarka", "Zarzis", "Béja"
];

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [seats, setSeats] = useState('1');
  
  const selectedJourneyId = location.state?.journeyId;
  
  useEffect(() => {
    if (selectedJourneyId) {
      // Simuler le chargement des données du voyage sélectionné
      // Dans une application réelle, vous feriez une requête API
      if (selectedJourneyId === '1') {
        setOrigin('Tunis');
        setDestination('Sousse');
        setDate(new Date('2025-06-15'));
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination || !date) {
      toast({
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    // Simuler la création d'une réservation
    // Dans une application réelle, vous feriez une requête API
    
    navigate('/paiements', {
      state: {
        reservation: {
          origin,
          destination,
          date,
          seats: parseInt(seats),
          price: origin === 'Tunis' && destination === 'Sousse' ? 15500 : 10000,
        }
      }
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Formulaire de Réservation</h1>
          
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
                    className={cn("p-3 pointer-events-auto")}
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
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-tunisbus-600 hover:bg-tunisbus-700 text-white"
              >
                Réserver et Payer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

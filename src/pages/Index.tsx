import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const cities = [
  "Tunis", "Sousse", "Sfax", "Monastir", "Gabès", "Bizerte", "Tozeur", "Mahdia", 
  "Kairouan", "Nabeul", "Hammamet", "Djerba", "Tabarka", "Zarzis", "Béja"
];

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
  <div className="tunisbus-card flex flex-col items-center text-center">
    <div className="bg-tunisbus-100 p-4 rounded-full mb-4">
      <div className="text-tunisbus-600">{icon}</div>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showOriginPopover, setShowOriginPopover] = useState(false);
  const [showDestinationPopover, setShowDestinationPopover] = useState(false);

  const handleSearch = () => {
    navigate('/trajets');
  };

  const handleReserveNow = () => {
    navigate('/reservations');
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-tunisbus-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Réservez vos billets de bus en quelques clics
              </h1>
              <p className="text-xl text-gray-600">
                Voyagez en toute simplicité à travers la Tunisie avec TunisBus
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-center">Trouvez votre trajet</h2>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Origin */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Départ</label>
                  <Popover open={showOriginPopover} onOpenChange={setShowOriginPopover}>
                    <PopoverTrigger asChild>
                      <button className="flex items-center w-full p-3 rounded-md border border-gray-300 text-left">
                        <MapPin size={18} className="text-gray-500 mr-2" />
                        {origin || "Sélectionnez un point de départ"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="max-h-60 overflow-y-auto p-2">
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setOrigin(city);
                              setShowOriginPopover(false);
                            }}
                            className="w-full text-left p-2 hover:bg-tunisbus-50 rounded-md"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <Popover open={showDestinationPopover} onOpenChange={setShowDestinationPopover}>
                    <PopoverTrigger asChild>
                      <button className="flex items-center w-full p-3 rounded-md border border-gray-300 text-left">
                        <MapPin size={18} className="text-gray-500 mr-2" />
                        {destination || "Sélectionnez une destination"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <div className="max-h-60 overflow-y-auto p-2">
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setDestination(city);
                              setShowDestinationPopover(false);
                            }}
                            className="w-full text-left p-2 hover:bg-tunisbus-50 rounded-md"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center w-full p-3 rounded-md border border-gray-300 text-left">
                        <Calendar size={18} className="text-gray-500 mr-2" />
                        {date ? format(date, 'PPP', { locale: fr }) : "Date"}
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
              </div>

              <button
                onClick={handleSearch}
                className="w-full mt-6 bg-tunisbus-600 hover:bg-tunisbus-700 text-white py-3 px-4 rounded-md flex items-center justify-center"
              >
                <Search size={20} className="mr-2" />
                Rechercher
              </button>
            </div>

            <div className="text-center">
              <Button
                onClick={handleReserveNow}
                className="bg-tunisbus-600 hover:bg-tunisbus-700 text-white font-medium px-6 py-3 rounded-md"
              >
                Réserver maintenant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="tunisbus-section py-16">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Nos Services</h2>
            <p className="text-gray-600">Découvrez ce que TunisBus peut vous offrir</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<Calendar size={24} />}
              title="Réservation en ligne"
              description="Réservez facilement vos billets de bus depuis votre téléphone ou ordinateur."
            />
            <ServiceCard
              icon={<Search size={24} />}
              title="Paiement sécurisé"
              description="Plusieurs options de paiement sécurisées pour votre confort."
            />
            <ServiceCard
              icon={<MapPin size={24} />}
              title="Support client"
              description="Un service client disponible 24h/24 pour répondre à vos besoins."
            />
            <ServiceCard
              icon={<img src="/bus-icon.svg" alt="Bus" className="w-6 h-6" />}
              title="Confort & Sécurité"
              description="Des bus modernes et sécurisés pour un voyage agréable."
            />
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-white py-16">
  <div className="container mx-auto max-w-3xl px-4">
    <h2 className="text-3xl font-bold mb-6 text-center">Laissez-nous votre avis</h2>
    <p className="text-center text-gray-600 mb-10">Votre retour nous aide à améliorer notre service.</p>
    
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Merci pour votre retour !");
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input
          id="name"
          type="text"
          placeholder="Entrez votre nom"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tunisbus-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Entrez votre email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tunisbus-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Votre message</label>
        <textarea
          id="message"
          rows={4}
          placeholder="Écrivez votre message ici"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tunisbus-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-tunisbus-600 hover:bg-tunisbus-700 text-white font-medium px-6 py-3 rounded-md w-full"
      >
        Envoyer
      </button>
    </form>
  </div>
</section>

    </div>
  );
}

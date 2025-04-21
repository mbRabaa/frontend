
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface Journey {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  duration: string;
  price: number;
  availableSeats: number;
}

const mockJourneys: Journey[] = [
  {
    id: '1',
    origin: 'Tunis',
    destination: 'Sousse',
    date: '2025-06-15',
    departureTime: '08:00',
    duration: '3h',
    price: 15500,
    availableSeats: 30
  },
  {
    id: '2',
    origin: 'Sousse',
    destination: 'Monastir',
    date: '2025-06-15',
    departureTime: '10:00',
    duration: '45min',
    price: 5,
    availableSeats: 45
  },
  {
    id: '3',
    origin: 'Sfax',
    destination: 'Gabès',
    date: '2025-06-15',
    departureTime: '11:15',
    duration: '1h 45min',
    price: 15,
    availableSeats: 35
  },
  {
    id: '4',
    origin: 'Tunis',
    destination: 'Bizerte',
    date: '2025-06-16',
    departureTime: '07:30',
    duration: '1h 15min',
    price: 10,
    availableSeats: 25
  },
  {
    id: '5',
    origin: 'Tunis',
    destination: 'Tozeur',
    date: '2025-11-03',
    departureTime: '08:00',
    duration: '7h',
    price: 30700,
    availableSeats: 15
  },
  {
    id: '6',
    origin: 'Sousse',
    destination: 'Mahdia',
    date: '2025-04-30',
    departureTime: '10:30',
    duration: '1h30min',
    price: 7000,
    availableSeats: 20
  }
];

export default function TrajetsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>(mockJourneys);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredJourneys(mockJourneys);
    } else {
      const filtered = mockJourneys.filter(journey => 
        journey.origin.toLowerCase().includes(value.toLowerCase()) ||
        journey.destination.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJourneys(filtered);
    }
  };

  const handleReservation = (journeyId: string) => {
    navigate('/reservations', { state: { journeyId } });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Trajets disponibles</h1>
        
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-tunisbus-500 focus:border-transparent"
            />
          </div>
          
          <Button 
            className="bg-tunisbus-600 hover:bg-tunisbus-700 text-white px-6"
          >
            Rechercher
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredJourneys.map((journey) => (
          <div key={journey.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="text-tunisbus-600 mr-2">
                    <MapPin size={20} />
                  </div>
                  <span className="text-lg font-semibold">
                    {journey.origin} <ArrowRight size={16} className="inline mx-2" /> {journey.destination}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-500 mr-2" />
                    <span>
                      {format(new Date(journey.date), 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={18} className="text-gray-500 mr-2" />
                    <span>{journey.departureTime}</span>
                    <span className="mx-2">•</span>
                    <span>{journey.duration}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-gray-500 mr-2"
                    >
                      <rect width="20" height="12" x="2" y="6" rx="2"/>
                      <path d="M12 12h.01"/>
                      <path d="M17 12h.01"/>
                      <path d="M7 12h.01"/>
                    </svg>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {journey.price} DT
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button 
                  onClick={() => handleReservation(journey.id)}
                  className="w-full md:w-auto bg-tunisbus-600 hover:bg-tunisbus-700 text-white"
                >
                  Réserver
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, CalendarClock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  to: string;
  isActive: boolean;
};

const SidebarItem = ({ icon, text, to, isActive }: SidebarItemProps) => {
  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", 
        isActive ? "bg-tunisbus-100 text-tunisbus-700" : "hover:bg-gray-100 text-gray-700"
      )}
    >
      <div className="text-tunisbus-600">{icon}</div>
      <span>{text}</span>
    </Link>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarItems = [
    { icon: <Home size={20} />, text: "Accueil", to: "/" },
    { icon: <MapPin size={20} />, text: "Trajets", to: "/trajets" },
    { icon: <CalendarClock size={20} />, text: "Réservations", to: "/reservations" },
    { icon: <CreditCard size={20} />, text: "Paiements", to: "/paiements" },
  ];

  const sidebarClass = cn(
    "bg-white h-screen flex flex-col border-r border-gray-200 transition-all duration-300",
    isMobile ? (isOpen ? "w-64 fixed z-30 shadow-lg" : "w-0 fixed overflow-hidden") : "w-64"
  );

  return (
    <>
      {isMobile && (
        <button 
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-40 bg-white rounded-full p-2 shadow-md"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tunisbus-600">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tunisbus-600">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      )}
      
      <div className={sidebarClass}>
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="bg-tunisbus-100 p-2 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-tunisbus-600"
              >
                <path d="M8 6v6"></path>
                <path d="M15 6v6"></path>
                <path d="M2 12h19.6"></path>
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
                <circle cx="7" cy="18" r="2"></circle>
                <circle cx="15" cy="18" r="2"></circle>
              </svg>
            </div>
          </div>
          <div className="font-bold text-xl text-tunisbus-700">TunisBus</div>
        </div>
        
        <div className="flex-1 py-4 space-y-1 px-3">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              to={item.to}
              isActive={location.pathname === item.to}
            />
          ))}
        </div>
      </div>
    </>
  );
}

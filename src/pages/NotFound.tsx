
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-tunisbus-100 mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-tunisbus-600"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">404</h1>
        <p className="text-gray-600 mb-6">
          Oups! La page que vous recherchez semble avoir pris un autre bus.
        </p>
        
        <Button asChild className="bg-tunisbus-600 hover:bg-tunisbus-700 text-white">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}

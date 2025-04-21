
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
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
              <span className="font-bold text-xl text-tunisbus-700">TunisBus</span>
            </Link>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link to="/a-propos" className="text-gray-700 hover:text-tunisbus-600 hidden md:block">
              À propos
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

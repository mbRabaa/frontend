
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const content = {
    title: "À propos de TunisBus",
    subtitle: "Votre partenaire de confiance pour vos voyages en Tunisie",
    description: [
      "TunisBus est une entreprise tunisienne fondée en 2025 avec pour mission de révolutionner le transport de passagers en Tunisie.",
      "Nous offrons un service de réservation de billets de bus en ligne simple, efficace et sécurisé pour tous vos déplacements à travers le pays.",
      "Notre plateforme connecte les voyageurs avec les meilleures compagnies de transport, assurant confort, ponctualité et sécurité pour chaque trajet."
    ],
    mission: {
      title: "Notre mission",
      points: [
        "Simplifier les déplacements en Tunisie grâce à une technologie innovante",
        "Offrir une expérience de réservation transparente et sans tracas",
        "Garantir les meilleurs prix et options pour tous les voyageurs",
        "Contribuer au développement du tourisme et de la mobilité en Tunisie"
      ]
    },
    services: {
      title: "Nos services",
      points: [
        "Réservation de billets de bus en ligne 24/7",
        "Paiement sécurisé par carte bancaire ou virement",
        "Assistance client dédiée avant, pendant et après votre voyage",
        "Notifications et rappels automatiques pour vos trajets",
        "Options de modification et d'annulation flexibles"
      ]
    },
    contact: {
      title: "Contactez-nous",
      email: "contact@tunisbus.tn",
      phone: "+216 71 123 456",
      address: "Avenue Habib Bourguiba, Tunis 1001, Tunisie"
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-left">
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-xl text-gray-600 mb-12">{content.subtitle}</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
            <div className="space-y-4 order-2 md:order-1">
              {content.description.map((paragraph, index) => (
                <p key={index} className="text-gray-700">{paragraph}</p>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-tunisbus-100 rounded-xl shadow-md w-full h-64 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="96" 
                  height="96" 
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
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-tunisbus-700">{content.mission.title}</h2>
              <ul className="space-y-3">
                {content.mission.points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-tunisbus-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-tunisbus-700">{content.services.title}</h2>
              <ul className="space-y-3">
                {content.services.points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-tunisbus-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-tunisbus-50 rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-tunisbus-700">{content.contact.title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
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
                    <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path>
                    <polyline points="15,9 18,9 18,11"></polyline>
                    <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0"></path>
                    <line x1="6" y1="10" x2="7" y2="10"></line>
                  </svg>
                </div>
                <p className="font-medium mb-1">Email</p>
                <p className="text-gray-600">{content.contact.email}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <p className="font-medium mb-1">Téléphone</p>
                <p className="text-gray-600">{content.contact.phone}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
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
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <p className="font-medium mb-1">Adresse</p>
                <p className="text-gray-600">{content.contact.address}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-tunisbus-600 hover:bg-tunisbus-700 text-white font-medium px-6 py-3"
            >
              Contactez-nous
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

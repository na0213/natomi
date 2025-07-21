
'use client';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'works', label: 'Works' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="logo flex items-center">
            <img 
              src="https://static.readdy.ai/image/a12a4ed85e332a39d4b890d8738d2418/653a65db2e6f34c0a4c63d826bf69bb0.png" 
              alt="natomi logo" 
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-2xl font-bold text-[#3be7ed]">natomi</h1>
          </div>
          
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`nav-tab px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'text-[#3be7ed] active'
                    : 'text-[#333] hover:text-[#3be7ed]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

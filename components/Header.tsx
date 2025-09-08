'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'works', label: 'Works' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsMenuOpen(false); // メニューを閉じる
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="logo flex items-center">
            <Image src="/natomi.png" alt="logo" width={32} height={32} className="h-8 w-8" />
            <h1 className="text-base md:text-2xl font-bold text-[#3be7ed] ms-2"></h1>
          </div>

          {/* PCナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                aria-current={activeSection === tab.id ? 'page' : undefined}
                className={`nav-tab px-1 pb-2 text-sm font-medium transition-colors border-b-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3be7ed]/40 ${
                  activeSection === tab.id
                    ? 'text-[#3be7ed] border-[#3be7ed]'
                    : 'text-[#333] border-transparent hover:text-[#3be7ed] hover:border-[#3be7ed]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* スマホメニューアイコン */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="メニューを開く">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* スマホ用メニュー */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                aria-current={activeSection === tab.id ? 'page' : undefined}
                className={`block w-full text-left px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3be7ed]/40 ${
                  activeSection === tab.id
                    ? 'text-[#3be7ed]'
                    : 'text-[#333] hover:text-[#3be7ed]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

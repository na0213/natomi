'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TopSection from '@/components/TopSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import WorksSection from '@/components/WorksSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    // 初回：ハッシュがあればその位置へ
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'auto' });
        setActiveSection(id);
      }
    }

    const handleScroll = () => {
      const sections = ['about', 'skills', 'works', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleHashOrPop = () => {
      const id = window.location.hash.replace('#', '');
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashOrPop);
    window.addEventListener('popstate', handleHashOrPop);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashOrPop);
      window.removeEventListener('popstate', handleHashOrPop);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // クリック時は履歴を積む
      if (history.pushState) {
        history.pushState(null, '', `#${sectionId}`);
      } else {
        window.location.hash = sectionId;
      }
      setActiveSection(sectionId);
    }
  };

  // アクティブセクションが変わったらURLハッシュを同期（履歴は汚さない）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const target = `#${activeSection}`;
    if (window.location.hash !== target) {
      history.replaceState(null, '', target);
    }
  }, [activeSection]);

  return (
    <div className="bg-white">
      <Header 
        activeSection={activeSection} 
        onNavigate={scrollToSection}
      />
      
      <main>
        <TopSection />
        <AboutSection />
        <SkillsSection />
        <WorksSection />
        <ContactSection />
      </main>
            
      <Footer />
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';

export default function TopSection() {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = "小さくはじめて夢はでっかく";
  const animationOrder = ["小","さ","く","は","じ","め","て","夢","は","で","っ","か","く"];

  useEffect(() => {
    if (currentIndex < animationOrder.length) {
      const timer = setTimeout(() => {
        setCurrentText(prev => prev + animationOrder[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);

      return () => clearTimeout(timer);
    } else {
      setAnimationComplete(true);
    }
  }, [currentIndex, animationOrder]);

  const getDisplayText = (targetText: string) => {
    let displayText = '';
    for (let i = 0; i < targetText.length; i++) {
      const char = targetText[i];
      if (currentText.includes(char)) {
        displayText += char;
      } else {
        displayText += ' ';
      }
    }
    return displayText;
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20modern%20minimalist%20workspace%20with%20soft%20natural%20lighting%2C%20clean%20desk%20setup%2C%20inspirational%20atmosphere%2C%20calm%20and%20peaceful%20environment%2C%20gentle%20morning%20light%20streaming%20through%20window%2C%20subtle%20bokeh%20effects%2C%20professional%20yet%20warm%20feeling%2C%20perfect%20for%20motivation%20and%20dreams&width=1920&height=1080&seq=natomi-hero-bg&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="relative z-10 w-full h-full">
        <div className="absolute catchphrase-container">
          <div className="absolute" style={{ right: '40%', top: '30%' }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight writing-mode-vertical">
              <div className="relative inline-block">
                {getDisplayText("小さくはじめて").split('').map((char, index) => (
                  <div key={index} className="block text-center">
                    {char}
                  </div>
                ))}
                <div className="block text-center animate-pulse">|</div>
              </div>
            </h1>
          </div>
          
          <div className="absolute" style={{ right: '35%', top: '50%' }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight writing-mode-vertical">
              <div className="relative inline-block">
                {getDisplayText("夢はでっかく").split('').map((char, index) => (
                  <div key={index} className="block text-center">
                    {char}
                  </div>
                ))}
                {!animationComplete && currentText.length > 7 && (
                  <div className="block text-center animate-pulse">|</div>
                )}
              </div>
            </h2>
          </div>
        </div>

        {animationComplete && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeIn">
            <div className="w-1 h-12 bg-[#3be7ed] mx-auto animate-bounce"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .catchphrase-container {
          animation: slideUp 0.8s ease-out 0.5s both;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    </section>
  );
}
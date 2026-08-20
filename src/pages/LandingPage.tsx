import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { Footer } from '../components/landing/Footer';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar onNavigate={onNavigate} />
      <main className="flex-1">
        <HeroSection onNavigate={onNavigate} />
        <FeaturesSection />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

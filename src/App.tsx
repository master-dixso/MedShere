import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NavRoute } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SolutionsSection } from './components/SolutionsSection';
import { ModulesShowcase } from './components/ModulesShowcase';
import { PricingCalculator } from './components/PricingCalculator';
import { DocsHub } from './components/DocsHub';
import { TestSuiteRunner } from './components/TestSuiteRunner';
import { HelpCenter } from './components/HelpCenter';
import { Footer } from './components/Footer';
import { HospitalSandboxModal } from './components/HospitalSandboxModal';
import { BookDemoModal } from './components/BookDemoModal';
import { LiveChatWidget } from './components/LiveChatWidget';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('home');
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-200 selection:bg-blue-600 selection:text-white font-sans">
        {/* Navigation Header */}
        <Navbar
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
          onOpenSandbox={() => setIsSandboxOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1">
          {currentRoute === 'home' && (
            <>
              <Hero
                onOpenSandbox={() => setIsSandboxOpen(true)}
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
                onNavigate={setCurrentRoute}
              />
              <SolutionsSection onOpenBookDemo={() => setIsBookDemoOpen(true)} />
              <ModulesShowcase onOpenSandbox={() => setIsSandboxOpen(true)} />
              <PricingCalculator onOpenBookDemo={() => setIsBookDemoOpen(true)} />
              <DocsHub />
              <TestSuiteRunner />
              <HelpCenter
                onOpenLiveChat={() => setIsChatOpen(true)}
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
              />
            </>
          )}

          {currentRoute === 'solutions' && (
            <div className="pt-20">
              <SolutionsSection onOpenBookDemo={() => setIsBookDemoOpen(true)} />
              <ModulesShowcase onOpenSandbox={() => setIsSandboxOpen(true)} />
            </div>
          )}

          {currentRoute === 'modules' && (
            <div className="pt-20">
              <ModulesShowcase onOpenSandbox={() => setIsSandboxOpen(true)} />
              <SolutionsSection onOpenBookDemo={() => setIsBookDemoOpen(true)} />
            </div>
          )}

          {currentRoute === 'pricing' && (
            <div className="pt-20">
              <PricingCalculator onOpenBookDemo={() => setIsBookDemoOpen(true)} />
              <HelpCenter
                onOpenLiveChat={() => setIsChatOpen(true)}
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
              />
            </div>
          )}

          {currentRoute === 'docs' && (
            <div className="pt-20">
              <DocsHub />
            </div>
          )}

          {currentRoute === 'tests' && (
            <div className="pt-20">
              <TestSuiteRunner />
            </div>
          )}

          {currentRoute === 'help' && (
            <div className="pt-20">
              <HelpCenter
                onOpenLiveChat={() => setIsChatOpen(true)}
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
              />
            </div>
          )}
        </main>

        {/* Global Footer */}
        <Footer
          setCurrentRoute={setCurrentRoute}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
          onOpenSandbox={() => setIsSandboxOpen(true)}
        />

        {/* Interactive Modals */}
        <HospitalSandboxModal
          isOpen={isSandboxOpen}
          onClose={() => setIsSandboxOpen(false)}
        />

        <BookDemoModal
          isOpen={isBookDemoOpen}
          onClose={() => setIsBookDemoOpen(false)}
        />

        {/* 24/7 AI Healthcare Assistant Widget */}
        <LiveChatWidget
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen((prev) => !prev)}
          onOpenBookDemo={() => {
            setIsChatOpen(false);
            setIsBookDemoOpen(true);
          }}
        />
      </div>
    </ThemeProvider>
  );
}

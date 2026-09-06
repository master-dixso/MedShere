import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NavRoute } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SolutionsSection } from './components/SolutionsSection';
import { ModulesShowcase } from './components/ModulesShowcase';
import { PricingCalculator } from './components/PricingCalculator';
import { DocsHub } from './components/DocsHub';
import { CompetitiveMatrix } from './components/CompetitiveMatrix';
import { TestSuiteRunner } from './components/TestSuiteRunner';
import { HelpCenter } from './components/HelpCenter';
import { Footer } from './components/Footer';
import { HospitalSandboxModal } from './components/HospitalSandboxModal';
import { BookDemoModal } from './components/BookDemoModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { usePerformanceMonitor } from './utils/usePerformanceMonitor';

export default function App() {
  // Initialize real-time Core Web Vitals (LCP, CLS, FCP, TTFB, FID) monitoring
  usePerformanceMonitor({
    enableConsoleLog: true,
    logOnMetricChange: true,
  });

  const [currentRoute, setCurrentRoute] = useState<NavRoute>('home');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('emr');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'specialty' | 'operations' | 'infrastructure'>('all');
  const [selectedSolutionId, setSelectedSolutionId] = useState<string>('private');
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    if (currentRoute !== 'home' && currentRoute !== 'modules') {
      setCurrentRoute('home');
    }
    setTimeout(() => {
      const el = document.getElementById('modules-showcase-section');
      if (el) {
        const headerOffset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  const handleSelectCategory = (category: 'all' | 'core' | 'specialty' | 'operations' | 'infrastructure') => {
    setSelectedCategory(category);
    if (currentRoute !== 'home' && currentRoute !== 'modules') {
      setCurrentRoute('home');
    }
    setTimeout(() => {
      const el = document.getElementById('modules-showcase-section');
      if (el) {
        const headerOffset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  const handleSelectSolution = (solutionId: string) => {
    setSelectedSolutionId(solutionId);
    if (currentRoute !== 'home' && currentRoute !== 'solutions') {
      setCurrentRoute('home');
    }
    setTimeout(() => {
      const el = document.getElementById('solutions-section');
      if (el) {
        const headerOffset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 60);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-200 selection:bg-blue-600 selection:text-white font-sans">
        {/* Skip to Main Content Link for A11y & WCAG 2.2 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-hidden text-xs font-bold transition-all"
        >
          Skip to main content
        </a>

        {/* Navigation Header */}
        <Navbar
          currentRoute={currentRoute}
          setCurrentRoute={setCurrentRoute}
          onOpenSandbox={() => setIsSandboxOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
          onSelectModule={handleSelectModule}
          onSelectCategory={handleSelectCategory}
          onSelectSolution={handleSelectSolution}
        />

        {/* Dynamic Route Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-hidden">
          {currentRoute === 'home' && (
            <>
              <Hero
                onOpenSandbox={() => setIsSandboxOpen(true)}
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
                onNavigate={setCurrentRoute}
              />
              <SolutionsSection
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
                selectedSolutionId={selectedSolutionId}
                onSelectSolution={setSelectedSolutionId}
              />
              <ModulesShowcase
                onOpenSandbox={() => setIsSandboxOpen(true)}
                selectedModuleId={selectedModuleId}
                onSelectModule={setSelectedModuleId}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <PricingCalculator onOpenBookDemo={() => setIsBookDemoOpen(true)} />
              <CompetitiveMatrix
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
                onOpenSandbox={() => setIsSandboxOpen(true)}
              />
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
              <SolutionsSection
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
                selectedSolutionId={selectedSolutionId}
                onSelectSolution={setSelectedSolutionId}
              />
              <ModulesShowcase
                onOpenSandbox={() => setIsSandboxOpen(true)}
                selectedModuleId={selectedModuleId}
                onSelectModule={setSelectedModuleId}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          )}

          {currentRoute === 'modules' && (
            <div className="pt-20">
              <ModulesShowcase
                onOpenSandbox={() => setIsSandboxOpen(true)}
                selectedModuleId={selectedModuleId}
                onSelectModule={setSelectedModuleId}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <SolutionsSection
                onOpenBookDemo={() => setIsBookDemoOpen(true)}
                selectedSolutionId={selectedSolutionId}
                onSelectSolution={setSelectedSolutionId}
              />
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
          onSelectModule={handleSelectModule}
          onSelectCategory={handleSelectCategory}
          onSelectSolution={handleSelectSolution}
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

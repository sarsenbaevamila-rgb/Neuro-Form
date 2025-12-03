import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StrategyDashboard from './components/StrategyDashboard';
import MarketIntel from './components/MarketIntel';
import VisualStudio from './components/VisualStudio';
import AudioStudio from './components/AudioStudio';
import LiveBrainstorm from './components/LiveBrainstorm';
import { View } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.STRATEGY);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case View.STRATEGY:
        return <StrategyDashboard />;
      case View.MARKET:
        return <MarketIntel />;
      case View.VISUALS:
        return <VisualStudio />;
      case View.AUDIO:
        return <AudioStudio />;
      case View.LIVE:
        return <LiveBrainstorm />;
      default:
        return <StrategyDashboard />;
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-40 flex items-center justify-between px-4">
        <div className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          NEURO.FORM
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-slate-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 transition-all duration-300 w-full overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
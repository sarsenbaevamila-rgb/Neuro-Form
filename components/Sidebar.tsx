import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  Image as ImageIcon, 
  Mic, 
  Radio,
  X 
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const menuItems = [
    { id: View.STRATEGY, label: 'Стратегия', icon: LayoutDashboard },
    { id: View.MARKET, label: 'Анализ Рынка', icon: Search },
    { id: View.VISUALS, label: 'Визуал (Nano)', icon: ImageIcon },
    { id: View.AUDIO, label: 'Аудио Бренд', icon: Mic },
    { id: View.LIVE, label: 'Live Штурм', icon: Radio },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            NEURO.FORM
          </h1>
          <p className="text-slate-500 text-xs mt-1">Стратегическая платформа</p>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors mb-1 text-sm font-medium
              ${currentView === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 absolute bottom-0 w-full bg-slate-900">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Gemini 3 Pro Активен
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
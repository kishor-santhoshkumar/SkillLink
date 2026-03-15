import React from 'react';
import { Hammer, Wrench, Zap, Settings } from 'lucide-react';

const TradeSelector = ({ selectedTrade, onSelectTrade }) => {
  const trades = [
    { id: 'carpenter', name: 'Carpenter', icon: Hammer, color: '#8B4513' },
    { id: 'plumber', name: 'Plumber', icon: Wrench, color: '#2563EB' },
    { id: 'electrician', name: 'Electrician', icon: Zap, color: '#F59E0B' },
    { id: 'mechanic', name: 'Mechanic', icon: Settings, color: '#6B7280' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {trades.map((trade) => {
        const Icon = trade.icon;
        const isSelected = selectedTrade === trade.id;
        
        return (
          <button
            key={trade.id}
            type="button"
            onClick={() => onSelectTrade(trade.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-[#2563EB] bg-blue-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-[#2563EB]' : 'bg-slate-100'
                }`}
              >
                <Icon
                  className="w-8 h-8"
                  style={{ color: isSelected ? 'white' : trade.color }}
                />
              </div>
              <span
                className={`text-lg font-semibold ${
                  isSelected ? 'text-[#2563EB]' : 'text-slate-700'
                }`}
              >
                {trade.name}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TradeSelector;

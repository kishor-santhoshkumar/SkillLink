import React from 'react';
import { Check } from 'lucide-react';

const SpecializationSection = ({ trade, selectedSpecializations, onToggleSpecialization }) => {
  const specializationsByTrade = {
    carpenter: [
      'Modular kitchen',
      'Furniture making',
      'Door fitting',
      'Cabinet work',
      'Wooden flooring'
    ],
    plumber: [
      'Pipe fitting',
      'Leak repair',
      'Bathroom installation',
      'Motor pump setup',
      'Drainage system'
    ],
    electrician: [
      'House wiring',
      'Switchboard installation',
      'Fan installation',
      'Inverter setup',
      'Fault repair'
    ],
    mechanic: [
      'Two-wheeler repair',
      'Engine service',
      'Brake repair',
      'Oil change',
      'Electrical diagnosis'
    ]
  };

  if (!trade) {
    return (
      <div className="text-center py-8 text-slate-500">
        Please select a trade first
      </div>
    );
  }

  const specializations = specializationsByTrade[trade] || [];

  return (
    <div className="space-y-3">
      {specializations.map((spec) => {
        const isSelected = selectedSpecializations.includes(spec);
        
        return (
          <button
            key={spec}
            type="button"
            onClick={() => onToggleSpecialization(spec)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
              isSelected
                ? 'border-[#2563EB] bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected
                  ? 'border-[#2563EB] bg-[#2563EB]'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
            <span
              className={`text-left text-base font-medium ${
                isSelected ? 'text-[#2563EB]' : 'text-slate-700'
              }`}
            >
              {spec}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SpecializationSection;

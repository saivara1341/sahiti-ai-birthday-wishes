import React from 'react';
import { Gift } from 'lucide-react';

interface YearButtonsProps {
  onYearClick: (year: number) => void;
}

const YearButtons = ({ onYearClick }: YearButtonsProps) => {
  const currentYear = new Date().getFullYear();
  const birthdayPassed = new Date() >= new Date('2025-06-30');
  const years = [2022, 2023, 2024, 2025, 2026];

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearClick(year)}
              className="relative p-6 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm hover:shadow-xl hover:bg-white/60 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-pink-50/50 rounded-2xl group-hover:bg-pink-100/50 transition-colors duration-300">
                  <Gift className="w-8 h-8 text-pink-500" />
                </div>
                <span className="text-2xl font-bold text-pink-900 tracking-tight">
                  {year}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearButtons;

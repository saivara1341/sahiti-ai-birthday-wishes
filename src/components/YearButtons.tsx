import React from 'react';
import { Gift } from 'lucide-react';

interface YearButtonsProps {
  onYearClick: (year: number) => void;
}

const YearButtons = ({ onYearClick }: YearButtonsProps) => {
  const currentYear = new Date().getFullYear();
  const birthdayPassed = new Date() >= new Date('2025-06-30');
  const years = [2022, 2023, 2024, 2025, 2026];
  const is2026Released = new Date() >= new Date('2026-06-30T14:00:00+05:30');

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {years.map((year) => {
            const isPending2026 = year === 2026 && !is2026Released;
            return (
              <button
                key={year}
                onClick={() => !isPending2026 && onYearClick(year)}
                className={`relative p-6 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm transition-all duration-300 group ${isPending2026 ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:bg-white/60 hover:-translate-y-1'}`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-2xl transition-colors duration-300 ${isPending2026 ? 'bg-gray-100/50' : 'bg-pink-50/50 group-hover:bg-pink-100/50'}`}>
                    <Gift className={`w-8 h-8 ${isPending2026 ? 'text-gray-400' : 'text-pink-500'}`} />
                  </div>
                  <span className={`font-bold tracking-tight ${isPending2026 ? 'text-lg text-gray-600' : 'text-2xl text-pink-900'}`}>
                    {isPending2026 ? 'Stay Tuned' : year}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YearButtons;

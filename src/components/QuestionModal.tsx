
import React, { useState } from 'react';

interface QuestionModalProps {
  onAnswer: (answer: string) => void;
}

const QuestionModal = ({ onAnswer }: QuestionModalProps) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(answer);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Sahiti AI!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            To unlock the full experience, please answer this question:
          </p>
          
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 p-4 rounded-xl mb-6">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              "What magical date marks the beginning of a brilliant mind's journey into this world, 
              when summer's warmth welcomed a future innovator in the year of technological dreams?"
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the date (DD-MM-YYYY)"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Enter Sahiti AI
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;

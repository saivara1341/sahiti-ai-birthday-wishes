
import React from 'react';

interface SahitiIntroProps {
  onAccessAI: () => void;
}

const SahitiIntro = ({ onAccessAI }: SahitiIntroProps) => {
  return (
    <div className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Meet Sahiti AI
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Experience the next generation of AI conversation. Sahiti AI combines advanced intelligence 
            with intuitive design to provide you with seamless, natural interactions. Whether you're 
            seeking answers, creative inspiration, or meaningful dialogue, Sahiti AI is here to assist 
            you with the same brilliance and insight that defines its namesake.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Intelligent Responses</h3>
            <p className="text-gray-600 dark:text-gray-300">Advanced AI capabilities for thoughtful and accurate answers</p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Natural Conversation</h3>
            <p className="text-gray-600 dark:text-gray-300">Engaging dialogue that feels human and intuitive</p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-300">Quick responses powered by cutting-edge technology</p>
          </div>
        </div>

        <button
          onClick={onAccessAI}
          className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="relative z-10">Access Sahiti AI</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );
};

export default SahitiIntro;

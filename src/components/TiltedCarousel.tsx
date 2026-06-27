import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  '/assets/img_1.jpeg',
  '/assets/img_2.jpeg',
  '/assets/img_3.jpeg',
  '/assets/img_4.jpeg',
  '/assets/img_5.jpeg',
  '/assets/img_6.jpeg'
];

const TiltedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-12 px-4" style={{ perspective: '1000px' }}>
      
      <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center mb-12 transform-gpu">
        <AnimatePresence mode="popLayout">
          {IMAGES.map((src, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === (currentIndex - 1 + IMAGES.length) % IMAGES.length;
            const isNext = index === (currentIndex + 1) % IMAGES.length;

            if (!isActive && !isPrev && !isNext) return null;

            return (
              <motion.div
                key={src + index}
                initial={{ opacity: 0, scale: 0.8, x: isNext ? 200 : -200, rotateY: isNext ? -45 : 45 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  scale: isActive ? 1 : 0.85,
                  x: isActive ? 0 : isNext ? 150 : -150,
                  rotateY: isActive ? 0 : isNext ? -30 : 30,
                  zIndex: isActive ? 10 : 0
                }}
                exit={{ opacity: 0, scale: 0.8, x: isActive ? 0 : isNext ? 200 : -200 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="absolute w-[250px] md:w-[400px] aspect-[3/4] bg-white/30 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl overflow-hidden p-2"
              >
                <img
                  src={src}
                  onError={handleImageError}
                  alt={`Sahiti Memories ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl shadow-inner"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex space-x-6 relative z-20">
        <button
          onClick={prevSlide}
          className="p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full hover:bg-white/20 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full hover:bg-white/20 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TiltedCarousel;

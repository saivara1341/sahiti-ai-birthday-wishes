import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ParallaxHeroCardProps {
  children: React.ReactNode;
}

const ParallaxHeroCard: React.FC<ParallaxHeroCardProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-4xl mx-auto rounded-3xl bg-white/30 backdrop-blur-md border border-white/60 shadow-2xl p-12 md:p-24 flex items-center justify-center cursor-pointer"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 text-center"
      >
        {children}
      </div>
      
      {/* Subtle glare effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 60%)",
          opacity: useTransform(mouseYSpring, [-0.5, 0.5], [0, 1]),
          transform: "translateZ(1px)",
        }}
      />
    </motion.div>
  );
};

export default ParallaxHeroCard;

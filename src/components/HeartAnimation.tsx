import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { X } from 'lucide-react';

const HeartAnimation = ({ onClose }: { onClose: () => void }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    // Move camera further back for mobile
    camera.position.z = window.innerWidth < 768 ? 1200 : 800;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create particles based on SVG path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M300,107.77C284.68,55.67,239.76,0,162.31,0,64.83,0,0,82.08,0,171.71c0,.48,0,.95,0,1.43-.52,19.5,0,217.94,299.87,379.69v0l0,0,.05,0,0,0,0,0v0C600,391.08,600.48,192.64,600,173.14c0-.48,0-.95,0-1.43C600,82.08,535.17,0,437.69,0,360.24,0,315.32,55.67,300,107.77");
    
    const length = path.getTotalLength();
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Math logic for spreading points along the path and creating depth
    for (let i = 0; i < particleCount; i++) {
      // Pick a random point along the path
      const pLength = Math.random() * length;
      const point = path.getPointAtLength(pLength);
      
      // Center the heart (SVG is 600x552)
      const x = point.x - 300;
      const y = -(point.y - 276); // Invert Y for 3D space
      
      // Add random spread and depth
      const spread = 30;
      const px = x + (Math.random() - 0.5) * spread;
      const py = y + (Math.random() - 0.5) * spread;
      const pz = (Math.random() - 0.5) * 150;
      
      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;
      
      // Pinkish/Redish colors matching the codepen fill
      colors[i * 3] = 0.93 + Math.random() * 0.07; // R
      colors[i * 3 + 1] = 0.32 + Math.random() * 0.1; // G
      colors[i * 3 + 2] = 0.51 + Math.random() * 0.1; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // GSAP Animation - Gentle heartbeat and rotation
    gsap.to(particles.rotation, {
      y: Math.PI * 2,
      duration: 15,
      ease: "none",
      repeat: -1
    });
    
    gsap.to(particles.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      gsap.killTweensOf(particles.rotation);
      gsap.killTweensOf(particles.scale);
      geometry.dispose();
      material.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-95 border border-white/20 shadow-xl group"
        aria-label="Close Animation"
      >
        <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>
      <div className="absolute bottom-12 text-white/50 text-sm tracking-widest uppercase font-light pointer-events-none">
        A Heart Just For You
      </div>
    </div>
  );
};

export default HeartAnimation;

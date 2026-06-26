import React, { useState } from 'react';
import { Gift, Sparkles, BookOpen } from 'lucide-react';
import YearButtons from '../components/YearButtons';
import TiltedCarousel from '../components/TiltedCarousel';
import ParallaxHeroCard from '../components/ParallaxHeroCard';
import WonderfulText from '../components/WonderfulText';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

const yearData: Record<number, { title: string; description: string; imageUrl?: string; imageUrls?: string[]; videoUrl?: string; linkUrl?: string; linkText?: string; pdfUrl?: string }> = {
  2022: { 
    title: "A Year of Beginnings", 
    description: "The very first creative wish with a mysterious QR code!", 
    imageUrl: "/assets/2022_wish.jpg" 
  },
  2023: { 
    title: "A Special Message", 
    description: "A beautiful memory captured in motion for 2023.", 
    videoUrl: "/assets/2023_video.mp4" 
  },
  2024: { 
    title: "A Journey Continues", 
    description: "Explore the special memories and wishes we've gathered for 2024.",
    linkUrl: "https://finalone-kappa.vercel.app",
    linkText: "Tap here: View 2024 Memories"
  },
  2025: { 
    title: "For You!", 
    description: "Happy Birthday to the most incredible person in my life! On this special day, I want to express just how much you mean to me.",
    linkUrl: "https://sahiti-ai.vercel.app/",
    linkText: "Experience Sahiti's Gift",
    imageUrl: "/assets/2025_wish.jpg"
  },
  2026: {
    title: "A Star Was Born",
    description: "The 2026 Birthday Edition featuring some very special celebrity appearances!",
    imageUrls: ["/assets/2026_virat.jpg", "/assets/2026_mahesh.jpg"],
    pdfUrl: "/assets/2026_magazine.pdf"
  }
};

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="min-h-screen font-sans selection:bg-pink-200 selection:text-pink-900 bg-gradient-to-br from-pink-100 via-white to-rose-100 text-pink-950 relative overflow-hidden">
      
      {/* Decorative Background Orbs for Glassmorphism depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-300/30 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-300/30 blur-3xl" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-fuchsia-300/20 blur-3xl" />

      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-md border-b border-white/60 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-xl shadow-md flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-pink-950">Sahiti's</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-pink-600">Birthday Edition</p>
          </div>
        </div>
        <div className="flex items-center">
          <button className="px-6 py-2 text-sm font-semibold text-white bg-pink-600 rounded-full shadow-lg hover:shadow-xl hover:bg-pink-500 hover:-translate-y-0.5 transition-all active:scale-95">
            Celebrate
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-24 relative z-10">
        
        {/* Hero Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ perspective: "1000px" }}>
          <ParallaxHeroCard>
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-md text-pink-800 text-sm font-semibold tracking-wider border border-white/60 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
                The Day The World Got Luckier
              </div>
              <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-900 via-rose-700 to-pink-900 leading-tight pb-2" style={{ transform: "translateZ(50px)" }}>
                Happy Birthday Sahiti
              </h2>
              <p className="text-lg md:text-xl text-pink-700 max-w-2xl mx-auto" style={{ transform: "translateZ(30px)" }}>
                Life, Love, Laughter & Memories. A journey that inspires everyone around you.
              </p>
            </div>
          </ParallaxHeroCard>
        </section>

        {/* Wish Collection Section */}
        <section className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-pink-900 mb-2">
              Your Memories
            </h3>
            <p className="text-pink-600">A journey through time</p>
          </div>
          <div className="-mt-8">
            <YearButtons onYearClick={handleYearClick} />
          </div>
        </section>

        {/* Magazine Preview Section */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-4 transition-transform duration-700 group-hover:scale-110">
            <BookOpen className="w-64 h-64 text-pink-500/10" />
          </div>
          <div className="max-w-2xl relative z-10">
            <h3 className="text-4xl font-bold text-pink-950 mb-4 tracking-tight">2026 Birthday Magazine</h3>
            <p className="text-lg text-pink-800 mb-8 leading-relaxed">Grab your limited edition copy of the magazine completely focused on you, featuring amazing moments and celebrity appearances!</p>
            <button 
              onClick={() => handleYearClick(2026)}
              className="px-8 py-3 text-lg font-semibold text-white bg-pink-600 rounded-full shadow-lg shadow-pink-600/30 hover:shadow-xl hover:shadow-pink-600/40 hover:-translate-y-0.5 hover:bg-pink-500 transition-all active:scale-95"
            >
              Read Now
            </button>
          </div>
        </section>

        {/* 3D Wonderful Text */}
        <section>
          <WonderfulText />
        </section>

        {/* Beautiful Memories Carousel */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-pink-900">
              Beautiful Moments
            </h3>
            <p className="text-pink-600">A collection of your best days</p>
          </div>
          <div className="-mt-4">
            <TiltedCarousel />
          </div>
        </section>

      </main>

      {/* Year Data Modal */}
      <Dialog open={selectedYear !== null} onOpenChange={(open) => !open && setSelectedYear(null)}>
        <DialogContent className="sm:max-w-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl p-0 gap-0 overflow-hidden rounded-3xl">
          <div className="bg-white/40 backdrop-blur-sm border-b border-white/50 p-6 flex justify-between items-center">
            <DialogTitle className="text-3xl font-bold tracking-tight text-pink-950">
              {selectedYear}
            </DialogTitle>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogDescription className="text-lg font-semibold text-pink-600">
                {selectedYear && yearData[selectedYear]?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-8 text-base text-pink-900 leading-relaxed">
              {selectedYear && yearData[selectedYear]?.imageUrl && (
                <div className="bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm">
                  <img 
                    src={yearData[selectedYear]!.imageUrl} 
                    onError={handleImageError}
                    alt={`Memory from ${selectedYear}`} 
                    className="w-full max-w-md mx-auto h-auto rounded-xl object-cover" 
                  />
                </div>
              )}
              {selectedYear && yearData[selectedYear]?.imageUrls && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {yearData[selectedYear]!.imageUrls!.map((url, idx) => (
                    <div key={idx} className="bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm">
                      <img 
                        src={url}
                        onError={handleImageError}
                        alt={`Memory ${idx + 1} from ${selectedYear}`} 
                        className="w-full h-auto rounded-xl object-cover" 
                      />
                    </div>
                  ))}
                </div>
              )}
              {selectedYear && yearData[selectedYear]?.videoUrl && (
                <div className="bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm">
                  <video 
                    src={yearData[selectedYear]!.videoUrl} 
                    controls 
                    autoPlay 
                    loop
                    muted
                    className="w-full max-w-md mx-auto h-auto rounded-xl" 
                  />
                </div>
              )}
              {selectedYear && yearData[selectedYear]?.pdfUrl && (
                <div className="w-full bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                  <iframe 
                    src={yearData[selectedYear]!.pdfUrl} 
                    className="w-full h-[500px] rounded-xl"
                    title="Birthday Magazine PDF"
                  />
                </div>
              )}
              
              <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-sm text-center">
                <p>{selectedYear && yearData[selectedYear]?.description}</p>
              </div>

              {selectedYear && yearData[selectedYear]?.linkUrl && (
                <div className="text-center pt-4">
                  <a 
                    href={yearData[selectedYear]!.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 text-base font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full shadow-sm hover:shadow transition-all"
                  >
                    {yearData[selectedYear]!.linkText || "View More"}
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

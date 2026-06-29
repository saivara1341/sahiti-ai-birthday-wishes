import React, { useState } from 'react';
import { CalendarDays, Heart, Sparkles, Image as ImageIcon, MessageSquare, Gift, CheckCircle2, Crown } from "lucide-react";
import HeartAnimation from "../components/HeartAnimation";
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

const yearData: Record<number, { title: string; description: string; imageUrl?: string; imageUrls?: string[]; videoUrl?: string; linkUrl?: string; linkText?: string; pdfUrl?: string; pdfUrls?: string[] }> = {
  2022: { 
    title: "A Year of Beginnings", 
    description: "The very first creative wish with a mysterious QR code!", 
    imageUrl: "/assets/img_7.jpeg" 
  },
  2023: { 
    title: "A Special Message", 
    description: "A beautiful memory captured in motion for 2023.", 
    videoUrl: "/assets/vid_1.mp4" 
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
    linkText: "Experience The Gift",
    imageUrl: "/assets/img_8.jpeg"
  },
  2026: {
    title: "A Star Was Born",
    description: "The 2026 Birthday Edition featuring some very special celebrity appearances!",
    pdfUrls: [
      "/assets/final.pdf#pageLayout=TwoColumnLeft&view=FitH"
    ]
  }
};

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const is2026Released = new Date() >= new Date('2026-06-30T14:00:00+05:30');

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="min-h-screen font-sans selection:bg-white/30 selection:text-white bg-transparent text-white relative overflow-hidden">
      
      {/* Decorative Background Orbs for Glassmorphism depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#E9944A]/20 blur-3xl" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-white/5 blur-3xl" />

      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 shadow-md flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight text-white drop-shadow-md">Sahiti's</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black drop-shadow-sm">Birthday Edition</p>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setIsCelebrating(true)}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Celebrate</span>
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 max-w-5xl mx-auto space-y-24 relative z-10">
        
        {/* Hero Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ perspective: "1000px" }}>
          <ParallaxHeroCard>
            <div className="space-y-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 inline-flex items-center px-5 py-2.5 bg-white/15 backdrop-blur-md text-[#800000] text-sm font-bold tracking-widest rounded-full shadow-sm">
                The Day The World Got Luckier
              </div>
              <h2 className="relative z-10 text-5xl md:text-8xl font-black tracking-tighter text-white leading-[1.1] pb-2 drop-shadow-lg" style={{ transform: "translateZ(50px)" }}>
                Happy Birthday <br />
                <span className="animate-color-cycle">Sahiti</span>
              </h2>
              <p className="relative z-10 text-lg md:text-2xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed" style={{ transform: "translateZ(30px)" }}>
                Life, Love, Laughter & Memories.<br />A journey that inspires everyone around you.
              </p>
            </div>
          </ParallaxHeroCard>
        </section>

        {/* Wish Collection Section */}
        <section className="space-y-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-2">
              Your Memories
            </h3>
            <p className="text-white/60">A journey through time</p>
          </div>
          <div className="-mt-8">
            <YearButtons onYearClick={handleYearClick} />
          </div>
        </section>

        {/* Magazine Preview Section */}
        <section className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 p-4 transition-transform duration-700 group-hover:scale-110">
            <Crown className="w-64 h-64 text-white/5 rotate-12" />
          </div>
          <div className="max-w-2xl relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">2026 Birthday Magazine</h3>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              {is2026Released 
                ? "Grab your limited edition copy of the magazine completely focused on you, featuring amazing moments and celebrity appearances!"
                : "Stay tuned for the 2026 Birthday Magazine releasing on June 30th at 2:00 PM!"}
            </p>
            <button 
              onClick={() => is2026Released && handleYearClick(2026)}
              className={`px-8 py-3 text-lg font-bold text-[#2A1C16] bg-white rounded-full shadow-lg shadow-black/10 transition-all uppercase tracking-widest ${is2026Released ? 'hover:shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
            >
              {is2026Released ? "Read Now" : "Stay Tuned"}
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
            <h3 className="text-3xl font-bold text-white">
              Beautiful Moments
            </h3>
            <p className="text-white/60">A collection of your best days</p>
          </div>
          <div className="-mt-4">
            <TiltedCarousel />
          </div>
        </section>

      </main>

      {/* Year Data Modal */}
      <Dialog open={selectedYear !== null} onOpenChange={(open) => !open && setSelectedYear(null)}>
        <DialogContent className="sm:max-w-2xl bg-[#2A1C16]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-0 gap-0 overflow-hidden rounded-[2.5rem]">
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-6 flex justify-between items-center">
            <DialogTitle className="text-3xl font-bold tracking-tight text-white">
              {selectedYear}
            </DialogTitle>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogDescription className="text-lg font-semibold text-white/80">
                {selectedYear && yearData[selectedYear]?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-8 text-base text-white/90 leading-relaxed">
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
                <div className="w-full bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-sm overflow-hidden mt-4">
                  <iframe 
                    src={yearData[selectedYear]!.pdfUrl} 
                    className="w-full h-[600px] rounded-2xl"
                    title="Birthday Magazine PDF"
                  />
                </div>
              )}
              {selectedYear && yearData[selectedYear]?.pdfUrls && (
                <div className="space-y-6 mt-4">
                  {yearData[selectedYear]!.pdfUrls!.map((pdf, idx) => (
                    <div key={idx} className="w-full bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-sm overflow-hidden">
                      <iframe 
                        src={pdf} 
                        className="w-full h-[600px] rounded-2xl"
                        title={`Birthday Magazine PDF Part ${idx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-sm text-center">
                <p>{selectedYear && yearData[selectedYear]?.description}</p>
              </div>

              {selectedYear && yearData[selectedYear]?.linkUrl && (
                <div className="text-center pt-4">
                  <a 
                    href={yearData[selectedYear]!.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 text-base font-bold text-[#2A1C16] bg-white rounded-full shadow-sm hover:shadow-lg transition-all"
                  >
                    {yearData[selectedYear]!.linkText || "View More"}
                  </a>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isCelebrating && <HeartAnimation onClose={() => setIsCelebrating(false)} />}
    </div>
  );
};

export default Index;

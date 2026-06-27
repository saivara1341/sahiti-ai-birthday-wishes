import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, ArrowLeft, Sun, Moon, Image, Paperclip, Sparkles } from 'lucide-react';
import gsap from 'gsap';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'image';
  imageUrl?: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

// Memoized message component for better performance
const MessageBubble = React.memo(({ message }: { message: Message }) => (
  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4 msg-bubble`}>
    <div
      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl shadow-lg ${
        message.isUser
          ? 'chat-bubble-user'
          : 'chat-bubble-ai'
      }`}
    >
      {message.type === 'image' && message.imageUrl && (
        <img
          src={message.imageUrl}
          alt="Generated or uploaded image"
          className="w-full rounded-lg mb-2"
          loading="lazy"
        />
      )}
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  </div>
));

// Memoized loading indicator
const LoadingIndicator = React.memo(() => (
  <div className="flex justify-start mb-4">
    <div className="chat-bubble-ai shadow-md">
      <div className="flex space-x-1 py-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
    </div>
  </div>
));

const ChatInterface = ({ onBack, isDark, onThemeToggle }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | '2026'>('chat');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (showApiInput) return; // Only run on main chat interface

    const ctx = gsap.context(() => {
      gsap.from(".card-container", { y: 60, opacity: 0, duration: 1.2, ease: "power4.out" });
      gsap.from(".bg-element", { scale: 0.5, opacity: 0, stagger: 0.1, duration: 1.5, ease: "back.out(1.7)" });
      
      // Floating animation for background elements
      gsap.to(".bg-element", { 
        y: "random(-30, 30)", 
        x: "random(-30, 30)", 
        rotation: "random(-25, 25)", 
        duration: "random(4, 8)", 
        repeat: -1, 
        yoyo: true, 
        ease: "sine.inOut",
        stagger: { amount: 2, from: "random" }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [showApiInput]);

  // Memoized API request function
  const makeGeminiRequest = useCallback(async (prompt: string, signal: AbortSignal) => {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, [apiKey]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !apiKey.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // GSAP animation for new message
    gsap.fromTo(".msg-bubble:last-child", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

    try {
      const data = await makeGeminiRequest(currentInput, abortControllerRef.current.signal);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.candidates[0].content.parts[0].text,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [inputValue, apiKey, isLoading, makeGeminiRequest]);

  const handleGenerateImage = useCallback(async () => {
    if (!imagePrompt.trim() || isImageGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Generate image: ${imagePrompt}`,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = imagePrompt;
    setImagePrompt('');
    setIsImageGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Generated image for: "${currentPrompt}"`,
        isUser: false,
        timestamp: new Date(),
        type: 'image',
        imageUrl: imageUrl,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while generating the image. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsImageGenerating(false);
    }
  }, [imagePrompt, isImageGenerating]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const userMessage: Message = {
          id: Date.now().toString(),
          content: 'Uploaded an image',
          isUser: true,
          timestamp: new Date(),
          type: 'image',
          imageUrl: imageUrl,
        };
        setMessages(prev => [...prev, userMessage]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'chat') {
        handleSendMessage();
      } else {
        handleGenerateImage();
      }
    }
  }, [activeTab, handleSendMessage, handleGenerateImage]);

  const handleTabChange = useCallback((tab: 'chat' | 'image' | '2026') => {
    setActiveTab(tab);
  }, []);

  const emptyStateMessage = useMemo(() => (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-gradient flex items-center justify-center shadow-lg shadow-white/10">
        <Sparkles className="w-10 h-10 text-[#2A1C16]" />
      </div>
      <h2 className="text-3xl font-bold mb-3 text-white">
        Hello! I'm Sahiti AI
      </h2>
      <p className="text-theme-muted mb-4 max-w-md mx-auto text-lg">
        {activeTab === 'chat' 
          ? 'Ask me anything and I\'ll help you with intelligent responses!'
          : 'Describe what you want to see and I\'ll generate an image for you!'
        }
      </p>
    </div>
  ), [activeTab]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (showApiInput) {
    return (
      <div className="fixed inset-0 bg-theme-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-accent-gradient rounded-full flex items-center justify-center shadow-lg shadow-white/10">
              <Sparkles className="w-10 h-10 text-[#2A1C16]" />
            </div>
            <h2 className="text-4xl font-black mb-4 text-gradient tracking-tight">
              Sahiti AI
            </h2>
            <p className="text-theme-muted text-lg">
              Please enter your Gemini API key to continue
            </p>
          </div>
          
          <div className="space-y-6">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-4 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-white/40 focus:ring-2 focus:ring-[#ff7b6b] focus:border-transparent transition-all outline-none"
            />
            
            <button
              onClick={() => apiKey.trim() && setShowApiInput(false)}
              disabled={!apiKey.trim()}
              className="w-full py-4 bg-accent-gradient text-[#2A1C16] font-bold rounded-full hover:shadow-lg hover:shadow-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-theme-bg flex items-center justify-center p-4 overflow-hidden font-inter">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Abstract Flowers & Butterflies */}
        {[...Array(6)].map((_, i) => (
          <div 
            key={`flower-${i}`} 
            className="bg-element absolute opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#accent-gradient)" strokeWidth="1.5">
              {i % 2 === 0 ? (
                // Butterfly-like shape
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              ) : (
                // Flower-like shape
                <path d="M12 2v20M17 5l-10 14M7 5l10 14M2 12h20" />
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* SVG Gradient Def */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7b6b" />
            <stop offset="100%" stopColor="#ffb86b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Chat Card */}
      <div className="card-container relative w-full max-w-4xl h-[90vh] bg-theme-card backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/80 group-hover:text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-gradient rounded-full flex items-center justify-center shadow-lg shadow-white/10">
                <Sparkles className="w-5 h-5 text-[#2A1C16]" />
              </div>
              <h1 className="text-2xl font-bold text-gradient tracking-tight">
                Sahiti AI
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-white/5 border border-white/5 rounded-xl p-1.5 backdrop-blur-md">
              <button
                onClick={() => handleTabChange('chat')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-accent-gradient text-black shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => handleTabChange('image')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'image'
                    ? 'bg-accent-gradient text-black shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Image
              </button>
              <button
                onClick={() => handleTabChange('2026')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === '2026'
                    ? 'bg-accent-gradient text-black shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                2026
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {activeTab === '2026' ? (
          <div className="flex-1 p-6 h-full rounded-b-3xl">
            <embed 
              src="/assets/doc_scanner.pdf" 
              type="application/pdf"
              className="w-full h-full rounded-2xl shadow-inner border border-white/10"
            />
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.length === 0 ? emptyStateMessage : (
                messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
              
              {(isLoading || isImageGenerating) && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md rounded-b-3xl">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative group">
                  <textarea
                    value={activeTab === 'chat' ? inputValue : imagePrompt}
                    onChange={(e) => activeTab === 'chat' ? setInputValue(e.target.value) : setImagePrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                      activeTab === 'chat' 
                        ? "Ask Sahiti AI anything..." 
                        : "Describe the image you want to generate..."
                    }
                    className="gemini-input pr-14 min-h-[64px] max-h-[160px] resize-none outline-none shadow-inner"
                    rows={1}
                  />
                  
                  {activeTab === 'chat' && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white/40 hover:text-white transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <button
                  onClick={activeTab === 'chat' ? handleSendMessage : handleGenerateImage}
                  disabled={
                    (activeTab === 'chat' && (!inputValue.trim() || isLoading)) ||
                    (activeTab === 'image' && (!imagePrompt.trim() || isImageGenerating))
                  }
                  className="gemini-button p-4 h-[64px] w-[64px] flex items-center justify-center shadow-lg shadow-white/10 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {activeTab === 'chat' ? <Send className="w-6 h-6" /> : <Image className="w-6 h-6" />}
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChatInterface);

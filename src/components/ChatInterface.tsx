
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, ArrowLeft, Sun, Moon, Image, Paperclip, Sparkles } from 'lucide-react';

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
  <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl ${
        message.isUser
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
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
  <div className="flex justify-start">
    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl">
      <div className="flex space-x-1">
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
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

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
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled, don't show error
      }
      
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
      // Using a more realistic placeholder that simulates loading time
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

  const handleTabChange = useCallback((tab: 'chat' | 'image') => {
    setActiveTab(tab);
  }, []);

  // Memoize the empty state message
  const emptyStateMessage = useMemo(() => (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Hello! I'm Sahiti AI
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {activeTab === 'chat' 
          ? 'Ask me anything and I\'ll help you with intelligent responses!'
          : 'Describe what you want to see and I\'ll generate an image for you!'
        }
      </p>
    </div>
  ), [activeTab]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (showApiInput) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sahiti AI Setup
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please enter your Gemini API key to continue
            </p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            <button
              onClick={() => apiKey.trim() && setShowApiInput(false)}
              disabled={!apiKey.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sahiti AI
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleTabChange('chat')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => handleTabChange('image')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'image'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Image
            </button>
          </div>
          
          <button
            onClick={onThemeToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? emptyStateMessage : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {(isLoading || isImageGenerating) && <LoadingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={activeTab === 'chat' ? inputValue : imagePrompt}
              onChange={(e) => activeTab === 'chat' ? setInputValue(e.target.value) : setImagePrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                activeTab === 'chat' 
                  ? "Ask Sahiti AI anything..." 
                  : "Describe the image you want to generate..."
              }
              className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            
            {activeTab === 'chat' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-14 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
            className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === 'chat' ? <Send className="w-5 h-5" /> : <Image className="w-5 h-5" />}
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
    </div>
  );
};

export default React.memo(ChatInterface);

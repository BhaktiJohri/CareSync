
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Medication, VitalRecord } from '../types';
import { chatWithAssistant } from '../services/geminiService';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

interface ChatAssistantProps {
  medications: Medication[];
  vitals?: VitalRecord[];
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ medications, vitals = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi there! I can help you understand your meds or check your schedule. What do you need?',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAssistant(userMsg.text, medications, vitals, history);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm having trouble thinking right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I couldn't connect to the server. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
        }`}
      >
        {isOpen ? <X className="text-white w-7 h-7" /> : <MessageCircle className="text-white w-7 h-7" />}
      </button>

      {/* Glassmorphic Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl flex flex-col z-50 border border-white/20 overflow-hidden animate-slide-up ring-1 ring-slate-900/5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex items-center gap-4">
            <div className="relative">
               <div className="bg-gradient-to-tr from-teal-400 to-emerald-400 p-2 rounded-xl">
                 <Bot className="text-white w-6 h-6" />
               </div>
               <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Care Assistant</h3>
              <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-400" />
                Powered by Gemini
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex gap-2 items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your meds..."
                className="flex-1 bg-slate-100 border-0 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-4 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
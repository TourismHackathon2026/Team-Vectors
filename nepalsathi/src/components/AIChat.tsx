import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Bot, User,
  RotateCcw, Mic,
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { getAIResponse, suggestedPrompts } from '../data/ai-responses';
import { generateId } from '../utils/helpers';
import type { ChatMessage } from '../types';

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { id: generateId(), role, content, timestamp: new Date().toISOString() }]);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addMessage('user', text.trim());
    setInput('');
    setTyping(true);
    setTimeout(() => {
      addMessage('assistant', getAIResponse(text.trim()));
      setTyping(false);
    }, 1200);
  };

  const newChat = () => {
    setMessages([]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105',
          open ? 'hidden' : 'bg-primary text-white',
        )}
        aria-label="Open AI assistant"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-card rounded-xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Nepali Sathi AI</p>
                  <p className="text-xs text-white/70">Your local guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={newChat}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="New chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-bg">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <Bot className="w-10 h-10 text-text-secondary mx-auto mb-3" />
                  <p className="text-sm font-medium text-text-primary mb-1">
                    How can I help you explore Nepal?
                  </p>
                  <p className="text-xs text-text-secondary">
                    Ask me about heritage sites, food, itineraries, or hidden gems.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2.5 max-w-[85%]',
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
                  )}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white',
                  )}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={cn(
                    'text-sm p-3 rounded-xl whitespace-pre-line',
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-card border border-border text-text-primary rounded-tl-sm',
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-card border border-border text-text-primary text-sm p-3 rounded-xl rounded-tl-sm">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-2 border-t border-border bg-card">
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {suggestedPrompts.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-text-secondary hover:bg-primary-50 hover:text-primary transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-bg text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className="p-2 rounded-lg bg-primary text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
                  aria-label="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

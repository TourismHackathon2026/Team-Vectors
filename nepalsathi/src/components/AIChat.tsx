import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquareText, X, Send, Bot, User,
  RotateCcw, Sparkles, Landmark, MapPin, Mountain,
  UtensilsCrossed, PartyPopper, Route, Camera, BadgeCheck,
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { aiService, type AIChatMessage } from '../services/aiService';
import { generateId } from '../utils/helpers';
import type { ChatMessage } from '../types';

const quickActions = [
  { icon: Landmark, label: 'Explore Heritage Sites', query: 'Tell me about the UNESCO heritage sites in Kathmandu Valley' },
  { icon: MapPin, label: 'Nearby Attractions', query: 'What are the best nearby attractions in Kathmandu?' },
  { icon: Mountain, label: 'Trekking Routes', query: 'What are the best trekking routes in Nepal?' },
  { icon: UtensilsCrossed, label: 'Nepali Food', query: 'What authentic Nepali foods should I try?' },
  { icon: PartyPopper, label: 'Festivals', query: 'Tell me about major Nepali festivals' },
  { icon: Route, label: 'Plan My Trip', query: 'Plan a 3-day itinerary for Kathmandu Valley' },
  { icon: Camera, label: 'How QR Stamps Work', query: 'How do QR code stamps and the Heritage Passport work?' },
  { icon: BadgeCheck, label: 'My Heritage Passport', query: 'What is the Heritage Passport and how do I earn rewards?' },
];

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { id: generateId(), role, content, timestamp: new Date().toISOString() }]);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setOpen(true);
      if (detail?.site) {
        setShowActions(false);
        addMessage('user', `Tell me more about ${detail.site}`);
        setTyping(true);
        aiService.sendMessage([{ role: 'user', content: `Tell me more about ${detail.site}` }]).then((res) => {
          addMessage('assistant', res);
          setTyping(false);
        });
      }
    };
    window.addEventListener('opencode-ai-chat', handler);
    return () => window.removeEventListener('opencode-ai-chat', handler);
  }, [addMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setShowActions(false);
    addMessage('user', text.trim());
    setInput('');
    setTyping(true);

    const history: AIChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    history.push({ role: 'user', content: text.trim() });

    const response = await aiService.sendMessage(history);
    addMessage('assistant', response);
    setTyping(false);
  }, [messages, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const newChat = () => {
    setMessages([]);
    setShowActions(true);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full',
          'bg-gradient-to-br from-[#DC143C] to-[#b01030]',
          'text-white shadow-xl flex items-center justify-center',
          'transition-all duration-300 hover:scale-110 hover:shadow-2xl',
          'active:scale-95',
        )}
        aria-label="Open Nepali Sathi AI"
      >
        <MessageSquareText className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#003893] rounded-full flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn(
          'fixed bottom-5 left-5 z-50',
          'w-[380px] max-w-[calc(100vw-2rem)]',
          'bg-white dark:bg-gray-900',
          'rounded-2xl border border-gray-200 dark:border-gray-700',
          'shadow-2xl overflow-hidden',
          'backdrop-blur-xl bg-white/95 dark:bg-gray-900/95',
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#DC143C] to-[#b01030] text-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Nepali Sathi AI 🇳🇵</h2>
                <p className="text-[11px] text-white/75">Your Smart Nepal Tourism Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={newChat}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="New chat"
                title="New chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[420px] overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50 dark:bg-gray-800/30">
          {showActions && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-2"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#DC143C]/10 to-[#003893]/10 flex items-center justify-center mx-auto mb-3">
                <Bot className="w-7 h-7 text-[#DC143C]" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Namaste! 🙏 How can I help?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Ask me about Nepal's heritage, food, trekking, or festivals
              </p>

              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.query)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 text-xs rounded-xl text-left',
                      'border border-gray-200 dark:border-gray-700',
                      'bg-white dark:bg-gray-800',
                      'text-gray-700 dark:text-gray-300',
                      'hover:border-[#DC143C]/30 hover:bg-[#DC143C]/5',
                      'transition-all duration-200',
                    )}
                  >
                    <action.icon className="w-3.5 h-3.5 shrink-0 text-[#DC143C]" />
                    <span className="leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {quickActions.slice(4, 8).map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.query)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 text-xs rounded-xl text-left',
                      'border border-gray-200 dark:border-gray-700',
                      'bg-white dark:bg-gray-800',
                      'text-gray-700 dark:text-gray-300',
                      'hover:border-[#003893]/30 hover:bg-[#003893]/5',
                      'transition-all duration-200',
                    )}
                  >
                    <action.icon className="w-3.5 h-3.5 shrink-0 text-[#003893]" />
                    <span className="leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.length > 0 && showActions && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickActions.slice(0, 4).map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.query)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#DC143C]/30 hover:text-[#DC143C] transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex gap-2.5 max-w-[88%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#003893] to-[#002a6e] text-white'
                  : 'bg-gradient-to-br from-[#DC143C] to-[#b01030] text-white',
              )}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={cn(
                'text-sm p-3.5 rounded-2xl leading-relaxed whitespace-pre-line',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#003893] to-[#002a6e] text-white rounded-tr-md'
                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-md shadow-sm',
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 max-w-[88%]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#DC143C] to-[#b01030] text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs p-3.5 rounded-2xl rounded-tl-md shadow-sm">
                <div className="flex items-center gap-2">
                  <span>Nepali Sathi AI is thinking</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#DC143C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#DC143C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#DC143C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about Nepal..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'w-full px-4 py-2.5 text-sm rounded-xl',
                  'border border-gray-200 dark:border-gray-700',
                  'bg-gray-50 dark:bg-gray-800',
                  'text-gray-800 dark:text-gray-200',
                  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                  'focus:outline-none focus:ring-2 focus:ring-[#DC143C]/30 focus:border-[#DC143C]',
                  'transition-all duration-200',
                )}
              />
            </div>
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className={cn(
                'p-2.5 rounded-xl',
                'bg-gradient-to-br from-[#DC143C] to-[#b01030]',
                'text-white shadow-sm',
                'hover:shadow-md hover:from-[#e01840] hover:to-[#c01035]',
                'transition-all duration-200',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 text-center">
            Powered by Heritage Quest Nepal • Nepali Sathi AI
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  ChevronDown,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenBookDemo: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  isOpen,
  onToggle,
  onOpenBookDemo,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      text: 'Hello! I am your 24/7 Alpha III MedSphere Healthcare Assistant. How can I assist your hospital or clinic today?',
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'How fast can we deploy?', action: 'How fast can we deploy?' },
        { label: 'Legacy EMR migration', action: 'Legacy EMR migration' },
        { label: 'HMO claim submission', action: 'HMO claim submission' },
        { label: 'Admin MFA setup', action: 'Admin MFA setup' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI Healthcare Intelligence Router
    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('deploy') || lower.includes('time') || lower.includes('speed') || lower.includes('go live')) {
        botResponse =
          'Most hospitals go live within 3 to 7 days after payment validation. Self-serve CSV imports run immediately, and our managed migration engineering team handles complex multi-year database cutovers during weekend maintenance windows with zero clinical downtime.';
      } else if (lower.includes('migrate') || lower.includes('legacy') || lower.includes('openmrs') || lower.includes('csv') || lower.includes('excel')) {
        botResponse =
          'Yes, Alpha III MedSphere provides automated ETL pipelines for legacy MySQL, SQL Server, Microsoft Access, OpenMRS, and custom files. We sanitize, deduplicate, and convert historical notes into FHIR/HL7 standards seamlessly.';
      } else if (lower.includes('hmo') || lower.includes('claim') || lower.includes('nhia') || lower.includes('insurance')) {
        botResponse =
          'We support 45+ HMO adapter integrations. You can verify member policies in sub-second intervals, trigger automated pre-authorization requests, and generate 1-click batch submissions for private HMOs and NHIA with complete remittance reconciliation.';
      } else if (lower.includes('mfa') || lower.includes('security') || lower.includes('totp') || lower.includes('2fa')) {
        botResponse =
          'Hospital administrator and medical records accounts are strictly protected by TOTP Multi-Factor Authentication (MFA). Medical records are encrypted with AES-256 at rest and TLS 1.3 in transit under strict NDPA 2023 guidelines.';
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('seat') || lower.includes('naira') || lower.includes('plan')) {
        botResponse =
          'Our plans start at ₦20,000/mo (Essential: 20 seats), ₦35,000/mo (Professional: 35 seats), and ₦60,000/mo (Enterprise: 60 seats). Annual plans include 2 months free. Patients, visits, and mobile app users are 100% unlimited with zero per-patient fees.';
      } else if (lower.includes('ticket') || lower.includes('agent') || lower.includes('support') || lower.includes('email') || lower.includes('contact')) {
        const ticketId = `MED-TCK-${Math.floor(10000 + Math.random() * 90000)}`;
        setTicketCreated(ticketId);
        botResponse = `A priority support ticket (${ticketId}) has been generated and dispatched to our engineering desk (alphaiiicorporations@gmail.com). A technical lead will follow up with you promptly.`;
      } else {
        botResponse =
          'Thank you for reaching out. MedSphere provides end-to-end hospital management, EMR, lab, pharmacy, and HMO claims automation with edge caching. Would you like to schedule a personalized walkthrough or test our live clinical sandbox?';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Create Support Ticket', action: 'Create a priority support ticket for my hospital' },
          { label: 'Schedule Demo Walkthrough', action: 'I want to book a live demo walkthrough' },
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="p-4 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer group"
          aria-label="Open AI Healthcare Assistant"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold hidden sm:inline pr-1">24/7 AI Healthcare Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white rounded-3xl w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">MedSphere AI Support</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">24/7 Clinical & Deployment Desk</p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ticket Confirmation Banner */}
          {ticketCreated && (
            <div className="bg-blue-50 dark:bg-blue-950/90 border-b border-blue-200 dark:border-blue-800 px-4 py-2 text-[11px] text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Ticket Reference: <strong className="font-mono">{ticketCreated}</strong></span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-[#0B1120]/90 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      isAssistant
                        ? 'bg-white dark:bg-[#020617] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs'
                        : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">{msg.timestamp}</span>

                  {/* Suggested Action Chips */}
                  {msg.suggestedActions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.suggestedActions.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (chip.action.includes('demo')) {
                              onOpenBookDemo();
                            } else {
                              handleSendMessage(chip.action);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 text-[11px] font-medium transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#020617] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 w-20 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-200"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-50 dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about HMO, pricing, MFA, or go-live..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

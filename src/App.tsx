/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  MessageSquare, 
  Settings, 
  Shield, 
  History, 
  ChevronRight,
  Send,
  Loader2,
  AlertCircle,
  ExternalLink,
  Layers,
  Gamepad2,
  Rocket,
  Search,
  LayoutGrid,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface LabModule {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  status: 'active' | 'beta' | 'planned';
  type: 'app' | 'tool' | 'game';
  url?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// --- Initialize Gemini ---
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'terminal'>('hub');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // AI Module State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'VP_LAB_CORE v4.0.2 INITIALIZED. Waiting for instructions...',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lab Modules (The Doors)
  const modules: LabModule[] = [
    {
      id: 'remote-true-value',
      name: 'Remote True Value',
      description: 'The definitive value assessment tool when it comes to comparing remote work VS commute. The bigger picture at hand',
      icon: Layers,
      color: 'cyan',
      status: 'active',
      type: 'app',
      url: 'https://vibepool-lab.github.io/Remote-True-Value/' 
    },
    {
      id: 'placeholder-1',
      name: 'Module_02',
      description: 'Experimental slot reserved for the next VibePool micro-SaaS deployment.',
      icon: Rocket,
      color: 'blue',
      status: 'planned',
      type: 'app'
    },
    {
      id: 'placeholder-2',
      name: 'Module_03',
      description: 'Reserved for upcoming mini-game or physics-based experiment.',
      icon: Gamepad2,
      color: 'emerald',
      status: 'planned',
      type: 'game'
    },
    {
      id: 'placeholder-3',
      name: 'Module_04',
      description: 'Internal utility slot for lab data and cryptographic tools.',
      icon: Settings,
      color: 'amber',
      status: 'planned',
      type: 'tool'
    }
  ];

  const [showLegal, setShowLegal] = useState<'privacy' | 'terms' | null>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: input }] }
        ].slice(-10),
        config: {
          systemInstruction: "You are the VibePool Lab Hub Assistant. You help the user navigate their lab projects and manage their micro-SaaS and games."
        }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || 'Error: Response failed.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'AI service interruption.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Top Console Bar */}
      <header className="border-b border-slate-900 bg-[#0A0C14]/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-600/20 border border-cyan-500/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            </div>
            <span className="text-xs font-black tracking-[0.2em] text-white uppercase">VibePool Lab</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <nav className="flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('hub')}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'hub' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
            >
              Control_Room
            </button>
            <button 
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'terminal' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
            >
              Neural_Link
            </button>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Activity size={12} className="text-emerald-500" />
            <span>SYNC_HEALTH: 99.8%</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Cpu size={12} className="text-cyan-500" />
            <span>INSTANCES: 04</span>
          </div>
          <div className="flex items-center gap-3">
            <Settings size={14} className="text-slate-600 hover:text-white cursor-pointer transition-colors" />
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Shield size={12} className="text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Hub Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} border-r border-slate-900 bg-[#080A12]/50 transition-all duration-300 overflow-hidden hidden lg:flex flex-col`}>
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[.2em] text-slate-600 mb-4 px-2">Lab Telemetry</h3>
              <div className="space-y-3">
                {[
                  { label: "Uptime", val: "12d 4h 22m", color: "text-emerald-400" },
                  { label: "Request Load", val: "Low", color: "text-cyan-400" },
                  { label: "Security Path", val: "Encrypted", color: "text-blue-400" }
                ].map((s, i) => (
                  <div key={i} className="px-3 py-2 rounded bg-slate-900/40 border border-slate-800/50 flex justify-between items-center group cursor-default">
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors uppercase font-mono">{s.label}</span>
                    <span className={`text-[10px] font-mono ${s.color} font-bold`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[.2em] text-slate-600 mb-4 px-2">Recent Logs</h3>
              <div className="space-y-2">
                {[
                  "Hub connected to main-loop",
                  "Remote True Value synced",
                  "AI core handshake complete",
                  "New module 'Game Alpha' queued"
                ].map((log, i) => (
                  <div key={i} className="text-[9px] font-mono text-slate-500 flex gap-2 leading-relaxed">
                    <span className="text-cyan-500/50">[{new Date().getHours()}:{i*2}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 relative overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/20 via-transparent to-transparent">
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 p-6 lg:p-12 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'hub' ? (
                <motion.div
                  key="hub"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <header>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[.3em]">Command Center</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-white mb-4">
                       Welcome to <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">VibePool Lab</span>.
                    </h1>
                    <p className="text-slate-500 max-w-2xl leading-relaxed">
                      Select a module to interface with your current projects. Every door is a step toward the next micro-SaaS or game experiment.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {modules.map((module) => (
                      <motion.div
                        key={module.id}
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="group relative p-8 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer overflow-hidden flex flex-col h-full"
                        onClick={() => {
                          if (module.id === 'gemini-core') setActiveTab('terminal');
                          else if (module.url) window.open(module.url, '_blank');
                        }}
                      >
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                           <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-colors ${
                              module.status === 'active' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                              module.status === 'beta' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                              'text-slate-500 border-slate-800 bg-slate-800/20'
                           }`}>
                             {module.status}
                           </div>
                        </div>

                        {/* Icon Background Glow */}
                        <div className={`absolute -top-10 -left-10 w-32 h-32 blur-[40px] opacity-10 rounded-full transition-opacity group-hover:opacity-20 ${
                          module.color === 'cyan' ? 'bg-cyan-500' :
                          module.color === 'amber' ? 'bg-amber-500' :
                          module.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                        }`} />

                        <div className="flex items-center gap-6 mb-8">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all relative ${
                            module.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.1)]' :
                            module.color === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.1)]' :
                            module.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          }`}>
                            <module.icon size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{module.name}</h3>
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{module.type} // path_{module.id.split('-')[0]}</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors mb-8 flex-1">
                          {module.description}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-800/40 mt-auto">
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest group-hover:text-slate-400 transition-colors">Interface Module</span>
                          <div className="w-8 h-8 rounded border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:border-white transition-all">
                             {module.type === 'app' ? <ExternalLink size={14} /> : <ChevronRight size={14} />}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Module Placeholder */}
                    <div className="group border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-slate-600 transition-all cursor-pointer min-h-[200px]">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-slate-300 group-hover:scale-110 transition-all">
                        <Plus size={20} />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Register Module</div>
                        <div className="text-[10px] text-slate-600 font-mono mt-1">Ready for deployment...</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="terminal"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="h-full flex flex-col max-w-4xl mx-auto"
                >
                   <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-t-2xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-md">
                      <div className="px-6 py-4 border-b border-slate-900 flex items-center justify-between bg-slate-900/60">
                         <div className="flex items-center gap-3">
                            <Zap size={16} className="text-amber-500" />
                            <h2 className="text-xs font-black uppercase tracking-[.2em] text-white">Neural Interface</h2>
                         </div>
                         <div className="flex gap-2 text-[10px] font-mono text-slate-500 uppercase">
                            <span>Ready</span>
                            <span className="text-emerald-500">Live</span>
                         </div>
                      </div>

                      <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800"
                      >
                         {messages.map((msg, i) => (
                           <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-900/20 border border-slate-800/50'} p-4 rounded-xl`}>
                                <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                  {msg.role === 'user' ? 'Operator' : 'AI_Core'}
                                  <span className="opacity-50 text-[8px] font-normal">{msg.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-mono">
                                  {msg.content}
                                </div>
                              </div>
                           </div>
                         ))}
                         {isTyping && (
                           <div className="flex justify-start">
                              <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/40 border border-slate-800/40 rounded-full">
                                 <Loader2 size={12} className="text-cyan-500 animate-spin" />
                                 <span className="text-[10px] text-cyan-400 animate-pulse tracking-widest uppercase font-bold">Thinking...</span>
                              </div>
                           </div>
                         )}
                         {error && (
                           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500">
                              <AlertCircle size={16} className="shrink-0 mt-0.5" />
                              <span className="text-xs font-mono">{error}</span>
                           </div>
                         )}
                      </div>

                      <div className="p-4 bg-slate-900/50 border-t border-slate-900">
                         <div className="relative group">
                            <textarea
                              rows={1}
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                              placeholder="Enter lab command..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-mono focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none outline-none pr-12"
                            />
                            <button 
                              onClick={handleSendMessage}
                              disabled={!input.trim() || isTyping}
                              className="absolute right-2 top-2 p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 transition-all text-black"
                            >
                              <Send size={18} />
                            </button>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Legal Modals */}
      <AnimatePresence>
        {showLegal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setShowLegal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0A0C14] border border-slate-800 p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                    {showLegal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                 </h2>
                 <button onClick={() => setShowLegal(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                    <X size={20} />
                 </button>
              </div>
              <div className="prose prose-invert text-slate-400 text-sm leading-relaxed space-y-4">
                 {showLegal === 'privacy' ? (
                   <>
                     <p>VibePool Lab ("we", "us", "our") operates this hub. This policy describes how we collect and use your data.</p>
                     <p><strong>1. Data Collection:</strong> We use Google Analytics 4 (GA4) to track site usage patterns. This helps us understand which features are most useful. No personally identifiable information is stored by us directly.</p>
                     <p><strong>2. Advertising:</strong> We use Google AdSense to serve advertisements. AdSense uses cookies to serve ads based on your visit to this and other sites.</p>
                     <p><strong>3. Security:</strong> We implement standard security protocols to protect our platform integrity.</p>
                   </>
                 ) : (
                   <>
                     <p>By using VibePool Lab, you agree to these terms.</p>
                     <p><strong>1. Use of Service:</strong> This platform is provided for informational and experimental purposes. All tools are provided "as-is" without warranty.</p>
                     <p><strong>2. Third-Party Links:</strong> Our platform contains links to external sites (e.g., Remote True Value). We are not responsible for the content or privacy practices of these third-party platforms.</p>
                     <p><strong>3. Intellectual Property:</strong> All designs and code within the VibePool Lab ecosystem are protected by copyright laws.</p>
                   </>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lab Rail Status */}
      <footer className="h-8 border-t border-slate-950 bg-[#06080D] flex items-center justify-between px-6 text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em] font-bold z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>Systems_Nominal</span>
          </div>
          <div className="hidden sm:block">Env: production_v4</div>
          <div className="flex items-center gap-3 ml-4">
            <button onClick={() => setShowLegal('privacy')} className="hover:text-slate-400">Privacy_Policy</button>
            <div className="w-px h-2 bg-slate-800" />
            <button onClick={() => setShowLegal('terms')} className="hover:text-slate-400">Terms_Of_Service</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-2 py-0.5 border border-slate-800 rounded leading-none">Lat: 24ms</div>
          <span>{new Date().toISOString().split('T')[1].split('.')[0]} ISO</span>
        </div>
      </footer>
    </div>
  );
}


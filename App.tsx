
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  AppState, 
  HardwareTier, 
  HardwareSpecs, 
  PasswordAnalysis, 
  CrackingStep,
  DeviceDatabase,
  DeviceSpec
} from './types';
import { analyzePasswordWithAI, getSecurityMetrics } from './services/geminiService';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Terminal as TerminalIcon, 
  Zap, 
  Lock, 
  Unlock, 
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
  BarChart3,
  Server,
  Search,
  Laptop,
  Smartphone,
  HardDrive
} from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hardware, setHardware] = useState<HardwareTier>(HardwareTier.DESKTOP);
  const [customDevice, setCustomDevice] = useState<DeviceSpec | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [steps, setSteps] = useState<CrackingStep[]>([]);
  const [aiAdvice, setAiAdvice] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartCracking = async () => {
    if (!password) return;
    
    setAppState(AppState.CRACKING);
    setTerminalLogs([]);
    const currentHps = customDevice ? customDevice.hashesPerSecond : HardwareSpecs[hardware].hashesPerSecond;
    const currentName = customDevice ? customDevice.name : hardware;

    addLog(`Initializing attack vector: BRUTE_FORCE_PARALLEL`);
    addLog(`Target entropy: ${getSecurityMetrics(password, currentHps).entropy.toFixed(2)} bits`);
    addLog(`Allocating hardware resources: ${currentName}...`);

    const initialSteps: CrackingStep[] = [
      { id: '1', type: 'dictionary', progress: 0, status: 'active', currentAttempt: 'Searching lists...' },
      { id: '2', type: 'hybrid', progress: 0, status: 'pending', currentAttempt: 'Queued' },
      { id: '3', type: 'brute-force', progress: 0, status: 'pending', currentAttempt: 'Queued' },
    ];
    setSteps(initialSteps);

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setSteps(prev => {
        const next = [...prev];
        const step = next[currentStepIdx];
        if (step.progress < 100) {
          step.progress += Math.random() * 15;
          if (step.progress >= 100) {
            step.progress = 100;
            step.status = 'success';
            addLog(`Phase ${step.type.toUpperCase()} completed.`);
            if (currentStepIdx < next.length - 1) {
              currentStepIdx++;
              next[currentStepIdx].status = 'active';
            } else {
              clearInterval(interval);
              setAppState(AppState.FINISHED);
              addLog(`CRACK SUCCESSFUL. ACCESS GRANTED.`);
            }
          }
        }
        return next;
      });
    }, 150);

    try {
      const advice = await analyzePasswordWithAI(password);
      setAiAdvice(advice);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0.01) return "~ Instantly";
    if (seconds < 1) return "< 1 second";
    if (seconds < 60) return `${Math.floor(seconds)} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.floor(seconds / 31536000)} years`;
    if (seconds < 31536000000000) return `${Math.floor(seconds / 31536000000)} millennia`;
    return "Eternity";
  };

  const filteredDevices = useMemo(() => {
    if (!searchQuery) return DeviceDatabase;
    return DeviceDatabase.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const activeHps = customDevice ? customDevice.hashesPerSecond : HardwareSpecs[hardware].hashesPerSecond;
  const currentMetrics = getSecurityMetrics(password || ' ', activeHps);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mobile': return <Smartphone className="w-3 h-3" />;
      case 'Laptop': return <Laptop className="w-3 h-3" />;
      case 'Desktop': return <Cpu className="w-3 h-3" />;
      case 'GPU': return <Activity className="w-3 h-3" />;
      case 'Server': return <Server className="w-3 h-3" />;
      default: return <HardDrive className="w-3 h-3" />;
    }
  };

  const formatHps = (hps: number) => {
    if (hps >= 1_000_000_000_000_000) return `${(hps / 1_000_000_000_000_000).toFixed(1)} PH/s`;
    if (hps >= 1_000_000_000_000) return `${(hps / 1_000_000_000_000).toFixed(1)} TH/s`;
    if (hps >= 1_000_000_000) return `${(hps / 1_000_000_000).toFixed(1)} GH/s`;
    if (hps >= 1_000_000) return `${(hps / 1_000_000).toFixed(1)} MH/s`;
    return `${hps} H/s`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black overflow-x-hidden pb-20">
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <header className="border-b border-[#00FF41]/30 p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-widest uppercase">CipherShield // Labs</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm opacity-70">
          <Activity className="w-4 h-4" />
          <span>SYSTEM_STATUS: SECURE</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input & Device Search */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-black/40 border border-[#00FF41]/20 rounded-xl p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,65,0.05)]">
            <h2 className="text-lg mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> INPUT_TARGET_KEY
            </h2>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-black border border-[#00FF41]/50 rounded-lg py-4 px-4 text-[#00F3FF] focus:outline-none focus:ring-2 focus:ring-[#00FF41] text-xl transition-all font-mono"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00FF41]/50 hover:text-[#00FF41]"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {/* Device Search Bar */}
              <div ref={searchRef} className="relative">
                <label className="text-[10px] uppercase text-[#00FF41]/60 mb-2 block tracking-widest font-bold">Search for your Device</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00FF41]/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    placeholder="Find laptop, GPU, phone..."
                    className="w-full bg-black/60 border border-[#00FF41]/20 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#00FF41] transition-all"
                  />
                </div>
                
                {isSearchOpen && filteredDevices.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#00FF41]/30 rounded-lg shadow-2xl max-h-64 overflow-y-auto z-[60] scrollbar-hide">
                    {filteredDevices.map((device, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCustomDevice(device);
                          setHardware(HardwareTier.CUSTOM);
                          setSearchQuery(device.name);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex justify-between items-center p-3 hover:bg-[#00FF41]/10 border-b border-[#00FF41]/10 last:border-0 transition-colors"
                      >
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-bold text-[#00F3FF]">{device.name}</span>
                          <span className="text-[10px] opacity-40 flex items-center gap-1">
                            {getCategoryIcon(device.category)} {device.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#00FF41]">{formatHps(device.hashesPerSecond)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#00FF41]/60 mb-2 block tracking-widest font-bold">Quick-Select Tiers</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(HardwareSpecs).filter(([key]) => key !== HardwareTier.CUSTOM).map(([key, spec]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setHardware(key as HardwareTier);
                        setCustomDevice(null);
                        setSearchQuery('');
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all h-20 text-center ${
                        hardware === key && !customDevice
                          ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]' 
                          : 'bg-black/40 border-[#00FF41]/20 text-[#00FF41]/40 hover:border-[#00FF41]/50'
                      }`}
                    >
                      <Cpu className="w-4 h-4 mb-1" />
                      <span className="text-[9px] uppercase font-bold truncate w-full">{key}</span>
                      <span className="text-[8px] opacity-70">{spec.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              disabled={!password || appState === AppState.CRACKING}
              onClick={handleStartCracking}
              className="w-full mt-8 py-4 bg-[#00FF41] text-black font-bold uppercase rounded-lg hover:bg-[#00F3FF] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current" /> RUN_SIMULATION
            </button>
          </section>

          <section className="bg-black/40 border border-[#00FF41]/20 rounded-xl p-6">
            <h2 className="text-sm mb-4 flex items-center gap-2 opacity-60">
              <TerminalIcon className="w-4 h-4" /> TRACE_OUTPUT
            </h2>
            <div className="bg-black p-4 rounded-lg h-48 overflow-y-auto text-[10px] space-y-1 border border-[#00FF41]/10 scrollbar-hide">
              {terminalLogs.length === 0 && <span className="opacity-30 italic">No active processes...</span>}
              {terminalLogs.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-left-2 duration-300">
                  <span className="text-[#00F3FF] mr-2">#</span>
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </section>
        </div>

        {/* Center/Right Column: Benchmarks & Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-black/40 border border-[#00FF41]/20 rounded-xl p-6">
            <h2 className="text-lg mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> BENCHMARK_COMPARISON
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#00FF41]/20 text-[10px] uppercase opacity-50">
                    <th className="py-3 px-4 font-normal">Hardware Level</th>
                    <th className="py-3 px-4 font-normal">Throughput</th>
                    <th className="py-3 px-4 font-normal text-right">Crack Estimate</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {/* Show Custom selection if active */}
                  {customDevice && (
                    <tr className="bg-[#00F3FF]/10 border-b border-[#00F3FF]/30">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#00F3FF] animate-pulse"></div>
                        <span className="font-bold text-[#00F3FF]">[SELECTED] {customDevice.name}</span>
                      </td>
                      <td className="py-4 px-4 text-xs opacity-60">{formatHps(customDevice.hashesPerSecond)}</td>
                      <td className="py-4 px-4 text-right font-bold text-[#00F3FF]">
                        {formatTime(getSecurityMetrics(password || ' ', customDevice.hashesPerSecond).crackingTimeSeconds)}
                      </td>
                    </tr>
                  )}
                  {Object.entries(HardwareSpecs).filter(([key]) => key !== HardwareTier.CUSTOM).map(([key, spec]) => {
                    const metrics = getSecurityMetrics(password || ' ', spec.hashesPerSecond);
                    const isSelected = hardware === key && !customDevice;
                    return (
                      <tr key={key} className={`border-b border-[#00FF41]/10 transition-colors ${isSelected ? 'bg-[#00FF41]/5' : 'hover:bg-white/5'}`}>
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#00FF41] animate-pulse' : 'bg-[#00FF41]/20'}`}></div>
                          <span className={isSelected ? 'font-bold text-[#00FF41]' : 'opacity-80'}>{key}</span>
                        </td>
                        <td className="py-4 px-4 text-xs opacity-60">{spec.label}</td>
                        <td className={`py-4 px-4 text-right font-bold ${isSelected ? 'text-[#00F3FF]' : ''}`}>
                          {formatTime(metrics.crackingTimeSeconds)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Active Simulation View */}
            <section className="md:col-span-7 bg-black/40 border border-[#00FF41]/20 rounded-xl p-6 overflow-hidden relative">
              {appState === AppState.CRACKING && (
                <div className="absolute inset-0 bg-[#00FF41]/5 animate-pulse pointer-events-none"></div>
              )}
              <h2 className="text-lg mb-6 flex items-center gap-2">
                <Server className="w-4 h-4" /> LIVE_VULNERABILITY_STAGES
              </h2>
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                      <span>{step.type}</span>
                      <span className={step.status === 'success' ? 'text-[#00FF41]' : step.status === 'active' ? 'text-[#00F3FF]' : 'opacity-30'}>
                        {step.status}
                      </span>
                    </div>
                    <div className="h-3 bg-black border border-[#00FF41]/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${step.status === 'success' ? 'bg-[#00FF41]' : 'bg-[#00F3FF] animate-pulse'}`}
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {steps.length === 0 && (
                  <div className="py-12 text-center opacity-30 italic text-sm">
                    Enter target key and run simulation to reveal vulnerabilities
                  </div>
                )}
              </div>
            </section>

            {/* Metrics Dashboard */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-black/40 border border-[#00FF41]/20 rounded-xl p-6 text-center">
                <div className="text-[10px] uppercase opacity-40 mb-1 tracking-widest">Entropy Strength</div>
                <div className="text-4xl font-bold text-[#00F3FF]">
                  {currentMetrics.entropy.toFixed(1)}
                  <span className="text-xs opacity-40 ml-1">bit</span>
                </div>
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-[#00FF41] transition-all duration-1000"
                    style={{ width: `${Math.min(100, (currentMetrics.entropy / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-black/40 border border-[#00FF41]/20 rounded-xl p-6 text-center">
                <div className="text-[10px] uppercase opacity-40 mb-1 tracking-widest">Resilience Score</div>
                <div className={`text-4xl font-bold ${currentMetrics.score > 70 ? 'text-[#00FF41]' : currentMetrics.score > 40 ? 'text-yellow-400' : 'text-red-500'}`}>
                  {Math.round(currentMetrics.score)}%
                </div>
                <p className="text-[8px] opacity-40 mt-2 uppercase">Safety probability vs standard dictionary vectors</p>
              </div>
            </div>
          </div>

          {/* AI Advisory Box */}
          <section className="bg-[#00F3FF]/5 border border-[#00F3FF]/20 rounded-xl p-6 min-h-[300px] shadow-[inset_0_0_30px_rgba(0,243,255,0.05)]">
            <h2 className="text-lg mb-4 text-[#00F3FF] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> AI_NEURAL_CONSULTANT
            </h2>
            {aiAdvice ? (
              <div className="prose prose-invert prose-cyan text-sm opacity-80 leading-relaxed whitespace-pre-wrap font-sans">
                {aiAdvice}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 opacity-20 text-center">
                <ChevronRight className="w-8 h-8 mb-2 animate-bounce" />
                <p className="text-sm">Awaiting neural analysis from Gemini-3 Neural Engine...</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] opacity-20 uppercase tracking-[0.4em]">
        Encryption // CyberShield Intelligence Laboratory // v2.1.0-SEARCHABLE
      </footer>
    </div>
  );
};

export default App;

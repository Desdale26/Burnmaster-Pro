
import React, { useState, useRef, useMemo } from 'react';
import { RoastSettings, RoastStyle, RoastFocus, GeneratedRoast } from './types';
import { generateRoast } from './services/geminiService';
import Slider from './components/Slider';
import BurnMeter from './components/BurnMeter';
import CameraCapture from './components/CameraCapture';

const App: React.FC = () => {
  const [settings, setSettings] = useState<RoastSettings>({
    targetName: '',
    context: 'A regular human',
    savageLevel: 50,
    wittyLevel: 50,
    absurdityLevel: 30,
    style: RoastStyle.MODERN,
    focus: RoastFocus.LOOKS,
    image: undefined,
  });

  const [currentRoast, setCurrentRoast] = useState<GeneratedRoast | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<GeneratedRoast[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // Projected Analytics reflect sliders in real-time
  const previewStats = useMemo(() => ({
    heat: settings.savageLevel,
    wit: settings.wittyLevel,
    chaos: settings.absurdityLevel
  }), [settings.savageLevel, settings.wittyLevel, settings.absurdityLevel]);

  const handleGenerate = async () => {
    if (!settings.targetName.trim()) {
      alert("Please enter a name to roast!");
      return;
    }

    setLoading(true);
    setCurrentRoast(null);
    
    try {
      const roast = await generateRoast(settings);
      setHistory(prev => [roast, ...prev].slice(0, 10));
      setCurrentRoast(roast);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error: any) {
      console.error("Roast failed:", error);
      alert("System meltdown. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Burn exported.");
  };

  // Screen Twist Calculation (Tie-Dye effect from the CENTER)
  // Only starts twisting when absurdityLevel > 30%
  const adjustedChaos = Math.max(0, settings.absurdityLevel - 30);
  const chaosFactor = adjustedChaos / 70; // Normalized from 0 to 1 after 30%
  const twistRotation = chaosFactor * 12; // Max 12 degrees rotation for intensity

  // Heat & Intellect Effects
  const savageEffect = settings.savageLevel / 100;
  const witEffect = settings.wittyLevel / 100;

  // Visual filter values
  const saturationBoost = savageEffect * 40; // Savage makes things more "intense/bloody"
  const brightnessBoost = witEffect * 15;   // Wit makes things "clearer/brighter"
  const hueShift = chaosFactor * 10;        // Chaos warps the colors

  return (
    <div 
      className="min-h-screen pb-48 transition-all duration-1000 bg-[#050505] text-white selection:bg-orange-600/50 overflow-x-hidden relative flex flex-col items-center"
      style={{
        filter: `saturate(${100 + saturationBoost}%) brightness(${100 + brightnessBoost}%) hue-rotate(${hueShift}deg)`
      }}
    >
      
      {/* Dynamic Background Overlays (Centered) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Heat (Red Glow) */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.12),transparent)] transition-opacity duration-700"
          style={{ opacity: savageEffect }}
        ></div>
        {/* Intellect (Blue Glow) */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent)] transition-opacity duration-700"
          style={{ opacity: witEffect }}
        ></div>
        
        {/* Tie-Dye Chaos Twists */}
        <div 
          className="absolute w-[200%] aspect-square bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.04),transparent_40%)] transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${twistRotation * 2.5}deg)` }}
        ></div>
        <div 
          className="absolute w-[200%] aspect-square bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.02),transparent_60%)] transition-transform duration-1000 ease-out delay-100"
          style={{ transform: `rotate(${-twistRotation * 4}deg)` }}
        ></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.03),transparent_70%)]"
        ></div>
      </div>

      <header className="w-full pt-20 pb-12 px-4 text-center sticky top-0 bg-[#050505]/80 backdrop-blur-3xl z-50 border-b border-white/5">
        <h1 className="text-5xl md:text-7xl font-bangers transition-all duration-700 text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-red-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          BURNMASTER PRO
        </h1>
        <p className="mt-3 font-bold tracking-[0.6em] uppercase text-[9px] text-orange-500/40">
          Personalized Insult Laboratory // Global Damage Engine
        </p>
      </header>

      {/* Main Body - This container twists from the CENTER based on Chaos */}
      <main 
        className="max-w-7xl w-full px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 mt-16 relative z-10 transition-transform duration-1000 ease-out"
        style={{ 
          transform: `rotate(${twistRotation}deg)`,
          transformOrigin: 'center center'
        }}
      >
        
        {/* Left: Input Lab */}
        <section className="glass-panel p-10 rounded-[3rem] space-y-10 h-fit border-t-4 border-t-orange-600 transition-all duration-700 shadow-2xl shadow-black relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none rotate-12">
            <svg className="w-64 h-64" viewBox="0 0 100 100" fill="currentColor"><path d="M50 0L100 50L50 100L0 50Z"/></svg>
          </div>

          <div className="space-y-10 relative z-10">
            <div className="space-y-5">
              <h2 className="text-xl font-bangers tracking-[0.2em] text-orange-500/80">TARGET IDENTITY</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Subject Name..."
                  className="w-full bg-black/60 border border-white/5 p-5 rounded-2xl focus:outline-none focus:border-orange-500/30 transition-all text-xl font-bold placeholder:text-gray-800"
                  value={settings.targetName}
                  onChange={(e) => setSettings({ ...settings, targetName: e.target.value })}
                />
                <textarea
                  placeholder="Describe their failure..."
                  className="w-full bg-black/60 border border-white/5 p-5 rounded-2xl focus:outline-none focus:border-orange-500/30 transition-all min-h-[100px] text-xs leading-relaxed"
                  value={settings.context}
                  onChange={(e) => setSettings({ ...settings, context: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="text-xl font-bangers tracking-[0.2em] text-orange-500/80">VISUAL SCAN</h2>
              <CameraCapture 
                currentImage={settings.image}
                onCapture={(data) => setSettings({ ...settings, image: data, focus: RoastFocus.LOOKS })}
                onClear={() => setSettings({ ...settings, image: undefined })}
              />
            </div>

            <div className="space-y-10">
              <h2 className="text-xl font-bangers tracking-[0.2em] text-orange-500/80">PROJECTED ANALYTICS</h2>
              <div className="bg-black/60 rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center shadow-inner">
                <BurnMeter stats={previewStats} />
                <div className="flex justify-between w-full mt-4 px-4 text-[9px] font-black uppercase tracking-widest text-gray-700">
                  <span>HEAT: {settings.savageLevel}%</span>
                  <span>WIT: {settings.wittyLevel}%</span>
                  <span>CHAOS: {settings.absurdityLevel}%</span>
                </div>
              </div>
              
              <div className="space-y-10 bg-black/30 p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
                <Slider
                  label="HEAT LEVEL"
                  min={0}
                  max={100}
                  value={settings.savageLevel}
                  onChange={(val) => setSettings({ ...settings, savageLevel: val })}
                />
                <Slider
                  label="INTELLECT"
                  min={0}
                  max={100}
                  value={settings.wittyLevel}
                  onChange={(val) => setSettings({ ...settings, wittyLevel: val })}
                />
                <Slider
                  label="CHAOS"
                  min={0}
                  max={100}
                  value={settings.absurdityLevel}
                  onChange={(val) => setSettings({ ...settings, absurdityLevel: val })}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-7 rounded-[2rem] text-3xl font-bangers tracking-[0.2em] transition-all duration-500 transform hover:-translate-y-2 active:scale-95 shadow-2xl ${
              loading 
              ? 'bg-gray-800 cursor-wait opacity-50' 
              : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
            }`}
          >
            {loading ? 'FUSING ATOMS...' : 'INITIATE BURN'}
          </button>
        </section>

        {/* Right: Result Zone */}
        <section className="flex flex-col gap-10 min-h-[700px]" ref={resultRef}>
          {currentRoast ? (
            <div key={currentRoast.id} className="glass-panel p-12 rounded-[4rem] relative overflow-hidden transition-all duration-1000 animate-[burnIn_0.8s_cubic-bezier(0.22,1,0.36,1)] border-white/10 shadow-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-60"></div>
              
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500">
                    BURN ANALYSIS COMPLETE
                  </h3>
                  <p className="text-gray-700 text-[8px] font-mono tracking-tighter uppercase opacity-50">
                    {new Date(currentRoast.timestamp).toLocaleString()} // SCAN: {currentRoast.id}
                  </p>
                </div>
              </div>

              <div className="space-y-16">
                {currentRoast.caricatureUrl && (
                  <div className="relative group max-w-xs mx-auto">
                    <img 
                      src={currentRoast.caricatureUrl} 
                      alt="Caricature" 
                      className="relative rounded-[2.5rem] w-full aspect-square object-cover border border-white/5 shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="relative py-12 text-center">
                   <blockquote className="relative text-3xl md:text-5xl font-bangers tracking-tight leading-[1.1] text-white drop-shadow-2xl">
                    "{currentRoast.text}"
                  </blockquote>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-black/60 p-10 rounded-[3.5rem] border border-white/10 shadow-inner">
                  <div className="space-y-6 text-center">
                    <h4 className="text-[9px] font-black uppercase text-gray-500 tracking-[0.5em]">ACTUAL IMPACT</h4>
                    <BurnMeter stats={currentRoast.stats} />
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <button 
                      onClick={() => copyToClipboard(currentRoast.text)}
                      className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 p-6 rounded-2xl transition-all border border-white/5 group"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">COPY BURN</span>
                    </button>
                    {currentRoast.caricatureUrl && (
                      <a 
                        href={currentRoast.caricatureUrl} 
                        download={`burn_${currentRoast.id}.png`}
                        className="w-full flex items-center justify-center gap-3 p-6 rounded-2xl transition-all border border-white/5 bg-white/5 hover:bg-white/10 group"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">EXTRACT PHOTO</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`glass-panel flex-1 rounded-[4rem] flex flex-col items-center justify-center text-center p-16 border-dashed border-white/5 transition-all duration-1000 ${loading ? 'opacity-10 blur-2xl' : 'opacity-100'}`}>
              <div className="relative mb-12">
                <div className="w-40 h-40 rounded-full bg-white/5 flex items-center justify-center border border-white/5 relative">
                  <svg className={`w-16 h-16 text-orange-500 transition-all duration-700 ${loading ? 'animate-spin opacity-100' : 'opacity-20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <div className={`absolute inset-0 rounded-full border border-orange-500/20 ${loading ? 'animate-ping' : ''}`}></div>
                </div>
              </div>
              <h3 className="text-2xl font-bangers tracking-[0.3em] text-gray-800 uppercase mb-4">SYSTEM IDLE</h3>
              <p className="text-gray-800 max-w-xs text-[10px] uppercase tracking-[0.3em] font-black leading-relaxed opacity-40">
                AWAITING INPUT PARAMETERS. SELECT TARGET AND HEAT LEVELS TO COMMENCE.
              </p>
            </div>
          )}

          {/* Incident Log */}
          {history.length > 1 && (
            <div className="space-y-8 pt-12 border-t border-white/5">
              <h3 className="text-[9px] font-black uppercase text-gray-700 tracking-[0.5em] px-2 text-center">INCIDENT LOG</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {history.slice(1, 5).map((h) => (
                  <button 
                    key={h.id} 
                    onClick={() => setCurrentRoast(h)}
                    className="flex flex-col gap-3 glass-panel p-4 rounded-[2rem] hover:bg-white/10 transition-all group border-white/5"
                  >
                    <div className="aspect-square w-full rounded-[1.2rem] bg-black/40 overflow-hidden border border-white/5">
                      {h.caricatureUrl ? <img src={h.caricatureUrl} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" /> : <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-800 font-bold">LOG</div>}
                    </div>
                    <p className="text-[9px] font-black uppercase truncate text-gray-700 group-hover:text-white transition-colors">{h.settings.targetName}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-40 mb-20 flex flex-col items-center gap-10 px-10 relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-orange-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative glass-panel px-10 py-5 rounded-full border border-white/10 flex items-center gap-6 shadow-2xl">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center font-bangers text-xl shadow-inner">B</div>
             <div className="text-left border-l border-white/10 pl-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90 mb-1">BURNMASTER PRO v5.3</p>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30">© {new Date().getFullYear()} GLOBAL DAMAGE LABS INC.</p>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes burnIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        body {
          scrollbar-width: none;
          background: #050505;
          -webkit-font-smoothing: antialiased;
        }
        body::-webkit-scrollbar {
          display: none;
        }
        main {
           perspective: 1500px;
        }
      `}</style>
    </div>
  );
};

export default App;

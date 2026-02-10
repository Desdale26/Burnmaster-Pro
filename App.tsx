
import React, { useState } from 'react';
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

  const handleGenerate = async () => {
    if (!settings.targetName.trim()) {
      alert("Please enter a name to roast!");
      return;
    }

    setLoading(true);
    try {
      const roast = await generateRoast(settings);
      setCurrentRoast(roast);
      setHistory(prev => [roast, ...prev].slice(0, 10));
    } catch (error: any) {
      console.error("Roast failed:", error);
      alert("The roast was too hot even for the AI. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isExtreme = settings.savageLevel > 75;

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-700 ${isExtreme ? 'bg-[#0f0202]' : 'bg-[#050505]'} text-white selection:bg-orange-500/30`}>
      {/* Header */}
      <header className="pt-10 pb-6 px-4 text-center sticky top-0 bg-inherit/90 backdrop-blur-md z-50 border-b border-white/5">
        <h1 className={`text-5xl md:text-7xl font-bangers text-transparent bg-clip-text bg-gradient-to-b ${isExtreme ? 'from-red-400 via-red-600 to-black' : 'from-yellow-300 via-orange-500 to-red-600'} drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]`}>
          {isExtreme ? 'OBLITERATION MODE' : 'BURNMASTER PRO'}
        </h1>
        <p className={`mt-2 font-bold tracking-[0.3em] uppercase text-[10px] ${isExtreme ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
          {isExtreme ? 'WARNING: EMOTIONAL DAMAGE IMMINENT' : 'Personalized Insult Laboratory'}
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Left: Controls */}
        <section className={`glass-panel p-8 rounded-3xl space-y-8 h-fit border-t-4 transition-all duration-500 ${isExtreme ? 'border-t-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-t-orange-500'}`}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className={isExtreme ? "text-red-500" : "text-orange-500"}>01.</span> Identity
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Who are we roasting?"
                  className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-xl placeholder:text-gray-700"
                  value={settings.targetName}
                  onChange={(e) => setSettings({ ...settings, targetName: e.target.value })}
                />
              </div>
              <textarea
                placeholder="What's their deal? (e.g. 'Always late', 'Wears socks with sandals')"
                className="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-orange-500 transition-all min-h-[80px] text-sm"
                value={settings.context}
                onChange={(e) => setSettings({ ...settings, context: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className={isExtreme ? "text-red-500" : "text-orange-500"}>02.</span> Appearance Analysis
              </h2>
              <CameraCapture 
                currentImage={settings.image}
                onCapture={(data) => setSettings({ ...settings, image: data, focus: RoastFocus.LOOKS })}
                onClear={() => setSettings({ ...settings, image: undefined })}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className={isExtreme ? "text-red-500" : "text-orange-500"}>03.</span> Roast Configuration
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tone Style</label>
                  <select
                    className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:outline-none text-xs"
                    value={settings.style}
                    onChange={(e) => setSettings({ ...settings, style: e.target.value as RoastStyle })}
                  >
                    {Object.values(RoastStyle).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Burn Area</label>
                  <select
                    className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:outline-none text-xs"
                    value={settings.focus}
                    onChange={(e) => setSettings({ ...settings, focus: e.target.value as RoastFocus })}
                  >
                    {Object.values(RoastFocus).map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                <Slider
                  label="Heat (Savage Level)"
                  min={0}
                  max={100}
                  value={settings.savageLevel}
                  onChange={(val) => setSettings({ ...settings, savageLevel: val })}
                />
                <Slider
                  label="Wit (IQ Level)"
                  min={0}
                  max={100}
                  value={settings.wittyLevel}
                  onChange={(val) => setSettings({ ...settings, wittyLevel: val })}
                />
                <Slider
                  label="Chaos (Absurdity)"
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
            className={`w-full py-5 rounded-2xl text-2xl font-bangers tracking-widest transition-all ${
              loading 
              ? 'bg-gray-800 cursor-not-allowed text-gray-500' 
              : isExtreme 
                ? 'bg-red-700 hover:bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]'
            }`}
          >
            {loading ? 'CALIBRATING VIOLENCE...' : isExtreme ? 'OBLITERATE THEM' : 'GENERATE PERSONALIZED BURN'}
          </button>
        </section>

        {/* Right: Results */}
        <section className="flex flex-col gap-6">
          {currentRoast ? (
            <div className={`glass-panel p-8 rounded-3xl relative overflow-hidden transition-all duration-500 ${isExtreme ? 'border-red-500/40' : 'border-orange-500/20'}`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${isExtreme ? 'via-red-600' : 'via-orange-500'} to-transparent opacity-30`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isExtreme ? 'text-red-500' : 'text-orange-500'}`}>
                    {isExtreme ? 'SURGICAL STRIKE COMPLETE' : 'Freshly Cooked'}
                  </h3>
                  <p className="text-gray-600 text-[10px] uppercase font-mono">{new Date(currentRoast.timestamp).toLocaleTimeString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter border ${isExtreme ? 'bg-red-600/10 text-red-500 border-red-500/20' : 'bg-orange-600/10 text-orange-500 border-orange-500/20'}`}>
                  {isExtreme ? 'MAXIMUM SAVAGERY' : 'Custom Roast Ready'}
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                {currentRoast.caricatureUrl && (
                  <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${isExtreme ? 'from-red-600 to-black' : 'from-orange-600 to-red-600'} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
                    <img 
                      src={currentRoast.caricatureUrl} 
                      alt="Personalized Caricature" 
                      className="relative rounded-2xl w-full h-auto aspect-square object-cover border border-white/10 shadow-2xl"
                    />
                    {isExtreme && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-[8px] font-bold rounded uppercase tracking-widest animate-pulse">
                        Grotesque Mode Active
                      </div>
                    )}
                  </div>
                )}

                <blockquote className={`text-2xl md:text-3xl font-bangers tracking-wide leading-snug text-white animate-flame drop-shadow-md ${isExtreme ? 'text-red-50' : ''}`}>
                  "{currentRoast.text}"
                </blockquote>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-4 text-center tracking-widest">Burn Dynamics</h4>
                    <BurnMeter stats={currentRoast.stats} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => copyToClipboard(currentRoast.text)}
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all text-xs font-bold uppercase"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      Copy Insult
                    </button>
                    {currentRoast.caricatureUrl && (
                      <a 
                        href={currentRoast.caricatureUrl} 
                        download={`burn_${currentRoast.id}.png`}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all text-xs font-bold uppercase border ${isExtreme ? 'bg-red-600/10 text-red-400 border-red-500/20 hover:bg-red-600/20' : 'bg-orange-600/10 text-orange-400 border-orange-500/20 hover:bg-orange-600/20'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Save Caricature
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 h-full border-dashed border-white/5 min-h-[400px] transition-all duration-700 ${isExtreme ? 'bg-red-950/5' : ''}`}>
              <div className={`w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 ${isExtreme ? 'animate-pulse' : ''}`}>
                <svg className={`w-10 h-10 ${isExtreme ? 'text-red-900' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 5.5 6 5.5 11.5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14.5a3 3 0 013 3"></path></svg>
              </div>
              <h3 className={`text-xl font-bold italic ${isExtreme ? 'text-red-900' : 'text-gray-600'}`}>
                {isExtreme ? 'PROTOCOL: EXTERMINATE' : 'Laboratory Idle'}
              </h3>
              <p className="text-gray-700 max-w-xs mx-auto text-xs uppercase tracking-widest leading-loose">
                {isExtreme ? 'CRANK THE HEAT TO 100 IF YOU DARE' : 'Configure your target above and initiate the burn protocol.'}
              </p>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[10px] font-bold uppercase text-gray-600 mb-4 tracking-[0.2em] px-2 border-l-2 border-orange-500/30 ml-1">Previous Burns</h3>
              <div className="space-y-3">
                {history.slice(1).map((h) => (
                  <div key={h.id} className="glass-panel p-4 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-all border-white/5">
                    {h.caricatureUrl && (
                      <img src={h.caricatureUrl} className="w-12 h-12 rounded-lg object-cover border border-white/10" alt="History thum" />
                    )}
                    <div className="flex-1 truncate">
                      <p className="text-sm font-medium text-gray-400 truncate">"{h.text}"</p>
                      <p className="text-[9px] text-gray-600 mt-1 uppercase font-mono">{h.settings.targetName} | {h.settings.style}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 text-center text-gray-700 text-[9px] uppercase tracking-[0.3em] pb-10">
        <p>© {new Date().getFullYear()} BURNMASTER PRO • NO LIMITS</p>
      </footer>
    </div>
  );
};

export default App;

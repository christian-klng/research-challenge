import React, { useState } from 'react';
import { generateChallenge } from './services/challengeService';
import { ResearchChallenge } from './types';
import { Steps } from './components/Steps';
import { ChallengeCard } from './components/ChallengeCard';

const App: React.FC = () => {
  const [challenge, setChallenge] = useState<ResearchChallenge | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setChallenge(null); // Clear previous to trigger clean state or let skeleton show
    try {
      const data = await generateChallenge();
      setChallenge(data);
    } catch (error) {
      console.error("Failed to generate challenge", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar / Header */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-1.5 rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3.75a9.753 9.753 0 0 0-3.25 1.558.75.75 0 0 0-.22.585c.05.3.05.6.05.9 0 5.584 5.061 10.5 11.05 10.5 5.989 0 11.05-4.916 11.05-10.5 0-.3 0-.6.05-.9a.75.75 0 0 0-.22-.585C23.774 4.045 22.822 3.75 21.75 3.75c-1.758 0-3.415.394-4.907 1.096a.75.75 0 0 1-.686-.011A10.65 10.65 0 0 0 12.39 3.23a.75.75 0 0 0-.78 0 10.65 10.65 0 0 0-3.743 1.636.75.75 0 0 1-.68.012l.062-.036ZM1.5 18a.75.75 0 0 0 0 1.5c4.14 0 7.5 3.36 7.5 7.5a.75.75 0 0 0 1.5 0c0-4.14 3.36-7.5 7.5-7.5a.75.75 0 0 0 0-1.5c-4.14 0-7.5-3.36-7.5-7.5a.75.75 0 0 0-1.5 0c0 4.14-3.36 7.5-7.5 7.5Z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Research<span className="text-indigo-600">Gen</span></span>
        </div>
        <div className="text-sm font-medium text-slate-500 hidden sm:block">
          Classroom Edition
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Deine nächste <br className="hidden md:block"/>
            <span className="gradient-text">NotebookLM Challenge</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ein Zufallsgenerator für Studierende. Finde Themen, suche echte Quellen und meistere komplexe Fragestellungen mit KI-Unterstützung.
          </p>
          
          <div className="pt-6">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generiere Challenge...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Neue Challenge starten
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Workflow Steps */}
        <Steps />

        {/* The Card */}
        <div id="challenge-card" className="scroll-mt-24">
            <ChallengeCard challenge={challenge} loading={loading} />
        </div>

      </main>
      
      <footer className="text-center text-slate-400 text-sm mt-24">
        <p>© {new Date().getFullYear()} Classroom Tools. Powered by OpenAI.</p>
      </footer>
    </div>
  );
};

export default App;
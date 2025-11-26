import React from 'react';
import { ResearchChallenge } from '../types';

interface ChallengeCardProps {
  challenge: ResearchChallenge | null;
  loading: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 md:p-12 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-12"></div>
          
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
             <div className="h-20 bg-slate-200 rounded"></div>
             <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white/50 border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
        <p className="text-lg">Klicke auf "Neue Challenge generieren", um zu beginnen.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transform transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4">
      {/* Header Band */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 w-full"></div>
      
      <div className="p-8 md:p-12">
        {/* Topic Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Das Thema
            </span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">
              PDF-Recherche
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
            {challenge.topic}
          </h2>
          <p className="text-xl text-slate-500 font-medium">{challenge.subArea}</p>
        </div>

        {/* Question Section */}
        <div className="bg-slate-50 rounded-xl p-6 md:p-8 border border-slate-100 relative mb-10">
          <div className="absolute -top-3 -left-3">
            <div className="bg-amber-400 text-white p-2 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 ml-2">Die Challenge-Frage</h3>
          <p className="text-xl md:text-2xl font-serif text-slate-800 leading-relaxed italic">
            "{challenge.question}"
          </p>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              Keywords für die Suche
            </h4>
            <div className="flex flex-wrap gap-2">
              {challenge.keywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600 font-medium shadow-sm">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div>
             <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                PDF Such-Tipp
             </h4>
             <p className="text-sm text-slate-600">
               {challenge.pdfStrategy}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
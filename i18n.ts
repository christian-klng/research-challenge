export type Lang = 'de' | 'en';

export interface StepText {
  title: string;
  description: string;
}

export interface Translation {
  edition: string;
  langToggleLabel: string;
  heroTitleLead: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaStart: string;
  ctaLoading: string;
  steps: StepText[];
  cardEmpty: string;
  badgeTopic: string;
  badgePdf: string;
  questionLabel: string;
  keywordsLabel: string;
  pdfStrategyLabel: string;
  footer: (year: number) => string;
}

export const translations: Record<Lang, Translation> = {
  de: {
    edition: 'Classroom Edition',
    langToggleLabel: 'Sprache wechseln',
    heroTitleLead: 'Deine nächste',
    heroTitleHighlight: 'NotebookLM Challenge',
    heroSubtitle:
      'Ein Zufallsgenerator für Studierende. Finde Themen, suche echte Quellen und meistere komplexe Fragestellungen mit KI-Unterstützung.',
    ctaStart: 'Neue Challenge starten',
    ctaLoading: 'Generiere Challenge...',
    steps: [
      {
        title: 'Recherche',
        description: 'Nutze Perplexity, Google Suche oder Consensus. Suche nach hochwertigen Quellen.',
      },
      {
        title: '3x PDF Download',
        description: 'Lade mindestens drei substanzielle PDF-Dokumente (Studien, Berichte) zum Thema herunter.',
      },
      {
        title: 'NotebookLM',
        description: 'Erstelle ein neues Notizbuch in Google NotebookLM und lade deine 3 PDFs als Quellen hoch.',
      },
      {
        title: 'Lösung',
        description: 'Nutze die KI-Funktionen, um die untenstehende Challenge-Frage fundiert zu beantworten.',
      },
    ],
    cardEmpty: 'Klicke auf "Neue Challenge starten", um zu beginnen.',
    badgeTopic: 'Das Thema',
    badgePdf: 'PDF-Recherche',
    questionLabel: 'Die Challenge-Frage',
    keywordsLabel: 'Keywords für die Suche',
    pdfStrategyLabel: 'PDF Such-Tipp',
    footer: (year) => `© ${year} Classroom Tools. Powered by OpenAI. · Erstellt durch Christian Klang`,
  },
  en: {
    edition: 'Classroom Edition',
    langToggleLabel: 'Switch language',
    heroTitleLead: 'Your next',
    heroTitleHighlight: 'NotebookLM Challenge',
    heroSubtitle:
      'A random generator for students. Find topics, track down real sources and master complex questions with AI support.',
    ctaStart: 'Start new challenge',
    ctaLoading: 'Generating challenge...',
    steps: [
      {
        title: 'Research',
        description: 'Use Perplexity, Google Search or Consensus. Look for high-quality sources.',
      },
      {
        title: '3x PDF Download',
        description: 'Download at least three substantial PDF documents (studies, reports) on the topic.',
      },
      {
        title: 'NotebookLM',
        description: 'Create a new notebook in Google NotebookLM and upload your 3 PDFs as sources.',
      },
      {
        title: 'Solution',
        description: 'Use the AI features to answer the challenge question below in a well-founded way.',
      },
    ],
    cardEmpty: 'Click "Start new challenge" to begin.',
    badgeTopic: 'The Topic',
    badgePdf: 'PDF Research',
    questionLabel: 'The Challenge Question',
    keywordsLabel: 'Keywords for the search',
    pdfStrategyLabel: 'PDF Search Tip',
    footer: (year) => `© ${year} Classroom Tools. Powered by OpenAI. · Created by Christian Klang`,
  },
};

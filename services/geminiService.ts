import { GoogleGenAI, Type } from "@google/genai";
import { ResearchChallenge } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChallenge = async (): Promise<ResearchChallenge> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Erstelle eine anspruchsvolle Recherche-Aufgabe für Studierende.",
      config: {
        systemInstruction: `Du bist ein kreativer Assistent für Lehrkräfte an einer Universität. 
        Deine Aufgabe ist es, zufällige, intellektuell stimulierende Themen für eine Internetrecherche zu generieren.
        
        Das Ziel der Aufgabe für die Studierenden ist:
        1. Recherchiere ein komplexes Thema.
        2. Finde mindestens 3 hochwertige PDF-Quellen (Studien, Reports, wissenschaftliche Artikel).
        3. Lade diese in 'NotebookLM' hoch.
        4. Beantworte eine sehr spezifische, schwierige Frage, die eine Synthese dieser Quellen erfordert.
        
        Die Themen sollten aus Bereichen wie Technologie, Soziologie, Umweltwissenschaften, Geschichte, Wirtschaft oder Ethik kommen.
        Die Frage darf nicht durch einfaches Googeln beantwortbar sein, sondern muss das Vergleichen von Quellen erfordern.
        Sprache: Deutsch.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description: "Das übergeordnete Thema der Recherche (z.B. 'Künstliche Intelligenz in der Medizin')."
            },
            subArea: {
              type: Type.STRING,
              description: "Ein spezifischer Teilbereich (z.B. 'Ethische Implikationen von Diagnose-Algorithmen')."
            },
            question: {
              type: Type.STRING,
              description: "Eine komplexe Fragestellung, die eine Synthese aus mehreren Quellen erfordert."
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 Suchbegriffe für Google Scholar, Consensus oder Perplexity."
            },
            pdfStrategy: {
              type: Type.STRING,
              description: "Ein kurzer Tipp, nach welcher Art von PDF-Dokumenten gesucht werden soll (z.B. 'Suche nach Whitepapers der EU-Kommission und Jahresberichten von NGOs')."
            }
          },
          required: ["topic", "subArea", "question", "keywords", "pdfStrategy"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ResearchChallenge;
    }
    throw new Error("Keine Antwort erhalten");
  } catch (error) {
    console.error("Fehler bei der Generierung:", error);
    // Fallback data in case of error
    return {
      topic: "Nachhaltige Stadtentwicklung",
      subArea: "Das Konzept der Schwammstadt (Sponge City)",
      question: "Inwiefern unterscheiden sich die Implementierungsstrategien von Schwammstadt-Konzepten in nordeuropäischen Städten im Vergleich zu asiatischen Metropolen hinsichtlich der Kosten-Nutzen-Analyse bei Starkregenereignissen?",
      keywords: ["Sponge City implementation comparison", "Urban resilience strategies PDF", "Cost-benefit analysis urban drainage"],
      pdfStrategy: "Suche nach städtischen Planungsberichten, Fallstudien von Architektur-Instituten und hydrologischen Analysen."
    };
  }
};
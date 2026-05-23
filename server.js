import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8787;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('[server] OPENAI_API_KEY ist nicht gesetzt – /api/generate-challenge wird Fallback-Daten zurückgeben.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const SYSTEM_PROMPT = `Du bist ein kreativer Assistent für Lehrkräfte an einer Universität.
Deine Aufgabe ist es, zufällige, intellektuell stimulierende Themen für eine Internetrecherche zu generieren.

Das Ziel der Aufgabe für die Studierenden ist:
1. Recherchiere ein komplexes Thema.
2. Finde mindestens 3 hochwertige PDF-Quellen (Studien, Reports, wissenschaftliche Artikel).
3. Lade diese in 'NotebookLM' hoch.
4. Beantworte eine sehr spezifische, schwierige Frage, die eine Synthese dieser Quellen erfordert.

Die Frage darf nicht durch einfaches Googeln beantwortbar sein, sondern muss das Vergleichen von Quellen erfordern.
Vermeide ausgetretene Pfade (z.B. KI-Ethik allgemein, Klimawandel allgemein, Social-Media-Wirkung). Wähle stattdessen ungewöhnliche, spezifische Nischen oder kontraintuitive Verbindungen zwischen zwei Feldern.
Sprache: Deutsch.`;

const DOMAINS = [
  'Mikrobiologie', 'Stadtsoziologie', 'Geldpolitik', 'Materialwissenschaften',
  'Postkoloniale Geschichte', 'Verhaltensökonomie', 'Wissenschaftstheorie',
  'Meereskunde', 'Linguistik', 'Verkehrsplanung', 'Energiepolitik',
  'Neurowissenschaften', 'Agrarwissenschaften', 'Kulturanthropologie',
  'Kryptographie', 'Bioethik', 'Architekturtheorie', 'Demografie',
  'Arbeitsrecht', 'Medizingeschichte', 'Lieferketten-Ökonomie',
  'Kognitionspsychologie', 'Spieltheorie', 'Pharmakologie',
  'Sportwissenschaften', 'Religionssoziologie', 'Migrationsforschung',
  'Quantentechnologie', 'Geopolitik der Rohstoffe', 'Welternährung',
];

const ANGLES = [
  'unerwartete historische Parallelen', 'methodischer Widerspruch zwischen Studien',
  'Diskrepanz zwischen offiziellen Zahlen und Forschungsergebnissen',
  'kultureller Vergleich zweier Regionen', 'Langzeitfolgen einer politischen Entscheidung',
  'Zielkonflikt zwischen zwei legitimen Interessen', 'kontraintuitiver Effekt einer Maßnahme',
  'Übersetzung von Laborergebnissen in die Praxis', 'Rolle einer übersehenen Akteursgruppe',
  'ökonomische Externalitäten', 'ethisches Dilemma einer neuen Technologie',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    topic: {
      type: 'string',
      description: "Das übergeordnete Thema der Recherche (z.B. 'Künstliche Intelligenz in der Medizin').",
    },
    subArea: {
      type: 'string',
      description: "Ein spezifischer Teilbereich (z.B. 'Ethische Implikationen von Diagnose-Algorithmen').",
    },
    question: {
      type: 'string',
      description: 'Eine komplexe Fragestellung, die eine Synthese aus mehreren Quellen erfordert.',
    },
    keywords: {
      type: 'array',
      items: { type: 'string' },
      description: '3-5 Suchbegriffe für Google Scholar, Consensus oder Perplexity.',
    },
    pdfStrategy: {
      type: 'string',
      description: 'Ein kurzer Tipp, nach welcher Art von PDF-Dokumenten gesucht werden soll.',
    },
  },
  required: ['topic', 'subArea', 'question', 'keywords', 'pdfStrategy'],
};

const FALLBACK = {
  topic: 'Nachhaltige Stadtentwicklung',
  subArea: 'Das Konzept der Schwammstadt (Sponge City)',
  question:
    'Inwiefern unterscheiden sich die Implementierungsstrategien von Schwammstadt-Konzepten in nordeuropäischen Städten im Vergleich zu asiatischen Metropolen hinsichtlich der Kosten-Nutzen-Analyse bei Starkregenereignissen?',
  keywords: [
    'Sponge City implementation comparison',
    'Urban resilience strategies PDF',
    'Cost-benefit analysis urban drainage',
  ],
  pdfStrategy:
    'Suche nach städtischen Planungsberichten, Fallstudien von Architektur-Instituten und hydrologischen Analysen.',
};

app.post('/api/generate-challenge', async (_req, res) => {
  if (!openai) {
    return res.status(200).json(FALLBACK);
  }

  const domain = pick(DOMAINS);
  const angle = pick(ANGLES);
  const userPrompt = `Erstelle eine anspruchsvolle Recherche-Aufgabe für Studierende.
Fachgebiet diesmal: ${domain}.
Aufhänger: ${angle}.
Wähle bewusst einen sehr spezifischen Teilbereich innerhalb dieses Fachgebiets — keine Lehrbuch-Themen.`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'research_challenge',
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
      temperature: 1.1,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new Error('Leere Antwort von OpenAI');
    }
    res.json(JSON.parse(text));
  } catch (error) {
    console.error('[api/generate-challenge] OpenAI-Fehler:', error);
    res.status(200).json(FALLBACK);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: Boolean(OPENAI_API_KEY), model: MODEL });
});

const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] läuft auf http://0.0.0.0:${PORT} (Modell: ${MODEL})`);
});

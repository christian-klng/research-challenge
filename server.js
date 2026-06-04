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

const SYSTEM_PROMPTS = {
  de: `Du bist Experte für Forschungsdesign und generierst kleine, eigenständige Forschungsaufgaben für Studierende.
Jede Aufgabe soll Studierende zu echter Quellenarbeit und Synthese anleiten – nicht zum bloßen Nachschlagen.

Eine gute Aufgabe folgt diesem Ablauf für die Studierenden:
1. Ein komplexes, klar eingegrenztes Thema recherchieren.
2. Mindestens 3 hochwertige PDF-Quellen finden (Studien, Reports, wissenschaftliche Artikel).
3. Diese in 'NotebookLM' hochladen.
4. Eine sehr spezifische, anspruchsvolle Frage beantworten, die nur durch Synthese und Vergleich dieser Quellen lösbar ist.

Anforderungen an die von dir generierte Frage:
- Nicht durch einfaches Googeln beantwortbar; sie muss das Gegenüberstellen mehrerer Quellen erzwingen.
- Konkret und nischig statt allgemein. Vermeide ausgetretene Pfade (z.B. KI-Ethik allgemein, Klimawandel allgemein, Social-Media-Wirkung).
- Bevorzuge ungewöhnliche, spezifische Teilbereiche oder kontraintuitive Verbindungen zwischen zwei Feldern.

Sprache: Deutsch.`,
  en: `You are an expert in research design who generates small, self-contained research assignments for students.
Each assignment should guide students toward genuine source work and synthesis – not mere look-up.

A good assignment follows this workflow for the students:
1. Research a complex, clearly bounded topic.
2. Find at least 3 high-quality PDF sources (studies, reports, scholarly articles).
3. Upload them to 'NotebookLM'.
4. Answer a very specific, demanding question that can only be solved by synthesizing and comparing these sources.

Requirements for the question you generate:
- Not answerable by simple Googling; it must force the comparison of multiple sources.
- Concrete and niche rather than general. Avoid well-trodden paths (e.g. AI ethics in general, climate change in general, social-media effects).
- Prefer unusual, specific sub-areas or counterintuitive connections between two fields.

Language: English.`,
};

const DOMAINS = {
  de: [
    'Mikrobiologie', 'Stadtsoziologie', 'Geldpolitik', 'Materialwissenschaften',
    'Postkoloniale Geschichte', 'Verhaltensökonomie', 'Wissenschaftstheorie',
    'Meereskunde', 'Linguistik', 'Verkehrsplanung', 'Energiepolitik',
    'Neurowissenschaften', 'Agrarwissenschaften', 'Kulturanthropologie',
    'Kryptographie', 'Bioethik', 'Architekturtheorie', 'Demografie',
    'Arbeitsrecht', 'Medizingeschichte', 'Lieferketten-Ökonomie',
    'Kognitionspsychologie', 'Spieltheorie', 'Pharmakologie',
    'Sportwissenschaften', 'Religionssoziologie', 'Migrationsforschung',
    'Quantentechnologie', 'Geopolitik der Rohstoffe', 'Welternährung',
  ],
  en: [
    'Microbiology', 'Urban Sociology', 'Monetary Policy', 'Materials Science',
    'Postcolonial History', 'Behavioral Economics', 'Philosophy of Science',
    'Oceanography', 'Linguistics', 'Transport Planning', 'Energy Policy',
    'Neuroscience', 'Agricultural Science', 'Cultural Anthropology',
    'Cryptography', 'Bioethics', 'Architectural Theory', 'Demography',
    'Labor Law', 'History of Medicine', 'Supply Chain Economics',
    'Cognitive Psychology', 'Game Theory', 'Pharmacology',
    'Sports Science', 'Sociology of Religion', 'Migration Studies',
    'Quantum Technology', 'Geopolitics of Raw Materials', 'Global Food Security',
  ],
};

const ANGLES = {
  de: [
    'unerwartete historische Parallelen', 'methodischer Widerspruch zwischen Studien',
    'Diskrepanz zwischen offiziellen Zahlen und Forschungsergebnissen',
    'kultureller Vergleich zweier Regionen', 'Langzeitfolgen einer politischen Entscheidung',
    'Zielkonflikt zwischen zwei legitimen Interessen', 'kontraintuitiver Effekt einer Maßnahme',
    'Übersetzung von Laborergebnissen in die Praxis', 'Rolle einer übersehenen Akteursgruppe',
    'ökonomische Externalitäten', 'ethisches Dilemma einer neuen Technologie',
  ],
  en: [
    'unexpected historical parallels', 'methodological contradiction between studies',
    'discrepancy between official figures and research findings',
    'cultural comparison of two regions', 'long-term consequences of a policy decision',
    'trade-off between two legitimate interests', 'counterintuitive effect of an intervention',
    'translation of lab results into practice', 'role of an overlooked group of actors',
    'economic externalities', 'ethical dilemma of a new technology',
  ],
};

const buildUserPrompt = (lang, domain, angle) =>
  lang === 'en'
    ? `Create a demanding research assignment for students.
Field this time: ${domain}.
Angle: ${angle}.
Deliberately choose a very specific sub-area within this field — no textbook topics.`
    : `Erstelle eine anspruchsvolle Recherche-Aufgabe für Studierende.
Fachgebiet diesmal: ${domain}.
Aufhänger: ${angle}.
Wähle bewusst einen sehr spezifischen Teilbereich innerhalb dieses Fachgebiets — keine Lehrbuch-Themen.`;

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
  de: {
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
  },
  en: {
    topic: 'Sustainable Urban Development',
    subArea: 'The concept of the sponge city',
    question:
      'How do the implementation strategies of sponge-city concepts in Northern European cities differ from those in Asian metropolises with regard to the cost-benefit analysis of heavy-rainfall events?',
    keywords: [
      'Sponge City implementation comparison',
      'Urban resilience strategies PDF',
      'Cost-benefit analysis urban drainage',
    ],
    pdfStrategy:
      'Look for municipal planning reports, case studies from architecture institutes and hydrological analyses.',
  },
};

app.post('/api/generate-challenge', async (req, res) => {
  const lang = req.body?.lang === 'en' ? 'en' : 'de';

  if (!openai) {
    return res.status(200).json(FALLBACK[lang]);
  }

  const domain = pick(DOMAINS[lang]);
  const angle = pick(ANGLES[lang]);
  const userPrompt = buildUserPrompt(lang, domain, angle);

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[lang] },
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
    res.status(200).json(FALLBACK[lang]);
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

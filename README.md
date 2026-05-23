# NotebookLM Research Challenge

Ein Zufallsgenerator für Recherche-Aufgaben. Generiert anspruchsvolle Themen, Leitfragen und PDF-Such-Strategien für den Einsatz mit NotebookLM im Unterricht.

Frontend: React + Vite. Backend: kleiner Express-Proxy, der OpenAI mit `gpt-4o-mini` (Structured Outputs) aufruft. Der API-Key bleibt serverseitig.

## Lokale Entwicklung

**Voraussetzungen:** Node.js ≥ 20

```bash
npm install
cp .env.example .env
# OPENAI_API_KEY in .env eintragen
```

Zwei Prozesse parallel starten:

```bash
npm run dev:server   # API-Proxy auf http://localhost:8787
npm run dev          # Vite-Dev-Server auf http://localhost:3000 (proxyt /api weiter)
```

Oder produktionsnah:

```bash
npm run build
npm start            # Express liefert dist/ + /api auf einem Port
```

## Deployment auf Railway

1. Repo in Railway als neues Projekt verknüpfen ("Deploy from GitHub repo").
2. Unter **Variables** eintragen:
   - `OPENAI_API_KEY` — dein OpenAI Key (Pflicht)
   - `OPENAI_MODEL` — optional, Default `gpt-4o-mini`
3. Railway setzt `PORT` automatisch — nicht manuell anlegen.
4. Build- und Start-Command sind in `railway.json` hinterlegt:
   - Build: `npm ci && npm run build`
   - Start: `node server.js`

Das war's. Beim Push auf den Main-Branch baut und deployt Railway automatisch.

## Architektur

```
Browser  ──fetch /api/generate-challenge──▶  server.js (Express)
                                                │
                                                ▼
                                          OpenAI API
```

Der OpenAI-Key wird niemals an den Client ausgeliefert. Bei fehlendem Key oder API-Fehler liefert der Server statisches Fallback-Material.

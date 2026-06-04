import { ResearchChallenge } from '../types';
import { Lang } from '../i18n';

export const generateChallenge = async (lang: Lang = 'de'): Promise<ResearchChallenge> => {
  const response = await fetch('/api/generate-challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lang }),
  });

  if (!response.ok) {
    throw new Error(`Request fehlgeschlagen: ${response.status}`);
  }

  return (await response.json()) as ResearchChallenge;
};

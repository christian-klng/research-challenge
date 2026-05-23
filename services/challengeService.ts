import { ResearchChallenge } from '../types';

export const generateChallenge = async (): Promise<ResearchChallenge> => {
  const response = await fetch('/api/generate-challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Request fehlgeschlagen: ${response.status}`);
  }

  return (await response.json()) as ResearchChallenge;
};

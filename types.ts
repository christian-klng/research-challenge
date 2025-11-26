import React from 'react';

export interface ResearchChallenge {
  topic: string;
  subArea: string;
  question: string;
  keywords: string[];
  pdfStrategy: string;
}

export interface StepInfo {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}
declare module 'sentiment' {
  export interface SentimentResult {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
    tokens: string[];
    words: string[];
    emotionalScores?: {
      joy?: number;
      sadness?: number;
      anger?: number;
      fear?: number;
      surprise?: number;
      disgust?: number;
    };
  }

  export default class Sentiment {
    constructor();
    analyze(text: string): SentimentResult;
  }
} 
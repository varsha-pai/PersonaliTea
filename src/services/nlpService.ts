import nlp from 'compromise';
import Sentiment, { SentimentResult } from 'sentiment';

// Add type declaration for sentiment
declare module 'sentiment' {
  interface SentimentResult {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
    tokens: string[];
    words: string[];
  }
}

const sentiment = new Sentiment();

/**
 * NLP Service for text analysis using real NLP techniques
 */
export interface NlpAnalysisResult {
  sentiment: {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
    emotionalScores: Record<string, number>;
  };
  topics: string[];
  questionFrequency: number;
  exclamationFrequency: number;
  wordFrequencies: Record<string, number>;
  pronouns: {
    firstPerson: number;
    secondPerson: number;
    thirdPerson: number;
  };
  adjectiveUse: string[];
  verbUse: string[];
  textLength: number;
  averageSentenceLength: number;
  complexityScore: number;
}

// Enhanced keyword dictionaries for trait analysis
const traitKeywords = {
  openness: {
    positive: [
      'imagine', 'creative', 'artistic', 'curious', 'explore', 'novel', 'innovative',
      'abstract', 'philosophical', 'theoretical', 'unconventional', 'diverse',
      'experience', 'adventure', 'discover', 'learn', 'intellectual', 'complex',
      'variety', 'change', 'different', 'unique', 'original', 'inventive'
    ],
    negative: [
      'traditional', 'conventional', 'routine', 'familiar', 'practical', 'simple',
      'basic', 'standard', 'usual', 'normal', 'regular', 'ordinary'
    ]
  },
  conscientiousness: {
    positive: [
      'organized', 'plan', 'schedule', 'goal', 'achieve', 'complete', 'finish',
      'responsible', 'reliable', 'diligent', 'thorough', 'careful', 'precise',
      'methodical', 'systematic', 'efficient', 'productive', 'disciplined',
      'punctual', 'deadline', 'structure', 'order', 'detail', 'accuracy'
    ],
    negative: [
      'spontaneous', 'impulsive', 'casual', 'relaxed', 'flexible', 'informal',
      'unstructured', 'disorganized', 'chaotic', 'messy', 'careless', 'sloppy'
    ]
  },
  extraversion: {
    positive: [
      'social', 'outgoing', 'energetic', 'enthusiastic', 'talkative', 'friendly',
      'people', 'group', 'team', 'party', 'gathering', 'meet', 'connect',
      'interact', 'communicate', 'share', 'express', 'active', 'dynamic',
      'vibrant', 'lively', 'excited', 'passionate', 'engaging'
    ],
    negative: [
      'quiet', 'reserved', 'private', 'solitary', 'alone', 'independent',
      'introspective', 'reflective', 'calm', 'peaceful', 'serene', 'contemplative'
    ]
  },
  agreeableness: {
    positive: [
      'kind', 'helpful', 'supportive', 'caring', 'empathetic', 'understanding',
      'compassionate', 'considerate', 'thoughtful', 'generous', 'cooperative',
      'collaborative', 'harmonious', 'peaceful', 'gentle', 'warm', 'friendly',
      'trusting', 'forgiving', 'patient', 'tolerant', 'accepting'
    ],
    negative: [
      'direct', 'assertive', 'competitive', 'challenging', 'critical', 'skeptical',
      'suspicious', 'doubtful', 'questioning', 'analytical', 'logical', 'rational'
    ]
  },
  neuroticism: {
    positive: [
      'calm', 'stable', 'relaxed', 'confident', 'secure', 'balanced', 'composed',
      'steady', 'resilient', 'strong', 'tough', 'robust', 'unfazed', 'unperturbed'
    ],
    negative: [
      'anxious', 'worried', 'stressed', 'nervous', 'tense', 'fearful', 'afraid',
      'insecure', 'vulnerable', 'sensitive', 'emotional', 'moody', 'volatile',
      'unstable', 'fragile', 'fragile', 'overwhelmed', 'distressed', 'upset'
    ]
  }
};

// Enhanced text complexity metrics
const calculateTextComplexity = (text: string): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  // Average sentence length
  const avgSentenceLength = words.length / sentences.length;
  
  // Average word length
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  // Unique word ratio
  const uniqueWords = new Set(words).size;
  const uniqueWordRatio = uniqueWords / words.length;
  
  // Long word ratio (words > 6 characters)
  const longWords = words.filter(word => word.length > 6).length;
  const longWordRatio = longWords / words.length;
  
  // Calculate complexity score (0-10)
  const complexityScore = (
    (avgSentenceLength / 20) * 3 + // Sentence length contribution
    (avgWordLength / 8) * 2 + // Word length contribution
    (uniqueWordRatio * 3) + // Vocabulary diversity contribution
    (longWordRatio * 2) // Complex word contribution
  ) * 1.5; // Scale to 0-10 range
  
  return Math.min(10, Math.max(1, complexityScore));
};

// Enhanced sentiment analysis
const analyzeSentiment = (text: string): SentimentResult & { emotionalScores: Record<string, number> } => {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);
  
  // Enhanced sentiment analysis with emotional categories
  const emotionalCategories = {
    joy: ['happy', 'joy', 'delight', 'pleasure', 'excited', 'thrilled'],
    sadness: ['sad', 'unhappy', 'depressed', 'miserable', 'gloomy', 'down'],
    anger: ['angry', 'furious', 'enraged', 'irritated', 'annoyed', 'frustrated'],
    fear: ['afraid', 'scared', 'frightened', 'terrified', 'anxious', 'worried'],
    surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned'],
    disgust: ['disgusted', 'repulsed', 'revolted', 'appalled', 'horrified']
  };
  
  const emotionalScores: Record<string, number> = Object.entries(emotionalCategories).reduce((acc, [category, words]) => {
    const count = words.reduce((sum, word) => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      return sum + (text.match(regex) || []).length;
    }, 0);
    acc[category] = count;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    ...result,
    emotionalScores
  };
};

/**
 * Analyzes text using enhanced NLP techniques
 */
export const analyzeText = (text: string): NlpAnalysisResult => {
  // Enhanced sentiment analysis
  const sentimentResult = analyzeSentiment(text);
  
  // Process text with compromise
  const doc = nlp(text);
  
  // Extract topics (nouns that appear frequently)
  const nouns = doc.nouns().out('array');
  const topicFrequency: Record<string, number> = {};
  
  nouns.forEach((noun: string) => {
    if (noun.length > 3) { // Ignore very short nouns
      topicFrequency[noun] = (topicFrequency[noun] || 0) + 1;
    }
  });
  
  // Sort topics by frequency
  const topics = Object.entries(topicFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
  
  // Enhanced text analysis
  const sentences = doc.sentences().out('array');
  const questionCount = doc.questions().length;
  const exclamationCount = sentences.filter((s: string) => s.includes('!')).length;
  
  // Enhanced word frequency analysis
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
    
  const wordFrequencies: Record<string, number> = {};
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'will', 'would', 'could', 'should',
    'the', 'and', 'but', 'for', 'not', 'are', 'was', 'were', 'been', 'being',
    'has', 'had', 'does', 'did', 'doing', 'would', 'could', 'should', 'might',
    'must', 'shall', 'can', 'may', 'need', 'ought', 'dare'
  ]);
  
  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
    }
  });
  
  // Get top frequency words
  const topWords = Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .reduce((acc, [word, count]) => {
      acc[word] = count;
      return acc;
    }, {} as Record<string, number>);
  
  // Enhanced pronoun analysis
  const firstPersonPronouns = (doc.match('(I|me|my|mine|myself|we|us|our|ours|ourselves)').out('array') || []).length;
  const secondPersonPronouns = (doc.match('(you|your|yours|yourself|yourselves)').out('array') || []).length;
  const thirdPersonPronouns = (doc.match('(he|him|his|himself|she|her|hers|herself|they|them|their|theirs|themselves|it|its|itself)').out('array') || []).length;
  
  // Enhanced adjective and verb analysis
  const adjectives = doc.adjectives().out('array').slice(0, 15);
  const verbs = doc.verbs().out('array').slice(0, 15);
  
  // Calculate enhanced text complexity
  const complexityScore = calculateTextComplexity(text);
  
  return {
    sentiment: {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      positive: sentimentResult.positive,
      negative: sentimentResult.negative,
      emotionalScores: sentimentResult.emotionalScores
    },
    topics,
    questionFrequency: questionCount / sentences.length,
    exclamationFrequency: exclamationCount / sentences.length,
    wordFrequencies: topWords,
    pronouns: {
      firstPerson: firstPersonPronouns,
      secondPerson: secondPersonPronouns,
      thirdPerson: thirdPersonPronouns
    },
    adjectiveUse: adjectives,
    verbUse: verbs,
    textLength: words.length,
    averageSentenceLength: words.length / sentences.length,
    complexityScore
  };
};

/**
 * Map NLP features to personality traits
 */
export const mapNlpToPersonalityTraits = (analysis: NlpAnalysisResult) => {
  const traits = {
    openness: calculateOpenness(analysis),
    conscientiousness: calculateConscientiousness(analysis),
    extraversion: calculateExtraversion(analysis),
    agreeableness: calculateAgreeableness(analysis),
    neuroticism: calculateNeuroticism(analysis)
  };
  
  return traits;
};

// Enhanced trait calculation functions with more sensitivity to input
const calculateOpenness = (analysis: NlpAnalysisResult): number => {
  let score = 5; // Start with neutral score
  
  // Vocabulary diversity (increased weight and sensitivity)
  const uniqueWords = Object.keys(analysis.wordFrequencies).length;
  const vocabularyScore = Math.min(uniqueWords / 8, 3); // Increased from 10 to 8 for more sensitivity
  score += vocabularyScore;
  
  // Question frequency suggests curiosity (increased weight)
  score += analysis.questionFrequency * 5; // Increased from 4 to 5
  
  // Complex language suggests intellectual curiosity (more granular)
  const complexityContribution = (analysis.complexityScore - 5) * 1.2; // Increased from 0.8 to 1.2
  score += complexityContribution;
  
  // Keyword analysis with enhanced context
  const positiveScore = traitKeywords.openness.positive.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  const negativeScore = traitKeywords.openness.negative.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  score += (positiveScore - negativeScore) * 0.6; // Increased from 0.4 to 0.6
  
  // Adjective use suggests creativity (more weight)
  const uniqueAdjectives = new Set(analysis.adjectiveUse).size;
  score += Math.min(uniqueAdjectives / 1.5, 2); // Increased from 2 to 1.5 for more sensitivity
  
  // Topic diversity (increased weight)
  score += Math.min(analysis.topics.length / 2, 1.5); // Increased from 3 to 2
  
  // Normalize to 1-10 scale with more granularity
  return Math.max(1, Math.min(10, score));
};

const calculateConscientiousness = (analysis: NlpAnalysisResult): number => {
  let score = 5;
  
  // Text structure analysis (more granular)
  const sentenceLengthDeviation = Math.abs(analysis.averageSentenceLength - 15);
  score += (10 - sentenceLengthDeviation) * 0.4; // Increased from 0.3 to 0.4
  
  // Keyword analysis with enhanced frequency weighting
  const positiveScore = traitKeywords.conscientiousness.positive.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  const negativeScore = traitKeywords.conscientiousness.negative.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  score += (positiveScore - negativeScore) * 0.6; // Increased from 0.4 to 0.6
  
  // Temporal terms with enhanced context
  const temporalTerms = ['schedule', 'plan', 'organize', 'time', 'task', 'goal', 'achieve', 'complete', 'deadline', 'timeline'];
  const temporalScore = temporalTerms.reduce((sum, term) => {
    const frequency = analysis.wordFrequencies[term] || 0;
    return sum + (frequency * 0.8); // Increased from 0.6 to 0.8
  }, 0);
  score += temporalScore * 0.7; // Increased from 0.5 to 0.7
  
  // Verb analysis for action-oriented language (more weight)
  const actionVerbs = analysis.verbUse.filter(v => 
    ['complete', 'finish', 'achieve', 'accomplish', 'organize', 'plan'].includes(v)
  ).length;
  score += actionVerbs * 0.5; // Increased from 0.3 to 0.5
  
  return Math.max(1, Math.min(10, score));
};

const calculateExtraversion = (analysis: NlpAnalysisResult): number => {
  let score = 5;
  
  // Keyword analysis with enhanced frequency weighting
  const positiveScore = traitKeywords.extraversion.positive.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  const negativeScore = traitKeywords.extraversion.negative.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  score += (positiveScore - negativeScore) * 0.6; // Increased from 0.4 to 0.6
  
  // Exclamation usage (increased weight)
  score += analysis.exclamationFrequency * 6; // Increased from 5 to 6
  
  // Sentiment analysis (more weight)
  score += analysis.sentiment.comparative * 2.5; // Increased from 2 to 2.5
  
  // Pronoun analysis (more nuanced)
  const totalPronouns = analysis.pronouns.firstPerson + analysis.pronouns.secondPerson + analysis.pronouns.thirdPerson;
  if (totalPronouns > 0) {
    const socialRatio = (analysis.pronouns.firstPerson + analysis.pronouns.secondPerson) / totalPronouns;
    score += (socialRatio - 0.5) * 4; // Increased from 3 to 4
  }
  
  // Emotional expression (more weight)
  const emotionalIntensity = Object.values(analysis.sentiment.emotionalScores).reduce((sum, score) => sum + score, 0);
  score += Math.min(emotionalIntensity / 4, 2); // Increased from 5 to 4, max from 1.5 to 2
  
  return Math.max(1, Math.min(10, score));
};

const calculateAgreeableness = (analysis: NlpAnalysisResult): number => {
  let score = 5;
  
  // Keyword analysis with enhanced frequency weighting
  const positiveScore = traitKeywords.agreeableness.positive.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  const negativeScore = traitKeywords.agreeableness.negative.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  score += (positiveScore - negativeScore) * 0.6; // Increased from 0.4 to 0.6
  
  // Sentiment analysis (increased weight)
  score += analysis.sentiment.comparative * 3; // Increased from 2.5 to 3
  
  // Positive/negative word ratio (more nuanced)
  const positiveCount = analysis.sentiment.positive.length;
  const negativeCount = analysis.sentiment.negative.length || 1;
  const ratio = positiveCount / negativeCount;
  score += (ratio - 1) * 1.2; // Increased from 0.8 to 1.2
  
  // Question usage suggests consideration of others (increased weight)
  score += analysis.questionFrequency * 3; // Increased from 2 to 3
  
  // Emotional balance (more weight)
  const emotionalScores = analysis.sentiment.emotionalScores;
  const positiveEmotions = (emotionalScores.joy || 0) + (emotionalScores.surprise || 0);
  const negativeEmotions = (emotionalScores.anger || 0) + (emotionalScores.fear || 0) + (emotionalScores.disgust || 0);
  score += ((positiveEmotions - negativeEmotions) / 4) * 0.8; // Increased from 5 to 4, 0.5 to 0.8
  
  return Math.max(1, Math.min(10, score));
};

const calculateNeuroticism = (analysis: NlpAnalysisResult): number => {
  let score = 5;
  
  // Keyword analysis with enhanced frequency weighting
  const positiveScore = traitKeywords.neuroticism.positive.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  const negativeScore = traitKeywords.neuroticism.negative.reduce((sum, word) => {
    const frequency = analysis.wordFrequencies[word] || 0;
    return sum + (frequency * 0.7); // Increased from 0.5 to 0.7
  }, 0);
  
  score += (negativeScore - positiveScore) * 0.6; // Increased from 0.4 to 0.6
  
  // Sentiment analysis (increased weight)
  score -= analysis.sentiment.comparative * 3; // Increased from 2.5 to 3
  
  // Emotional terms analysis (more comprehensive)
  const emotionalTerms = [
    'worry', 'stress', 'afraid', 'anxious', 'nervous', 'fear', 'sad', 'angry', 'upset',
    'overwhelm', 'panic', 'dread', 'horror', 'terror', 'distress', 'agony', 'misery',
    'tense', 'frustrated', 'irritable', 'moody', 'sensitive', 'vulnerable', 'insecure'
  ];
  const emotionalScore = emotionalTerms.reduce((sum, term) => {
    const frequency = analysis.wordFrequencies[term] || 0;
    return sum + (frequency * 0.8); // Increased from 0.6 to 0.8
  }, 0);
  score += emotionalScore * 0.7; // Increased from 0.5 to 0.7
  
  // Emotional intensity from sentiment analysis (more weight)
  const emotionalScores = analysis.sentiment.emotionalScores;
  const negativeEmotions = (emotionalScores.anger || 0) + (emotionalScores.fear || 0) + 
                          (emotionalScores.sadness || 0) + (emotionalScores.disgust || 0);
  score += Math.min(negativeEmotions / 3, 2); // Increased from 4 to 3, max from 1.5 to 2
  
  // Exclamation usage suggests emotional intensity (increased weight)
  score += analysis.exclamationFrequency * 3; // Increased from 2 to 3
  
  return Math.max(1, Math.min(10, score));
};

/**
 * Extract the most relevant quotes based on sentiment and content
 */
export const extractRelevantQuotes = (text: string, count: number = 3): string[] => {
  // Split into sentences
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  
  if (sentences.length <= count) {
    return sentences;
  }
  
  // Calculate sentiment for each sentence
  interface SentimentItem {
    sentence: string;
    score: number;
  }
  
  const sentimentScores: SentimentItem[] = sentences.map((sentence: string) => ({
    sentence,
    score: sentiment.analyze(sentence).comparative
  }));
  
  // Get some positive and some negative sentences
  const positive = sentimentScores
    .filter((item: SentimentItem) => item.score > 0)
    .sort((a: SentimentItem, b: SentimentItem) => b.score - a.score)
    .slice(0, Math.ceil(count / 2))
    .map((item: SentimentItem) => item.sentence);
    
  const negative = sentimentScores
    .filter((item: SentimentItem) => item.score < 0)
    .sort((a: SentimentItem, b: SentimentItem) => a.score - b.score)
    .slice(0, Math.floor(count / 2))
    .map((item: SentimentItem) => item.sentence);
    
  // If we don't have enough of either type, fill with the other
  if (positive.length + negative.length < count) {
    const neutral = sentimentScores
      .filter((item: SentimentItem) => item.score === 0)
      .slice(0, count - positive.length - negative.length)
      .map((item: SentimentItem) => item.sentence);
      
    return [...positive, ...negative, ...neutral];
  }
  
  return [...positive, ...negative];
};

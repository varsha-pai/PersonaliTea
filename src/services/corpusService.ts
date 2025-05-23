import { PersonalityTrait } from './personalityAnalyzer';

// Define the structure for corpus entries
interface CorpusEntry {
  text: string;
  traits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  category: string;
  description: string;
}

// Predefined corpus of text samples with known personality traits
const personalityCorpus: CorpusEntry[] = [
  {
    text: "I love exploring new ideas and concepts. Every day brings exciting opportunities to learn something different. I'm always curious about how things work and why they are the way they are. Abstract thinking and philosophical discussions really energize me. I enjoy challenging conventional wisdom and thinking outside the box.",
    traits: {
      openness: 9,
      conscientiousness: 6,
      extraversion: 7,
      agreeableness: 6,
      neuroticism: 4
    },
    category: "high_openness",
    description: "Creative and intellectually curious individual who values novelty and exploration"
  },
  {
    text: "I believe in following a structured approach to everything I do. Planning ahead and being organized helps me stay on track. I make detailed to-do lists and stick to my schedule. Deadlines are important to me, and I always deliver on my commitments. I pay attention to details and take pride in doing things thoroughly.",
    traits: {
      openness: 5,
      conscientiousness: 9,
      extraversion: 4,
      agreeableness: 6,
      neuroticism: 3
    },
    category: "high_conscientiousness",
    description: "Methodical and organized individual who values structure and responsibility"
  },
  {
    text: "I really enjoy being around people and socializing. Group activities and team projects are my favorite. I love meeting new people and making connections. I'm energized by social interactions and feel most alive when I'm with others. I'm comfortable speaking up in groups and sharing my thoughts.",
    traits: {
      openness: 7,
      conscientiousness: 5,
      extraversion: 9,
      agreeableness: 7,
      neuroticism: 4
    },
    category: "high_extraversion",
    description: "Outgoing and sociable individual who thrives in social settings"
  },
  {
    text: "I always try to be understanding and considerate of others' feelings. I believe in treating everyone with kindness and respect. I enjoy helping people and making them feel comfortable. I'm good at seeing things from different perspectives and finding common ground. Harmony in relationships is important to me.",
    traits: {
      openness: 6,
      conscientiousness: 6,
      extraversion: 6,
      agreeableness: 9,
      neuroticism: 5
    },
    category: "high_agreeableness",
    description: "Empathetic and cooperative individual who values harmony and understanding"
  },
  {
    text: "I often worry about things and can be quite sensitive to stress. I tend to overthink situations and sometimes feel overwhelmed. My emotions can be intense, and I'm very aware of my feelings. I'm careful about making decisions because I want to avoid potential problems. I appreciate reassurance and support from others.",
    traits: {
      openness: 6,
      conscientiousness: 7,
      extraversion: 4,
      agreeableness: 6,
      neuroticism: 8
    },
    category: "high_neuroticism",
    description: "Emotionally sensitive individual who experiences feelings deeply"
  },
  {
    text: "I prefer familiar routines and traditional approaches. I like things to be practical and straightforward. I'm not really into abstract theories or unconventional ideas. I value stability and prefer to stick with what I know works. I'm more comfortable with concrete facts than speculative concepts.",
    traits: {
      openness: 3,
      conscientiousness: 7,
      extraversion: 5,
      agreeableness: 6,
      neuroticism: 4
    },
    category: "low_openness",
    description: "Practical and conventional individual who prefers familiarity and tradition"
  },
  {
    text: "I like to keep things flexible and spontaneous. I don't need strict schedules or detailed plans. I'm comfortable going with the flow and adapting to changes. I prefer a relaxed approach to tasks and deadlines. I'm not too concerned about perfect organization or meticulous details.",
    traits: {
      openness: 7,
      conscientiousness: 3,
      extraversion: 6,
      agreeableness: 6,
      neuroticism: 4
    },
    category: "low_conscientiousness",
    description: "Spontaneous and flexible individual who prefers a relaxed approach"
  },
  {
    text: "I enjoy my own company and prefer quiet environments. I need time alone to recharge and process my thoughts. I'm comfortable with silence and don't feel the need to always be social. I prefer deep one-on-one conversations over large group settings. I'm selective about my social interactions.",
    traits: {
      openness: 6,
      conscientiousness: 6,
      extraversion: 3,
      agreeableness: 6,
      neuroticism: 4
    },
    category: "low_extraversion",
    description: "Introspective and reserved individual who values solitude and meaningful connections"
  },
  {
    text: "I believe in being direct and honest in my communication. I value logical thinking and objective analysis. I'm comfortable with healthy debate and constructive criticism. I focus on facts and solutions rather than emotions. I prefer straightforward interactions over excessive politeness.",
    traits: {
      openness: 6,
      conscientiousness: 7,
      extraversion: 5,
      agreeableness: 3,
      neuroticism: 4
    },
    category: "low_agreeableness",
    description: "Direct and analytical individual who values honesty and logical thinking"
  },
  {
    text: "I generally stay calm under pressure and don't get easily stressed. I'm emotionally stable and don't experience intense mood swings. I take things in stride and maintain my composure in challenging situations. I'm confident in my ability to handle difficulties. I don't worry excessively about things.",
    traits: {
      openness: 6,
      conscientiousness: 6,
      extraversion: 5,
      agreeableness: 6,
      neuroticism: 2
    },
    category: "low_neuroticism",
    description: "Emotionally stable individual who maintains composure under pressure"
  }
];

// Calculate similarity between two texts using cosine similarity
const calculateCosineSimilarity = (text1: string, text2: string): number => {
  // Convert texts to word frequency vectors
  const getWordFrequencies = (text: string): Record<string, number> => {
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
    const frequencies: Record<string, number> = {};
    words.forEach(word => {
      frequencies[word] = (frequencies[word] || 0) + 1;
    });
    return frequencies;
  };

  const vec1 = getWordFrequencies(text1);
  const vec2 = getWordFrequencies(text2);

  // Get all unique words
  const allWords = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  allWords.forEach(word => {
    const freq1 = vec1[word] || 0;
    const freq2 = vec2[word] || 0;
    dotProduct += freq1 * freq2;
    magnitude1 += freq1 * freq1;
    magnitude2 += freq2 * freq2;
  });

  // Calculate cosine similarity
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
};

// Find the most similar corpus entries to the input text
const findSimilarEntries = (inputText: string, count: number = 3): CorpusEntry[] => {
  const similarities = personalityCorpus.map(entry => ({
    entry,
    similarity: calculateCosineSimilarity(inputText, entry.text)
  }));

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)
    .map(item => item.entry);
};

// Calculate weighted average of traits based on similarity scores
const calculateWeightedTraits = (inputText: string): Record<string, number> => {
  const similarEntries = findSimilarEntries(inputText, 5);
  
  const weights = similarEntries.map(entry => 
    calculateCosineSimilarity(inputText, entry.text)
  );
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = weights.map(weight => weight / totalWeight);
  
  const traits = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };
  
  similarEntries.forEach((entry, index) => {
    const weight = normalizedWeights[index];
    traits.openness += entry.traits.openness * weight;
    traits.conscientiousness += entry.traits.conscientiousness * weight;
    traits.extraversion += entry.traits.extraversion * weight;
    traits.agreeableness += entry.traits.agreeableness * weight;
    traits.neuroticism += entry.traits.neuroticism * weight;
  });
  
  // Round to 1 decimal place
  Object.keys(traits).forEach(trait => {
    traits[trait as keyof typeof traits] = Math.round(traits[trait as keyof typeof traits] * 10) / 10;
  });
  
  return traits;
};

// Get personality analysis based on corpus comparison
export const analyzePersonalityWithCorpus = (text: string): {
  traits: Record<string, number>;
  similarProfiles: CorpusEntry[];
} => {
  const traits = calculateWeightedTraits(text);
  const similarProfiles = findSimilarEntries(text, 3);
  
  return {
    traits,
    similarProfiles
  };
}; 
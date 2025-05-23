// Mock data for personality analysis results
// In a real app, this would come from an AI model or API

interface PersonalityTrait {
  name: string;
  value: number;
  description: string;
}

interface PersonalityResult {
  summary: string;
  traits: PersonalityTrait[];
  evidenceQuotes: string[];
  recommendations: string[];
}

// Helper function to extract quotes from text
const extractQuotes = (text: string, count: number = 3): string[] => {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  // Filter for sentences that might be meaningful (longer than 20 chars)
  const meaningful = sentences.filter(s => s.trim().length > 20);
  
  // Return random selection
  return meaningful.length > 0 
    ? meaningful
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(count, meaningful.length))
        .map(s => s.trim())
    : ["Not enough text to extract meaningful quotes."];
};

export const mockPersonalityAnalysis = (type: string, text: string): PersonalityResult => {
  const models: Record<string, PersonalityResult> = {
    organized: {
      summary: "This person demonstrates strong organizational tendencies with a methodical approach to tasks and communication. They value structure, planning, and clear processes. Their messages reflect attention to detail and a preference for order. They likely excel in environments where systems and predictability are important.",
      traits: [
        { name: "Organization", value: 9, description: "High preference for order and structure" },
        { name: "Conscientiousness", value: 8, description: "Careful and diligent in tasks and responsibilities" },
        { name: "Planning", value: 9, description: "Strong tendency to plan ahead and prepare" },
        { name: "Adaptability", value: 5, description: "Moderate ability to adapt to unexpected changes" },
        { name: "Impulsivity", value: 3, description: "Low tendency to act on impulse without planning" }
      ],
      evidenceQuotes: extractQuotes(text, 3),
      recommendations: [
        "When communicating with this person, provide clear structures and timelines",
        "They appreciate detailed plans and advance notice of changes",
        "Recognize their organizational abilities and attention to detail",
        "Help them develop flexibility for unexpected situations"
      ]
    },
    empathetic: {
      summary: "This person shows a high degree of empathy and emotional intelligence. Their communication style is warm, supportive, and focused on understanding others' feelings. They likely forge strong interpersonal connections and are attuned to emotional undercurrents in conversations. They value harmony and emotional well-being in their interactions.",
      traits: [
        { name: "Empathy", value: 9, description: "Strong ability to understand others' emotions" },
        { name: "Emotional Intelligence", value: 8, description: "Skilled at recognizing and managing emotions" },
        { name: "Compassion", value: 8, description: "High concern for others' wellbeing" },
        { name: "Assertiveness", value: 4, description: "Moderate ability to express own needs" },
        { name: "Analytical Thinking", value: 5, description: "Balanced emotional and logical reasoning" }
      ],
      evidenceQuotes: extractQuotes(text, 3),
      recommendations: [
        "Appeal to their emotional intelligence and empathy in communications",
        "Acknowledge their feelings and emotional perspective",
        "Leverage their ability to understand others in group settings",
        "Help them balance emotional responses with analytical thinking when needed"
      ]
    },
    analytical: {
      summary: "This person exhibits strong analytical thinking patterns with a logical, systematic approach to communication. They focus on facts, evidence, and rational analysis rather than emotions. Their messages suggest a preference for clear reasoning and objective data. They likely excel in problem-solving and critical thinking scenarios.",
      traits: [
        { name: "Analytical Thinking", value: 9, description: "Strong logical reasoning abilities" },
        { name: "Detail Orientation", value: 8, description: "High attention to specific details and facts" },
        { name: "Critical Thinking", value: 8, description: "Skilled at evaluating information objectively" },
        { name: "Emotional Expression", value: 3, description: "Limited expression of feelings in communication" },
        { name: "Creative Thinking", value: 5, description: "Moderate ability to think outside conventional patterns" }
      ],
      evidenceQuotes: extractQuotes(text, 3),
      recommendations: [
        "Provide data and logical reasoning in communications",
        "Focus on facts rather than emotional appeals",
        "Recognize their analytical abilities and problem-solving skills",
        "Encourage development of emotional intelligence to complement analytical strengths"
      ]
    },
    extroverted: {
      summary: "This person demonstrates strong extroverted tendencies with an energetic, sociable communication style. They appear comfortable in social settings and likely draw energy from interactions with others. Their messages suggest enthusiasm, expressiveness, and a preference for group activities over solitary pursuits.",
      traits: [
        { name: "Sociability", value: 9, description: "Highly comfortable and energized in social settings" },
        { name: "Expressiveness", value: 8, description: "Open communication of thoughts and feelings" },
        { name: "Energy", value: 8, description: "High level of enthusiasm and activity" },
        { name: "Reflection", value: 4, description: "Moderate tendency for introspection" },
        { name: "Independence", value: 5, description: "Balanced need for social connection and autonomy" }
      ],
      evidenceQuotes: extractQuotes(text, 3),
      recommendations: [
        "Engage in interactive, dynamic communication styles",
        "Provide opportunities for social interaction and discussion",
        "Recognize their ability to energize groups and facilitate connections",
        "Help them develop reflective practices to complement their social energy"
      ]
    },
    default: {
      summary: "Based on the provided messages, this person shows a balanced personality profile with mixed traits. Their communication style is versatile, showing elements of both analytical thinking and emotional awareness. They appear adaptable to different situations and contexts, able to shift between practical problem-solving and interpersonal connection as needed.",
      traits: [
        { name: "Adaptability", value: 7, description: "Good ability to adjust to different situations" },
        { name: "Conscientiousness", value: 6, description: "Reliable and moderately organized" },
        { name: "Openness", value: 6, description: "Moderately receptive to new ideas and experiences" },
        { name: "Extraversion", value: 5, description: "Balanced social energy and independence" },
        { name: "Emotional Stability", value: 6, description: "Generally stable emotional responses" }
      ],
      evidenceQuotes: extractQuotes(text, 3),
      recommendations: [
        "Use a balanced approach that combines logical and emotional elements",
        "Recognize their versatility in different communication contexts",
        "Adapt your style based on the specific situation at hand",
        "Help them develop awareness of their adaptable communication patterns"
      ]
    }
  };
  
  return models[type] || models.default;
};

import { analyzeText, mapNlpToPersonalityTraits, extractRelevantQuotes } from './nlpService';
import { analyzePersonalityWithCorpus } from './corpusService';

export interface PersonalityTrait {
  name: string;
  value: number;
  description: string;
}

interface PersonalityResult {
  summary: string;
  traits: PersonalityTrait[];
  evidenceQuotes: string[];
  recommendations: string[];
  similarProfiles?: Array<{
    category: string;
    description: string;
  }>;
}

// Description templates for each trait level
const traitDescriptions = {
  openness: [
    "Shows very conventional thinking and preferences for the familiar.",
    "Tends to be practical with narrow interests and traditional approaches.",
    "Balances tradition and novelty, with moderate curiosity about new experiences.",
    "Displays curiosity and appreciation for diverse ideas and experiences.",
    "Highly creative and intellectually curious with love for novelty and exploration."
  ],
  conscientiousness: [
    "Very spontaneous with a casual approach to goals and obligations.",
    "Somewhat disorganized and may procrastinate on important tasks.",
    "Moderately organized with a balanced approach to work and leisure.",
    "Reliable and organized with clear goals and structured approach to tasks.",
    "Extremely methodical, disciplined and goal-oriented with attention to details."
  ],
  extraversion: [
    "Strongly prefers solitude and finds social interaction draining.",
    "Tends to be reserved and values time alone over social gatherings.",
    "Balances social time and solitude with moderate engagement in groups.",
    "Socially confident and energetic, enjoying interaction and group activities.",
    "Highly outgoing and enthusiastic with a preference for being around others."
  ],
  agreeableness: [
    "Very direct and challenging, prioritizing honesty over harmony.",
    "Somewhat skeptical of others' motives with a competitive approach.",
    "Balanced between cooperation and self-interest in relationships.",
    "Generally warm, trusting and cooperative in interpersonal relations.",
    "Extremely empathetic and cooperative, prioritizing others' needs."
  ],
  neuroticism: [
    "Exceptionally calm and emotionally stable even under stress.",
    "Generally relaxed with resilience to most everyday stressors.",
    "Moderate emotional reactions with typical ups and downs.",
    "Tends to experience stress and worry more readily than average.",
    "Highly sensitive to stress with frequent experience of negative emotions."
  ]
};

/**
 * Generates personality profile recommendations based on trait analysis
 */
const generateRecommendations = (traits: Record<string, number>): string[] => {
  const recommendations: string[] = [];
  
  // Openness recommendations
  if (traits.openness >= 7) {
    recommendations.push("Engage this person with new ideas and creative projects that challenge conventional thinking.");
  } else if (traits.openness <= 4) {
    recommendations.push("Present information in familiar formats and connect new ideas to established concepts.");
  }
  
  // Conscientiousness recommendations
  if (traits.conscientiousness >= 7) {
    recommendations.push("Provide clear timelines and structured plans when collaborating with this person.");
  } else if (traits.conscientiousness <= 4) {
    recommendations.push("Set gentle reminders and break complex tasks into smaller actionable steps.");
  }
  
  // Extraversion recommendations
  if (traits.extraversion >= 7) {
    recommendations.push("Create opportunities for social interaction and collaborative discussion.");
  } else if (traits.extraversion <= 4) {
    recommendations.push("Respect their need for personal space and provide time to process information privately.");
  }
  
  // Agreeableness recommendations
  if (traits.agreeableness >= 7) {
    recommendations.push("Acknowledge their supportive nature and approach disagreements with sensitivity.");
  } else if (traits.agreeableness <= 4) {
    recommendations.push("Be direct and factual in communication, focusing on logical arguments rather than emotional appeals.");
  }
  
  // Neuroticism recommendations
  if (traits.neuroticism >= 7) {
    recommendations.push("Provide reassurance and clear expectations to reduce uncertainty and anxiety.");
  } else if (traits.neuroticism <= 4) {
    recommendations.push("Leverage their emotional stability for situations requiring calm under pressure.");
  }
  
  // General recommendation
  recommendations.push("Adapt communication style to match their personality preferences for more effective interaction.");
  
  return recommendations;
};

/**
 * Generates a personality summary based on trait analysis
 */
const generatePersonalitySummary = (traits: Record<string, number>): string => {
  // Start with a more varied introduction
  const introductions = [
    "Based on the analysis of their communication style, this person",
    "The text analysis reveals that this individual",
    "Looking at their writing patterns, this person",
    "From analyzing their communication, this individual",
    "The personality assessment indicates that this person"
  ];
  let summary = introductions[Math.floor(Math.random() * introductions.length)] + " ";
  
  // Get dominant traits (reduced threshold for more sensitivity)
  const dominantTraits = Object.entries(traits)
    .filter(([_, score]) => Math.abs(score - 5) >= 1.5) // Reduced from 2 to 1.5
    .sort((a, b) => Math.abs(b[1] - 5) - Math.abs(a[1] - 5));
  
  // Get trait descriptors based on actual scores with more granularity
  const getTraitDescriptor = (trait: string, score: number): string => {
    const intensity = Math.abs(score - 5) / 5; // 0 to 1 scale for intensity
    const isHigh = score > 5;
    
    switch (trait) {
      case 'openness':
        if (isHigh) {
          if (intensity > 0.8) return "demonstrates exceptional creativity and intellectual curiosity";
          if (intensity > 0.6) return "shows strong appreciation for new ideas and experiences";
          if (intensity > 0.4) return "displays moderate openness to new perspectives";
          return "shows some interest in exploring new concepts";
        } else {
          if (intensity > 0.8) return "strongly prefers familiar and conventional approaches";
          if (intensity > 0.6) return "tends to favor practical and established methods";
          if (intensity > 0.4) return "shows some preference for traditional approaches";
          return "leans towards familiar ways of thinking";
        }
      case 'conscientiousness':
        if (isHigh) {
          if (intensity > 0.8) return "exhibits exceptional organization and attention to detail";
          if (intensity > 0.6) return "shows strong planning and methodical tendencies";
          if (intensity > 0.4) return "demonstrates reliable and structured behavior";
          return "tends to be organized and systematic";
        } else {
          if (intensity > 0.8) return "prefers a highly flexible and spontaneous approach";
          if (intensity > 0.6) return "tends to be more casual and adaptable";
          if (intensity > 0.4) return "shows some preference for informal methods";
          return "leans towards a relaxed approach";
        }
      case 'extraversion':
        if (isHigh) {
          if (intensity > 0.8) return "is highly energetic and socially engaging";
          if (intensity > 0.6) return "shows strong enthusiasm for social interaction";
          if (intensity > 0.4) return "demonstrates moderate social confidence";
          return "tends to be outgoing and sociable";
        } else {
          if (intensity > 0.8) return "prefers quiet reflection and independent work";
          if (intensity > 0.6) return "tends to be more reserved in social settings";
          if (intensity > 0.4) return "shows some preference for solitary activities";
          return "leans towards introspective behavior";
        }
      case 'agreeableness':
        if (isHigh) {
          if (intensity > 0.8) return "demonstrates exceptional empathy and cooperation";
          if (intensity > 0.6) return "shows strong consideration for others' perspectives";
          if (intensity > 0.4) return "tends to be supportive and understanding";
          return "shows a cooperative nature";
        } else {
          if (intensity > 0.8) return "prefers direct and analytical communication";
          if (intensity > 0.6) return "tends to be more objective and straightforward";
          if (intensity > 0.4) return "shows some preference for factual discussion";
          return "leans towards direct communication";
        }
      case 'neuroticism':
        if (isHigh) {
          if (intensity > 0.8) return "shows high emotional sensitivity and reactivity";
          if (intensity > 0.6) return "tends to experience emotions more intensely";
          if (intensity > 0.4) return "demonstrates some emotional expressiveness";
          return "shows emotional awareness";
        } else {
          if (intensity > 0.8) return "exhibits exceptional emotional stability";
          if (intensity > 0.6) return "shows strong resilience to stress";
          if (intensity > 0.4) return "tends to maintain emotional balance";
          return "demonstrates emotional composure";
        }
      default:
        return "";
    }
  };
  
  // Build the main description with more natural language
  if (dominantTraits.length > 0) {
    const descriptors = dominantTraits.map(([trait, score]) => 
      getTraitDescriptor(trait, score)
    );
    
    // Combine descriptors with varied conjunctions
    const conjunctions = ["and", "while also", "as well as", "along with", "in addition to"];
    if (descriptors.length === 1) {
      summary += descriptors[0];
    } else if (descriptors.length === 2) {
      summary += descriptors[0] + " " + conjunctions[Math.floor(Math.random() * conjunctions.length)] + " " + descriptors[1];
    } else {
      const lastDescriptor = descriptors.pop();
      const conjunction = conjunctions[Math.floor(Math.random() * conjunctions.length)];
      summary += descriptors.join(", ") + ", " + conjunction + " " + lastDescriptor;
    }
  } else {
    const balancedDescriptions = [
      "shows a balanced personality profile with no extreme traits",
      "demonstrates a well-rounded personality with moderate expression of traits",
      "presents a balanced approach to different aspects of personality",
      "shows adaptability across different personality dimensions",
      "exhibits a harmonious blend of personality characteristics"
    ];
    summary += balancedDescriptions[Math.floor(Math.random() * balancedDescriptions.length)];
  }
  
  summary += ". ";
  
  // Add behavioral insights based on trait combinations with more nuance
  const addBehavioralInsight = () => {
    const insights: string[] = [];
    
    // Openness + Extraversion combinations
    if (traits.openness >= 6.5 && traits.extraversion >= 6.5) {
      insights.push("They likely thrive in dynamic environments where they can explore new ideas while engaging with others");
    } else if (traits.openness >= 6.5 && traits.extraversion <= 3.5) {
      insights.push("They may prefer to explore new concepts independently before sharing their insights");
    } else if (traits.openness <= 3.5 && traits.extraversion >= 6.5) {
      insights.push("They excel at social interaction while preferring familiar topics and approaches");
    }
  
    // Conscientiousness + Neuroticism combinations
    if (traits.conscientiousness >= 6.5 && traits.neuroticism >= 6.5) {
      insights.push("Their attention to detail and planning may be driven by a desire to maintain control and reduce uncertainty");
    } else if (traits.conscientiousness >= 6.5 && traits.neuroticism <= 3.5) {
      insights.push("They approach tasks with calm confidence and systematic precision");
    } else if (traits.conscientiousness <= 3.5 && traits.neuroticism >= 6.5) {
      insights.push("They may experience stress when faced with unstructured situations");
    }
  
    // Agreeableness + Extraversion combinations
    if (traits.agreeableness >= 6.5 && traits.extraversion >= 6.5) {
      insights.push("They excel at building and maintaining harmonious relationships in group settings");
    } else if (traits.agreeableness >= 6.5 && traits.extraversion <= 3.5) {
      insights.push("They express their caring nature through thoughtful actions rather than overt social interaction");
    } else if (traits.agreeableness <= 3.5 && traits.extraversion >= 6.5) {
      insights.push("They engage actively in social settings while maintaining analytical distance");
    }
  
    // Openness + Conscientiousness combinations
    if (traits.openness >= 6.5 && traits.conscientiousness <= 3.5) {
      insights.push("They may prefer creative freedom over structured approaches to tasks");
    } else if (traits.openness <= 3.5 && traits.conscientiousness >= 6.5) {
      insights.push("They excel in environments with clear procedures and established methods");
    } else if (traits.openness >= 6.5 && traits.conscientiousness >= 6.5) {
      insights.push("They combine creativity with systematic implementation of ideas");
    }
  
    // Neuroticism + Agreeableness combinations
    if (traits.neuroticism >= 6.5 && traits.agreeableness >= 6.5) {
      insights.push("Their emotional sensitivity often translates into deep empathy for others");
    } else if (traits.neuroticism <= 3.5 && traits.agreeableness >= 6.5) {
      insights.push("They maintain emotional stability while being highly considerate of others");
    } else if (traits.neuroticism >= 6.5 && traits.agreeableness <= 3.5) {
      insights.push("They may experience intense emotions while maintaining analytical objectivity");
    }
    
    // Add the most relevant insight
    if (insights.length > 0) {
      const insight = insights[Math.floor(Math.random() * insights.length)];
      summary += insight + ". ";
    }
  };
  
  addBehavioralInsight();
  
  // Add communication style recommendation with more variety
  const communicationIntros = [
    "In terms of communication preferences, they",
    "When it comes to communication style, they",
    "Their communication approach suggests they",
    "In their interactions, they",
    "Their preferred communication style indicates they"
  ];
  summary += communicationIntros[Math.floor(Math.random() * communicationIntros.length)] + " ";
  
  const getCommunicationStyle = () => {
    const styles: string[] = [];
  
    if (traits.extraversion >= 6.5) {
      styles.push("prefer interactive and engaging discussions");
    } else if (traits.extraversion <= 3.5) {
      styles.push("appreciate time to process information and respond thoughtfully");
    }
    
    if (traits.openness >= 6.5) {
      styles.push("enjoy exploring abstract concepts and possibilities");
    } else if (traits.openness <= 3.5) {
      styles.push("respond well to concrete examples and practical applications");
    }
    
    if (traits.conscientiousness >= 6.5) {
      styles.push("value clear structure and specific details");
    } else if (traits.conscientiousness <= 3.5) {
      styles.push("prefer flexible approaches and high-level overviews");
    }
    
    if (traits.agreeableness >= 6.5) {
      styles.push("appreciate a supportive and collaborative tone");
    } else if (traits.agreeableness <= 3.5) {
      styles.push("prefer direct and objective communication");
    }
    
    if (traits.neuroticism >= 6.5) {
      styles.push("may need reassurance and clear expectations");
    } else if (traits.neuroticism <= 3.5) {
      styles.push("handle pressure well and maintain composure in challenging situations");
    }
    
    return styles.length > 0 ? styles[Math.floor(Math.random() * styles.length)] : "adapt well to various communication styles";
  };
  
  summary += getCommunicationStyle() + ".";
  
  return summary;
};

/**
 * Analyzes text to determine personality traits using corpus-based analysis
 */
export const analyzePersonality = async (text: string): Promise<PersonalityResult> => {
  // Apply corpus-based analysis
  const { traits, similarProfiles } = analyzePersonalityWithCorpus(text);
  
  // Format traits for display
  const formattedTraits: PersonalityTrait[] = [
    {
      name: "Openness",
      value: traits.openness,
      description: getTraitDescription("openness", traits.openness)
    },
    {
      name: "Conscientiousness",
      value: traits.conscientiousness,
      description: getTraitDescription("conscientiousness", traits.conscientiousness)
    },
    {
      name: "Extraversion",
      value: traits.extraversion,
      description: getTraitDescription("extraversion", traits.extraversion)
    },
    {
      name: "Agreeableness",
      value: traits.agreeableness,
      description: getTraitDescription("agreeableness", traits.agreeableness)
    },
    {
      name: "Neuroticism",
      value: traits.neuroticism,
      description: getTraitDescription("neuroticism", traits.neuroticism)
    }
  ];
  
  // Extract relevant quotes from text
  const evidenceQuotes = extractRelevantQuotes(text);
  
  // Generate recommendations
  const recommendations = generateRecommendations(traits);
  
  // Generate overall summary
  const summary = generatePersonalitySummary(traits);
  
  // Format similar profiles
  const formattedSimilarProfiles = similarProfiles.map(profile => ({
    category: profile.category,
    description: profile.description
  }));
  
  // Simulate API call delay for a better user experience
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    summary,
    traits: formattedTraits,
    evidenceQuotes,
    recommendations,
    similarProfiles: formattedSimilarProfiles
  };
};

/**
 * Get description for trait based on score
 */
const getTraitDescription = (trait: string, score: number): string => {
  const index = Math.min(Math.floor(score / 2), 4);
  return traitDescriptions[trait as keyof typeof traitDescriptions][index];
};

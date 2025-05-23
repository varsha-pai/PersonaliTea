import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Brain, Check, Quote, Upload } from 'lucide-react';
import { analyzePersonality } from '../services/personalityAnalyzer';

interface PersonalityTrait {
  name: string;
  value: number;
  description: string;
}

interface SimilarProfile {
  category: string;
  description: string;
}

interface PersonalityResult {
  summary: string;
  traits: PersonalityTrait[];
  evidenceQuotes: string[];
  recommendations: string[];
  similarProfiles?: SimilarProfile[];
}

const Results = () => {
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const analyzedText = localStorage.getItem('analyzedText');
    
    if (!analyzedText) {
      navigate('/upload');
      return;
    }
    
    const performAnalysis = async () => {
      try {
        setIsLoading(true);
        const analysisResult = await analyzePersonality(analyzedText);
        setResult(analysisResult);
      } catch (err) {
        console.error('Error analyzing personality:', err);
        setError('Failed to analyze personality. Please try again with different messages.');
      } finally {
        setIsLoading(false);
      }
    };
    
    performAnalysis();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full animate-ping bg-[#a3bce0] opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain size={32} className="text-[#a3bce0]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Analyzing Personality</h2>
        <p className="text-gray-600 max-w-md text-center">
          Our AI is processing the messages to identify personality traits. This may take a moment...
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center my-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Analysis Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/upload')}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!result) return null;
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <button 
            onClick={() => navigate('/upload')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back to Upload</span>
          </button>
          
          <h1 className="text-3xl font-bold mb-2">Personality Analysis Results</h1>
          <p className="text-gray-600">
            Based on the messages provided, here's our assessment of this person's personality
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-gray-700">{result.summary}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Personality Traits</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.traits}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar
                  name="Traits"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
          <div className="space-y-4">
            {result.traits.map((trait) => (
              <div key={trait.name} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{trait.name}</h3>
                  <span className="text-sm text-gray-500">{trait.value.toFixed(1)}/10</span>
                </div>
                <p className="text-gray-600 text-sm">{trait.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {result.similarProfiles && result.similarProfiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Similar Personality Profiles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {result.similarProfiles.map((profile, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2 capitalize">
                    {profile.category.replace('_', ' ')}
                  </h3>
                  <p className="text-gray-600 text-sm">{profile.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Quote size={20} />
            Supporting Evidence
          </h2>
          <div className="space-y-4">
            {result.evidenceQuotes.map((quote, index) => (
              <blockquote key={index} className="border-l-4 border-indigo-500 pl-4 italic text-gray-600">
                "{quote}"
              </blockquote>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Check size={20} />
            Recommendations
          </h2>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span className="text-gray-600">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/upload')}
            className="btn-secondary flex items-center gap-2 mx-auto"
          >
            <Upload size={16} />
            Analyze Another Person
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChartBar, FileText, FileUp, Upload, UserRound } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col gap-12">
      <section className="text-center my-8">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#a3bce0] to-[#f2c4de] inline-block text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Personalities Hidden in Messages
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Upload text messages, Text files to uncover personality traits using advanced AI analysis.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/upload" className="btn-primary flex items-center gap-2 mx-auto w-fit">
            <Upload size={16} />
            Start Analyzing
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<FileUp className="text-[#a3bce0]" size={28} />}
          title="Easy Upload"
          description="Simply drag and drop files in various formats - text, PDF, documents, or images."
          delay={0.1}
        />
        <FeatureCard 
          icon={<FileText className="text-[#f2c4de]" size={28} />}
          title="Text Analysis"
          description="Our AI extracts and processes text from your files to identify personality patterns."
          delay={0.2}
        />
        <FeatureCard 
          icon={<ChartBar className="text-[#ffdfd3]" size={28} />}
          title="Personality Insights"
          description="Get detailed reports on personality traits supported by message evidence."
          delay={0.3}
        />
      </section>

      <section className="bg-white rounded-3xl p-8 shadow-sm mt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">How It Works</h2>
          <p className="text-gray-600">Follow these simple steps to analyze personality traits</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard 
            number={1}
            title="Upload Messages"
            description="Upload files containing messages from the person you want to analyze."
            delay={0.1}
          />
          <StepCard 
            number={2}
            title="AI Processing"
            description="Our advanced AI analyzes language patterns, word choice, and expression style."
            delay={0.2}
          />
          <StepCard 
            number={3}
            title="Review Results"
            description="Get detailed insights into personality traits with visual representations."
            delay={0.3}
          />
        </div>
      </section>

      <section className="text-center my-8">
        <motion.div
          className="card max-w-2xl mx-auto py-8 bg-gradient-to-br from-[#f9fafc] to-[#f1f5fb]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <UserRound size={48} className="mx-auto mb-4 text-[#a3bce0]" />
          <h2 className="text-2xl font-bold mb-2">Ready to Discover Personality Traits?</h2>
          <p className="text-gray-600 mb-6">Gain insights into communication styles, preferences, and behavior patterns.</p>
          <Link to="/upload" className="btn-secondary flex items-center gap-2 mx-auto w-fit">
            Start Now
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div 
      className="card h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const StepCard = ({ number, title, description, delay }: StepCardProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a3bce0] to-[#f2c4de] flex items-center justify-center text-white font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Home;

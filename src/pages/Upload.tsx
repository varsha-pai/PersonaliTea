import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, FileUp, Loader, Upload, X } from 'lucide-react';
import { processFileContents } from '../services/fileProcessor';

interface FileWithPreview extends File {
  preview?: string;
}

const UploadPage = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: file.type.startsWith('image/') 
          ? URL.createObjectURL(file)
          : undefined
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10485760, // 10MB
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 10MB.');
      } else {
        setError('Invalid file type. Please upload text, txt files.');
      }
    }
  });

  const removeFile = (index: number) => {
    setFiles(files => {
      const newFiles = [...files];
      const file = newFiles[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please add at least one file to analyze.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const textContents = await Promise.all(
        files.map(file => processFileContents(file))
      );

      const allText = textContents.join('\n\n');
      
      // Store extracted text in localStorage
      localStorage.setItem('analyzedText', allText);
      
      // Navigate to results page
      navigate('/results');
    } catch (err) {
      console.error('Error processing files:', err);
      setError('Failed to process files. Please try again with different files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Upload Messages</h1>
        <p className="text-gray-600 mb-8 text-center">
          Upload files containing messages to analyze the personality traits
        </p>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-[#a3bce0] bg-[#f0f4fa]' : 'border-gray-300 hover:border-[#a3bce0]'}`}
        >
          <input {...getInputProps()} />
          <Upload 
            size={48} 
            className={`mx-auto mb-4 ${isDragActive ? 'text-[#a3bce0]' : 'text-gray-400'}`} 
          />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            or click to browse files
          </p>
          <p className="text-xs text-gray-400">
            Accepts: TXT (Max 10MB)
          </p>
        </div>

        {error && (
          <motion.div 
            className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <X size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {files.length > 0 && (
          <div className="mb-8">
            <h3 className="font-medium mb-3">Selected Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <motion.div 
                  key={`${file.name}-${index}`}
                  className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    {file.type.startsWith('image/') ? (
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                        {file.preview && <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-[#f0f4fa] flex items-center justify-center flex-shrink-0">
                        {file.type === 'application/pdf' ? (
                          <FileText size={18} className="text-[#e67e73]" />
                        ) : file.type.includes('word') ? (
                          <FileText size={18} className="text-[#4b8ff8]" />
                        ) : (
                          <FileText size={18} className="text-[#a3bce0]" />
                        )}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.type.split('/')[1]?.toUpperCase() || 'Unknown'} · {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button 
            onClick={handleUpload}
            disabled={files.length === 0 || isProcessing}
            className={`btn-primary flex items-center gap-2 ${
              (files.length === 0 || isProcessing) 
                ? 'opacity-60 cursor-not-allowed' 
                : ''
            }`}
          >
            {isProcessing ? (
              <>
                <Loader size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileUp size={16} />
                Analyze Personality
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadPage;

// Import Tesseract for OCR
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Processes file contents and extracts text based on file type
 */
export const processFileContents = async (file: File): Promise<string> => {
  const fileType = file.type;
  
  // Process based on file type
  if (fileType === 'text/plain') {
    return readTextFile(file);
  } else if (fileType === 'application/pdf') {
    return extractTextFromPDF(file);
  } else if (fileType.includes('word') || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // For simplicity, we're not implementing a full Word document parser
    // In a production app, you would use a proper library for this
    return "Text extraction from Word documents not fully implemented in this demo. Please convert to PDF or text.";
  } else if (fileType.startsWith('image/')) {
    return extractTextFromImage(file);
  }
  
  throw new Error(`Unsupported file type: ${fileType}`);
};

/**
 * Reads text from a plain text file
 */
const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read text file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading text file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Extracts text from a PDF file using PDF.js
 */
const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        try {
          const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
          
          let fullText = '';
          
          // Extract text from each page
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (error) {
          console.error('PDF parsing error:', error);
          reject(new Error('Failed to extract text from PDF'));
        }
      } else {
        reject(new Error('Failed to read PDF file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading PDF file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extracts text from an image using OCR
 */
const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    const { data } = await Tesseract.recognize(file, 'eng');
    return data.text;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to extract text from image');
  }
};

const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class OCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
  }

  // Initialize OCR worker
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔄 Initializing OCR worker...');
      this.worker = await createWorker('eng');
      this.isInitialized = true;
      console.log('✅ OCR service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize OCR service:', error);
      throw error;
    }
  }

  // Preprocess image for better OCR results
  async preprocessImage(inputPath, outputPath) {
    try {
      await sharp(inputPath)
        .greyscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      // Return original path if preprocessing fails
      return inputPath;
    }
  }

  // Extract text from PDF
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      
      return {
        text: data.text,
        confidence: 95, // PDFs generally have high confidence
        method: 'pdf-parse'
      };
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  // Extract text from image using OCR
  async extractTextFromImage(filePath) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log(`🔍 Processing image: ${filePath}`);

      // Preprocess image
      const preprocessedPath = filePath.replace(/\.[^/.]+$/, '_processed.png');
      const processedImagePath = await this.preprocessImage(filePath, preprocessedPath);

      console.log(`📝 Performing OCR...`);

      // Perform OCR
      const { data: { text, confidence } } = await this.worker.recognize(processedImagePath);

      // Clean up preprocessed image
      if (processedImagePath !== filePath && fs.existsSync(processedImagePath)) {
        fs.unlinkSync(processedImagePath);
      }

      console.log(`✅ OCR completed with confidence: ${confidence}%`);
      console.log(`📄 Extracted text preview: ${text.substring(0, 200)}...`);

      return {
        text: text.trim(),
        confidence: confidence,
        method: 'tesseract-ocr'
      };
    } catch (error) {
      console.error('❌ Image OCR failed:', error);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  }

  // Main method to extract text from any supported file
  async extractText(filePath, fileType) {
    try {
      const startTime = Date.now();
      let result;

      if (fileType === 'application/pdf') {
        result = await this.extractTextFromPDF(filePath);
      } else if (fileType.startsWith('image/')) {
        result = await this.extractTextFromImage(filePath);
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        processingTime,
        filePath,
        fileType
      };
    } catch (error) {
      console.error('Text extraction failed:', error);
      throw error;
    }
  }

  // Parse extracted text to structured soil data
  parseTextToSoilData(text) {
    console.log('🔍 Raw extracted text:', text);
    console.log('📏 Text length:', text.length);

    const soilData = {
      parameters: [],
      extractedCount: 0,
      rawText: text
    };

    // Clean and normalize text
    const cleanText = text
      .replace(/[^\w\s\d\.\-:=()%\/]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b(\d+)\s*\.\s*(\d+)\b/g, '$1.$2') // Fix separated decimals like "6 . 5" -> "6.5"
      .replace(/\b(\d+)\s*,\s*(\d+)\b/g, '$1.$2') // Convert comma decimals "6,5" -> "6.5"
      .toLowerCase()
      .trim();

    console.log('🧹 Cleaned text:', cleanText);

    // Enhanced patterns for soil parameters
    const patterns = {
      pH: [
        /ph\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /ph\s+value\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /soil\s+ph\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
      ],
      nitrogen: [
        /nitrogen\s*\([^)]*\)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /(?:nitrogen|n|available\s+n)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /n\s*[:=\-]?\s*(\d+\.\d+|\d+)\s*(?:kg\/ha|kg|ppm|mg\/kg)?/gi,
      ],
      phosphorus: [
        /phosphorus\s*\([^)]*\)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /(?:phosphorus|p|available\s+p|p2o5)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /p\s*[:=\-]?\s*(\d+\.\d+|\d+)\s*(?:kg\/ha|kg|ppm|mg\/kg)?/gi,
      ],
      potassium: [
        /potassium\s*\([^)]*\)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /(?:potassium|k|available\s+k|k2o)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /k\s*[:=\-]?\s*(\d+\.\d+|\d+)\s*(?:kg\/ha|kg|ppm|mg\/kg)?/gi,
      ],
      organic_matter: [
        /(?:organic\s*(?:matter|carbon)|oc)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /carbon\s*[:=\-]?\s*(\d+\.\d+|\d+)\s*(?:%|percent)?/gi,
      ],
      moisture: [
        /moisture\s*content\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /(?:moisture|water\s*content)\s*[:=\-]?\s*(\d+\.\d+|\d+)/gi,
        /humidity\s*[:=\-]?\s*(\d+\.\d+|\d+)\s*(?:%|percent)?/gi,
      ]
    };

    // Default parameter definitions
    const defaultParameters = {
      pH: { unit: '', optimal: { min: 6.0, max: 7.5 }, bounds: { min: 3, max: 12 } },
      nitrogen: { unit: 'kg/ha', optimal: { min: 80, max: 180 }, bounds: { min: 0, max: 500 } },
      phosphorus: { unit: 'kg/ha', optimal: { min: 15, max: 35 }, bounds: { min: 0, max: 100 } },
      potassium: { unit: 'kg/ha', optimal: { min: 120, max: 280 }, bounds: { min: 0, max: 500 } },
      organic_matter: { unit: '%', optimal: { min: 3, max: 6 }, bounds: { min: 0, max: 15 } },
      moisture: { unit: '%', optimal: { min: 25, max: 45 }, bounds: { min: 0, max: 100 } }
    };

    // Extract values for each parameter
    Object.keys(patterns).forEach(paramKey => {
      const paramPatterns = patterns[paramKey];
      const paramConfig = defaultParameters[paramKey];
      let extractedValue = null;
      let confidence = 0;

      console.log(`\n🔍 Searching for ${paramKey}:`);

      // Try each pattern
      for (const pattern of paramPatterns) {
        const matches = [...cleanText.matchAll(pattern)];
        console.log(`  Pattern: ${pattern} -> Matches: ${matches.length}`);

        if (matches.length > 0) {
          for (const match of matches) {
            console.log(`    Match found: ${match[0]} -> Value: ${match[1]}`);
            if (match[1]) {
              const value = parseFloat(match[1]);

              // Validate value within bounds
              if (!isNaN(value) &&
                  value >= paramConfig.bounds.min &&
                  value <= paramConfig.bounds.max) {
                extractedValue = value;
                confidence = 0.8; // Base confidence for pattern match
                console.log(`    ✅ Extracted ${paramKey}: ${extractedValue}`);
                break;
              } else {
                console.log(`    ❌ Value ${value} out of bounds [${paramConfig.bounds.min}-${paramConfig.bounds.max}]`);
              }
            }
          }
          if (extractedValue !== null) break;
        }
      }

      if (extractedValue === null) {
        console.log(`    ⚠️ No valid value found for ${paramKey}, using default`);
      }

      // Determine status
      let status = 'optimal';
      if (extractedValue !== null) {
        if (extractedValue < paramConfig.optimal.min) {
          status = extractedValue < paramConfig.optimal.min * 0.7 ? 'deficient' : 'low';
        } else if (extractedValue > paramConfig.optimal.max) {
          status = extractedValue > paramConfig.optimal.max * 1.3 ? 'deficient' : 'low';
        }
      }

      // Add parameter to results with default value if not extracted
      const finalValue = extractedValue !== null ? extractedValue : this.getDefaultValue(paramKey);
      const finalStatus = extractedValue !== null ? status : this.getDefaultStatus(finalValue, paramConfig.optimal);

      soilData.parameters.push({
        name: paramKey.replace('_', ' '),
        value: finalValue,
        unit: paramConfig.unit || '',
        status: finalStatus,
        optimal: paramConfig.optimal,
        confidence: confidence,
        extracted: extractedValue !== null
      });

      if (extractedValue !== null) {
        soilData.extractedCount++;
      }
    });

    return soilData;
  }

  // Helper function to get default values for parameters
  getDefaultValue(paramKey) {
    const defaults = {
      pH: 6.5,
      nitrogen: 120,
      phosphorus: 25,
      potassium: 180,
      organic_matter: 3.5,
      moisture: 30
    };
    return defaults[paramKey] || 0;
  }

  // Helper function to determine status based on value and optimal range
  getDefaultStatus(value, optimal) {
    if (value < optimal.min) {
      return value < optimal.min * 0.7 ? 'deficient' : 'low';
    } else if (value > optimal.max) {
      return value > optimal.max * 1.3 ? 'deficient' : 'low';
    } else {
      return 'optimal';
    }
  }

  // Cleanup method
  async cleanup() {
    if (this.worker && this.isInitialized) {
      await this.worker.terminate();
      this.isInitialized = false;
      console.log('OCR service cleaned up');
    }
  }
}

module.exports = new OCRService();

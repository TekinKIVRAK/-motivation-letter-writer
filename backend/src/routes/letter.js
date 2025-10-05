import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { unlink } from 'fs/promises';
import { validateFile } from '../utils/validator.js';
import { parseResume } from '../services/parser.js';
import { generateMotivationLetter } from '../services/ai.js';

const router = express.Router();

// ESM dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents (.pdf, .doc, .docx) are allowed.'), false);
    }
  }
});

/**
 * Helper function to delete uploaded file
 */
async function cleanupFile(filePath) {
  try {
    await unlink(filePath);
    console.log(`Cleaned up file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to cleanup file: ${filePath}`, error);
  }
}

/**
 * Multer error handler middleware
 */
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxSizeMB = ((parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024).toFixed(0);
      return res.status(400).json({
        success: false,
        message: `Your file is too large. Please upload a file smaller than ${maxSizeMB}MB.`
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded. Please upload only one resume file.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error. Please try again.'
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed. Please try again.'
    });
  }
  next();
}

/**
 * POST /api/letter/generate
 * Generate motivation letter
 */
router.post('/generate', upload.single('resume'), handleMulterError, async (req, res) => {
  let filePath = null;

  try {
    // Extract form data
    const { jobPosting, company, position, personalNotes, tone } = req.body;

    // Validate required fields
    if (!jobPosting || !company || !position) {
      if (req.file) await cleanupFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: company name, position, and job description.'
      });
    }

    let resumeText = '';

    // Parse resume if provided
    if (req.file) {
      const validation = validateFile(req.file);
      if (!validation.valid) {
        await cleanupFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: validation.error
        });
      }

      filePath = req.file.path;
      console.log(`Processing resume: ${req.file.originalname}`);
      resumeText = await parseResume(req.file);
      console.log(`Extracted ${resumeText.length} characters from resume`);
    }

    // Generate motivation letters
    const letters = await generateMotivationLetter({
      resumeText,
      jobPosting,
      company,
      position,
      personalNotes: personalNotes || '',
      tone: tone || 'professional'
    });

    // Cleanup file after successful processing
    if (filePath) await cleanupFile(filePath);

    // Return results
    res.json({
      success: true,
      data: letters.data,
      metadata: {
        hasResume: !!resumeText,
        resumeLength: resumeText.length,
        company,
        position,
        ...letters.metadata
      }
    });
  } catch (error) {
    console.error('Letter generation error:', error);

    // Cleanup file on error
    if (filePath) await cleanupFile(filePath);

    // Provide user-friendly error message
    let userMessage = 'We encountered an issue while generating your motivation letter. Please try again.';

    if (error.message.includes('API key')) {
      userMessage = 'There is a configuration issue with our service. Please contact support.';
    } else if (error.message.includes('parse') || error.message.includes('resume') || error.message.includes('file')) {
      userMessage = error.message; // Pass through file-related errors
    } else if (error.message.includes('token') || error.message.includes('rate limit')) {
      userMessage = 'Our service is currently busy. Please try again in a few moments.';
    }

    res.status(500).json({
      success: false,
      message: userMessage
    });
  }
});

/**
 * GET /api/letter/tips
 * Get motivation letter writing tips
 */
router.get('/tips', (req, res) => {
  res.json({
    success: true,
    data: {
      tips: [
        'Start with a strong opening that shows genuine interest',
        'Research the company and mention specific details',
        'Connect your experience to the job requirements',
        'Show enthusiasm for the role and company',
        'Keep it concise (one page maximum)',
        'Use specific examples and achievements',
        'End with a clear call to action',
        'Proofread carefully for errors'
      ]
    }
  });
});

export default router;

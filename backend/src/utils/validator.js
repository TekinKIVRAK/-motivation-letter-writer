/**
 * File validation utilities
 */

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword' // .doc
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc'];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB default

/**
 * Validate uploaded file
 * @param {Object} file - Multer file object
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file was uploaded. Please select a file to upload.' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `Your file is too large (${fileSizeMB}MB). Please upload a file smaller than ${maxSizeMB}MB.`
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'This file format is not supported. Please upload a PDF (.pdf) or Word document (.doc, .docx).'
    };
  }

  // Check file extension
  const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return {
      valid: false,
      error: 'This file format is not supported. Please upload a PDF (.pdf) or Word document (.doc, .docx).'
    };
  }

  return { valid: true };
}

/**
 * Sanitize filename
 * @param {string} filename
 * @returns {string}
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}
import pdf from 'pdf-parse-fork';
import mammoth from 'mammoth';
import fs from 'fs/promises';

/**
 * Parse PDF file to extract text
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
async function parsePDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Unable to read the PDF file. Please make sure it\'s a valid PDF document and try again.');
  }
}

/**
 * Parse DOCX file to extract text
 * @param {string} filePath - Path to DOCX file
 * @returns {Promise<string>} - Extracted text
 */
async function parseDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error('Unable to read the Word document. Please make sure it\'s a valid .doc or .docx file and try again.');
  }
}

/**
 * Parse resume file based on its type
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - Extracted text
 */
export async function parseResume(file) {
  const { path, mimetype } = file;

  try {
    let text = '';

    if (mimetype === 'application/pdf') {
      text = await parsePDF(path);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      text = await parseDOCX(path);
    } else {
      throw new Error('This file type is not supported. Please upload a PDF or Word document.');
    }

    // Clean up extracted text
    text = text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim();

    if (!text || text.length < 50) {
      throw new Error('Your resume appears to be empty or too short. Please make sure your resume contains text content.');
    }

    return text;
  } catch (error) {
    // Pass through user-friendly error messages
    throw error;
  } finally {
    // Clean up uploaded file
    try {
      await fs.unlink(path);
    } catch (err) {
      console.error('Failed to delete temporary file:', err);
    }
  }
}
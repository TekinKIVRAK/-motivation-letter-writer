import { useState, useRef } from 'react';
import axios from 'axios';

function LetterForm({ onGenerationComplete, onGenerationStart, onError, loading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    resume: null,
    company: '',
    position: '',
    jobPosting: '',
    personalNotes: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      onError('Please upload a PDF (.pdf) or Word document (.doc, .docx) file.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
      onError(`Your file is too large (${fileSizeMB}MB). Please upload a file smaller than 10MB.`);
      return;
    }

    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 2) {
      // Validate step 2
      if (!formData.company.trim()) {
        onError('Please enter the company name.');
        return;
      }
      if (!formData.position.trim()) {
        onError('Please enter the position title.');
        return;
      }
      if (!formData.jobPosting.trim()) {
        onError('Please paste the job description.');
        return;
      }
      if (formData.jobPosting.trim().length < 50) {
        onError('The job description seems too short. Please provide more details for better results.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSkipResume = () => {
    setFormData(prev => ({ ...prev, resume: null }));
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate final step
    if (!formData.personalNotes.trim()) {
      onError('Please add your personal notes to help us create a customized letter.');
      return;
    }

    if (formData.personalNotes.trim().length < 30) {
      onError('Please provide more details in your personal notes for a better motivation letter.');
      return;
    }

    onGenerationStart();

    try {
      const data = new FormData();
      if (formData.resume) {
        data.append('resume', formData.resume);
      }
      data.append('company', formData.company);
      data.append('position', formData.position);
      data.append('jobPosting', formData.jobPosting);
      data.append('personalNotes', formData.personalNotes);
      data.append('tone', 'professional'); // Default tone, backend generates all 3 anyway

      const response = await axios.post('/api/letter/generate', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Pass both the letters data and metadata to the parent
        onGenerationComplete({
          ...response.data.data,
          metadata: response.data.metadata
        });
      } else {
        onError(response.data.message || 'We encountered an issue. Please try again.');
      }
    } catch (error) {
      console.error('Generation error:', error);

      // Provide user-friendly error messages
      let errorMessage = 'Something went wrong. Please try again.';

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }

      onError(errorMessage);
    }
  };

  return (
    <div className="card">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold
                  ${currentStep >= step ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2
                    ${currentStep > step ? 'bg-primary-600' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={currentStep >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Resume</span>
          <span className={currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Job Info</span>
          <span className={currentStep >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Personal</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Resume Upload */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Resume (Optional)</h3>
              <p className="text-gray-600 mb-4">
                Upload your resume to help AI personalize your motivation letter. You can skip this step if you prefer.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-all
                ${dragActive
                  ? 'border-primary-500 bg-primary-50 scale-105'
                  : formData.resume
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <div className="space-y-4">
                {formData.resume ? (
                  <>
                    <svg
                      className="mx-auto h-14 w-14 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-green-700 font-semibold text-lg">{formData.resume.name}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {(formData.resume.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                      className="mt-3 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium"
                    >
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-14 w-14 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-700 text-base font-medium mb-2">
                        Drag and drop your resume here
                      </p>
                      <p className="text-gray-500 text-sm mb-3">or</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                      >
                        Browse Files
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Supports PDF, DOC, and DOCX files up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSkipResume}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Skip Resume
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.resume}
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
              >
                Continue with Resume
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Job Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Job Information</h3>
              <p className="text-gray-600 mb-4">
                Tell us about the position you're applying for
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Google Inc."
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Title *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Posting / Description *
              </label>
              <textarea
                name="jobPosting"
                value={formData.jobPosting}
                onChange={handleInputChange}
                placeholder="Paste the job description here..."
                rows={8}
                className="form-textarea"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Copy and paste the full job description for better results
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Personal Touch</h3>
              <p className="text-gray-600 mb-4">
                Add your personal notes to create a customized motivation letter
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Notes *
              </label>
              <textarea
                name="personalNotes"
                value={formData.personalNotes}
                onChange={handleInputChange}
                placeholder="Add any specific experiences, achievements, or reasons why you're interested in this position..."
                rows={8}
                className="form-textarea"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Share specific achievements, skills, or reasons for your interest
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">We'll generate 3 versions for you</p>
                  <p className="text-sm text-blue-700">
                    You'll receive motivation letters in Professional, Friendly, and Enthusiastic tones - so you can choose the one that fits best!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 disabled:opacity-50"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating Letters...
                  </span>
                ) : (
                  'Generate Motivation Letters'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LetterForm;

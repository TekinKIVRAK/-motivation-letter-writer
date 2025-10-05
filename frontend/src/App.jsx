import { useState } from 'react';
import LetterForm from './components/LetterForm';
import LetterResult from './components/LetterResult';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerationComplete = (data) => {
    setResults(data);
    setLoading(false);
  };

  const handleGenerationStart = () => {
    setLoading(true);
    setError(null);
    setResults(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Motivation Letter Writer AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create compelling, personalized motivation letters in three different tones with the power of AI
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Form Section */}
          {!results && (
            <LetterForm
              onGenerationComplete={handleGenerationComplete}
              onGenerationStart={handleGenerationStart}
              onError={handleError}
              loading={loading}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 px-6 py-3 bg-primary-600 text-white text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {results && <LetterResult data={results} onReset={handleReset} />}
        </div>

      </div>
    </div>
  );
}

export default App;
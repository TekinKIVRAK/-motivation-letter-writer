import { useState } from 'react';

function LetterResult({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('professional');
  const [copySuccess, setCopySuccess] = useState('');

  const toneLabels = {
    professional: 'Professional',
    friendly: 'Friendly',
    enthusiastic: 'Enthusiastic'
  };

  const handleCopy = async (text, tone) => {
    try {
      // Replace literal \n with actual newlines for clipboard
      const cleanText = text.replace(/\\n/g, '\n');
      await navigator.clipboard.writeText(cleanText);
      setCopySuccess(tone);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderLetter = (letterContent, tone) => {
    // Extract content if it's an object with content property, otherwise use as is
    let content = typeof letterContent === 'object' ? letterContent.content : letterContent;

    // Replace literal \n with actual newlines
    content = content.replace(/\\n/g, '\n');

    // Split content into paragraphs (by double newlines or single newlines)
    const paragraphs = content.split(/\n+/).filter(p => p.trim());

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <div className="prose prose-lg max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 leading-relaxed whitespace-pre-line">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleCopy(content, tone)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {copySuccess === tone ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-100 opacity-50"></div>
        <div className="relative flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-7 w-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-green-900">
              Success! Your Motivation Letters Are Ready
            </h3>
            <p className="mt-2 text-base text-green-700">
              We've generated 3 versions of your motivation letter in different tones. Choose the one that fits best!
            </p>
          </div>
        </div>
      </div>

      {/* Letter Tabs */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Your Motivation Letters</h2>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {Object.keys(toneLabels).filter(tone => data[tone]).map((tone) => (
              <button
                key={tone}
                onClick={() => setActiveTab(tone)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tone
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {toneLabels[tone]}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Letter */}
        <div>
          {Object.keys(toneLabels).filter(tone => data[tone]).map((tone) => (
            <div key={tone} className={activeTab === tone ? 'block' : 'hidden'}>
              {renderLetter(data[tone], tone)}
            </div>
          ))}
        </div>
      </div>

      {/* Customization Tips */}
      {data.customizationTips && data.customizationTips.length > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6">
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-blue-100 opacity-30"></div>
          <div className="relative">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              Customization Tips
            </h3>
            <ul className="space-y-3">
              {data.customizationTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-blue-900 text-base">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Application Info */}
      {data.metadata && (
        <div className="card bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Application Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Company:</span>
              <span className="ml-2 text-gray-900 font-medium">{data.metadata.company}</span>
            </div>
            <div>
              <span className="text-gray-500">Position:</span>
              <span className="ml-2 text-gray-900 font-medium">{data.metadata.position}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="pt-4">
        <button
          onClick={onReset}
          className="w-full px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Generate New Letter
          </span>
        </button>
      </div>
    </div>
  );
}

export default LetterResult;

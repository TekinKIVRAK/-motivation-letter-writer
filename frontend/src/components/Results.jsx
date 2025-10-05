function Results({ data, onReset }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getATSColor = (level) => {
    const levelLower = level?.toLowerCase() || '';
    if (levelLower.includes('yüksek') || levelLower.includes('high'))
      return 'text-green-600';
    if (levelLower.includes('orta') || levelLower.includes('medium'))
      return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`card ${getScoreBackground(data.score)}`}>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Overall Score
          </h2>
          <div className={`text-6xl font-bold ${getScoreColor(data.score)}`}>
            {data.score}
            <span className="text-3xl">/100</span>
          </div>
          <p className="mt-2 text-gray-600">
            {data.score >= 80 && '🎉 Excellent! Your resume looks great.'}
            {data.score >= 60 && data.score < 80 && '👍 Good! A few improvements can be made.'}
            {data.score < 60 && '💪 There are areas that need improvement.'}
          </p>
        </div>
      </div>

      {/* Strengths */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          Strengths
        </h3>
        <ul className="space-y-2">
          {data.strengths?.map((strength, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      {data.weaknesses && data.weaknesses.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-red-500 mr-2">⚠</span>
            Weaknesses
          </h3>
          <ul className="space-y-2">
            {data.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      <div className="card bg-blue-50">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-blue-500 mr-2">💡</span>
          Improvement Suggestions
        </h3>
        <ul className="space-y-3">
          {data.suggestions?.map((suggestion, index) => (
            <li
              key={index}
              className="flex items-start p-3 bg-white rounded-lg"
            >
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ATS Compatibility */}
      {data.atsCompatibility && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🤖 ATS Compatibility
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Level:</span>
              <span
                className={`font-semibold ${getATSColor(
                  data.atsCompatibility.level
                )}`}
              >
                {data.atsCompatibility.level}
              </span>
            </div>
            {data.atsCompatibility.explanation && (
              <p className="text-gray-600 text-sm mt-2 p-3 bg-gray-50 rounded">
                {data.atsCompatibility.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Format & Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Format */}
        {data.format && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 Format
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Rating:</span>
                <span className="font-medium text-primary-600">
                  {data.format.rating}
                </span>
              </div>
              {data.format.comments && (
                <p className="text-sm text-gray-600 mt-2">
                  {data.format.comments}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {data.content && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📄 Content
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Rating:</span>
                <span className="font-medium text-primary-600">
                  {data.content.rating}
                </span>
              </div>
              {data.content.comments && (
                <p className="text-sm text-gray-600 mt-2">
                  {data.content.comments}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="text-center pt-6">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Analyze New Resume
        </button>
      </div>
    </div>
  );
}

export default Results;

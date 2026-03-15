/**
 * ScoreCard Component
 * Displays resume quality score with visual progress bar and feedback
 */
import { useState, useEffect } from 'react';
import { getResumeScore } from '../services/api';

const ScoreCard = ({ resumeId }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!resumeId) {
      setLoading(false);
      return;
    }

    const fetchScore = async () => {
      try {
        setLoading(true);
        const data = await getResumeScore(resumeId);
        setScore(data);
      } catch (err) {
        setError('Failed to fetch profile score');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [resumeId]);

  if (!resumeId) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!score) {
    return null;
  }

  // Determine color based on score
  const getScoreColor = (scoreValue) => {
    if (scoreValue >= 90) return 'text-green-600';
    if (scoreValue >= 70) return 'text-blue-600';
    if (scoreValue >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (scoreValue) => {
    if (scoreValue >= 90) return 'bg-green-500';
    if (scoreValue >= 70) return 'bg-blue-500';
    if (scoreValue >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreEmoji = (scoreValue) => {
    if (scoreValue >= 90) return '🌟';
    if (scoreValue >= 70) return '👍';
    if (scoreValue >= 50) return '📈';
    return '💡';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Profile Quality Score
      </h2>

      {/* Score Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Score</span>
          <span className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
            {score.score}/100 {getScoreEmoji(score.score)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${getProgressColor(score.score)} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${score.score}%` }}
          ></div>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Feedback</h3>
        <p className="text-gray-600">{score.feedback}</p>
      </div>

      {/* Score Breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-gray-600 mb-1">Rating</p>
          <p className="font-semibold text-gray-800">
            {score.score >= 90 ? 'Excellent' : 
             score.score >= 70 ? 'Good' : 
             score.score >= 50 ? 'Fair' : 'Needs Work'}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-gray-600 mb-1">Completeness</p>
          <p className="font-semibold text-gray-800">{score.score}%</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;

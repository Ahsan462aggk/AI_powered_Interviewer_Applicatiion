import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Sparkles, MessageSquare } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// QuestionAnswer Component
const QuestionAnswer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access the session data passed via navigate
  const sessionDataFromNavigate = location.state?.sessionData;

  // State to hold session data
  const [session, setSession] = useState(sessionDataFromNavigate || null);
  const [loading, setLoading] = useState(!sessionDataFromNavigate);
  const [error, setError] = useState(null);

  // Track the current question number
  const [questionNumber, setQuestionNumber] = useState(1);
  const TOTAL_QUESTIONS = 5; // Total number of questions

  // Answer input state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState('');

  // Save session ID to local storage on initialization
  useEffect(() => {
    if (sessionDataFromNavigate) {
      const { id: sessionId } = sessionDataFromNavigate;
      if (sessionId) {
        localStorage.setItem('sessionId', sessionId);
      }
      setLoading(false); // Stop loading if session data is available
    }
  }, [sessionDataFromNavigate]);

  // Define handleSubmit function
  // Inside the handleSubmit function in QuestionAnswer Component

  const handleSubmit = useCallback(async () => {
    if (!answerText.trim()) {
      alert('Please enter an answer before submitting.');
      return;
    }
  
    setIsSubmitting(true);
    try {
      const { id: sessionId, category_id: categoryId } = session;
  
      const response = await axios.post(
        'http://localhost:8089/session/answer',
        { answer_text: answerText },
        {
          headers: {
            'Session-ID': sessionId,
            'X-Category-ID': categoryId,
          },
          withCredentials: true,
        }
      );
  
      if (questionNumber >= TOTAL_QUESTIONS) {
        // Redirect to final feedback page when all questions are completed
        localStorage.setItem('completedSession', true);
        navigate('/final-feedback');
      } else {
        setQuestionNumber((prevNumber) => prevNumber + 1);
  
        if (response.data.next_question) {
          setSession((prevSession) => ({
            ...prevSession,
            current_question: response.data.next_question,
          }));
        } else {
          alert('Unexpected response from the server. Please try again.');
        }
      }
  
      setAnswerText('');
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answerText, navigate, session, questionNumber]);
  


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-white text-lg">Loading session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!session) {
    return null; // Or a fallback UI
  }

  const { current_question, completed } = session;
  const progressPercentage = (questionNumber / TOTAL_QUESTIONS) * 100;

  return (
    <div className="relative min-h-screen bg-transparent text-xl flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Feedback Notice */}
        <div className="mt-2 mb-4 backdrop-blur-xl bg-white/10 rounded-2xl border border-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-300" />
              </div>
            </div>
            <div>
              <h3 className="text-white text-xl font-bold mb-1">
                Comprehensive Feedback Awaits
              </h3>
              <p className="text-purple-200 text-md">
                After completing all questions, you'll receive detailed feedback on your responses,
                including strengths, areas for improvement, and personalized recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-purple-200 rounded-full h-2 mb-7">
          <div
            className="bg-teal-700 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
          <p className="text-purple-200 text-center text-sm mt-2">
            {questionNumber}/{TOTAL_QUESTIONS} Questions Completed
          </p>
        </div>

        {/* Question Card */}
        {!completed && (
          <div className="backdrop-blur-xl shadow-2xl bg-transparent  rounded-2xl border border-white overflow-hidden mb-4">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-300" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold sm:text-2xl text-white mb-2">
                    <ReactMarkdown>{current_question}</ReactMarkdown>
                  </h2>
                  <p className="text-purple-200 text-md">
                    Provide a thoughtful response below:
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answer Section */}
        {!completed && (
          <div className="backdrop-blur-xl bg-transparent shadow-2xl rounded-2xl border border-white overflow-hidden">
            <div className="p-6 sm:p-8">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full min-h-[150px] px-4 py-3 rounded-xl
                  bg-white/20 border border-white/30
                  text-white placeholder-purple-200
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50
                  backdrop-blur-sm resize-none"
              />

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-purple-200">
                  {answerText.length > 0 ? `${answerText.length} characters typed` : 'Start typing your answer'}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!answerText.trim())}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 
                    font-medium transition-all duration-200
                    ${isSubmitting || (!answerText.trim())
                      ? 'bg-purple-500/30 text-purple-200 cursor-not-allowed'
                      : 'bg-purple-500/50 hover:bg-purple-500/70 text-white cursor-pointer'}
                    backdrop-blur-sm border border-white`}
                >
                  <span>{questionNumber < TOTAL_QUESTIONS ? 'Submit Answer' : 'Finish Interview'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionAnswer;

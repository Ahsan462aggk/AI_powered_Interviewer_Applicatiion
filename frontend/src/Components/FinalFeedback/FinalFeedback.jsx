import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCircle, ThumbsUp, AlertCircle } from 'lucide-react';

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  const formatFeedbackText = (text) => {
    const lines = text.split('\n');
    let formattedContent = [];
    let currentText = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Handle main section headers (with ** at start)
      if (line.startsWith('**') && line.endsWith('**')) {
        if (currentText) {
          formattedContent.push(<p key={`p-${i}`} className="mb-4">{currentText}</p>);
          currentText = '';
        }
        const headerText = line.replace(/\*\*/g, '');
        formattedContent.push(
          <h3 key={`h-${i}`} className="text-purple-200 font-bold text-lg mt-6 mb-3">
            {headerText}
          </h3>
        );
      }
      // Handle sub-section headers (with *** at start)
      else if (line.startsWith('***') && line.endsWith('**')) {
        if (currentText) {
          formattedContent.push(<p key={`p-${i}`} className="mb-4">{currentText}</p>);
          currentText = '';
        }
        const subHeaderText = line.replace(/\*\*\*/g, '').replace(/\*\*/g, '');
        formattedContent.push(
          <h4 key={`sh-${i}`} className="text-blue-200 font-semibold mt-4 mb-2 pl-4">
            {subHeaderText}
          </h4>
        );
      }
      // Handle regular text
      else if (line) {
        if (currentText) currentText += ' ';
        currentText += line;
      }
      // Handle empty lines
      else if (currentText) {
        formattedContent.push(<p key={`p-${i}`} className="mb-4 pl-4">{currentText}</p>);
        currentText = '';
      }
    }

    // Add any remaining text
    if (currentText) {
      formattedContent.push(<p key="final" className="mb-4 pl-4">{currentText}</p>);
    }

    return <div className="space-y-1">{formattedContent}</div>;
  };

  return formatFeedbackText(displayedText);
};

const FinalFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
          throw new Error('Session ID not found');
        }

        const response = await axios.get('http://localhost:8089/session/final', {
          headers: {
            'Session-ID': sessionId,
          },
          withCredentials: true,
        });

        setFeedback(response.data);
      } catch (err) {
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-200">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 text-xl space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Final Feedback
        </h1>
        <MessageCircle className="text-sky-300 w-8 h-8" />
      </div>

      <div className="space-y-6">
        {feedback.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-white backdrop-blur-sm p-6 bg-black bg-opacity-5"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-800 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-purple-100">
                    Question {index + 1}
                  </h3>
                  <p className="text-gray-200">
                    {item.question}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pl-8">
                <MessageCircle className="w-5 h-5 text-sky-300 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-blue-100">
                    Answer
                  </h3>
                  <p className="text-gray-200">
                    {item.answer}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pl-8">
                <ThumbsUp className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-red-100">
                    Feedback
                  </h3>
                  <div className="text-gray-200 mt-2">
                    <TypewriterText text={item.feedback} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalFeedback;
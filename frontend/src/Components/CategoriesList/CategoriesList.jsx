import React, { useState, useEffect } from 'react';
import {
  Code,
  Database,
  Cloud,
  Microscope,
  Cpu,
  Users,
  Briefcase,
  Shield,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoriesList = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [selectionError, setSelectionError] = useState(null);

  const navigate = useNavigate();

  const iconMapping = {
    'software development': <Code className="w-6 h-6" />,
    'devops & infrastructure': <Cloud className="w-6 h-6" />,
    'data science': <Database className="w-6 h-6" />,
    'ai & machine learning': <Cpu className="w-6 h-6" />,
    'research & development': <Microscope className="w-6 h-6" />,
    management: <Users className="w-6 h-6" />,
    'medical practitioner interviews': <Heart className="w-6 h-6" />,
    'pharmaceutical interviews': <Shield className="w-6 h-6" />,
    'risk management interviews': <AlertTriangle className="w-6 h-6" />,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8089/categories', {
          withCredentials: true,
        });
        const categoriesWithIcons = response.data.map((category) => ({
          ...category,
          icon:
            iconMapping[category.name.toLowerCase()] || (
              <Briefcase className="w-6 h-6" />
            ),
        }));
        setJobCategories(categoriesWithIcons);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = async (categoryId) => {
    setSelectedId(categoryId);
    setSelectionLoading(true);
    setSelectionError(null);

    try {
      const response = await axios.post(
        'http://localhost:8089/session/init',
        {},
        {
          headers: {
            'X-Category-ID': categoryId,
          },
          withCredentials: true,
        }
      );

      const sessionData = response.data;
      navigate('/session', { state: { sessionData } });
    } catch (err) {
      console.error('Error initiating session:', err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            setSelectionError('Missing category ID. Please select a category.');
            break;
          case 401:
            setSelectionError('Unauthorized. Please log in again.');
            break;
          case 404:
            setSelectionError(
              'Category not found. Please select a valid category.'
            );
            break;
          case 422:
            setSelectionError('Unprocessable Entity. Please check your input.');
            break;
          default:
            setSelectionError('Failed to initiate session. Please try again.');
        }
      } else if (err.request) {
        setSelectionError(
          'No response from server. Please check your network.'
        );
      } else {
        setSelectionError('An unexpected error occurred.');
      }

      setSelectedId(null);
    } finally {
      setSelectionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Failed to load categories. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-6xl">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl ml-6 shadow-2xl overflow-hidden border border-white">
        {/* Header */}
        <div className="px-6 py-8 bg-black/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8" />
            Select Your Field
          </h2>
          <p className="text-white/80 mt-2">
            Choose a category to start your AI-powered job search
          </p>
        </div>

        {/* Display selection error if any */}
        {selectionError && (
          <div className="px-6 py-4 bg-red-500/20">
            <p className="text-red-500">{selectionError}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {jobCategories.map((category) => (
            <div
              key={category.id}
              onClick={() =>
                !selectionLoading && handleCategorySelect(category.id)
              }
              onMouseEnter={() => setHoveredId(category.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                rounded-xl border transition-all duration-300 cursor-pointer
                backdrop-blur-lg
                ${
                  selectedId === category.id
                    ? 'border-white/50 bg-white/20'
                    : hoveredId === category.id
                    ? 'border-white/30 bg-white/15'
                    : 'border-white/10 bg-white/10'
                }
                ${
                  selectionLoading && selectedId === category.id
                    ? 'opacity-50 cursor-wait'
                    : ''
                }
              `}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      p-2 rounded-lg transition-all duration-300
                      ${
                        selectedId === category.id
                          ? 'bg-white/25 text-white'
                          : hoveredId === category.id
                          ? 'bg-white/20 text-white'
                          : 'bg-white/15 text-white'
                      }
                    `}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-lg text-white capitalize">
                    {category.name}
                  </h3>
                </div>
                {selectionLoading && selectedId === category.id && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/20 border-t border-white/10">
          <p className="text-center text-sm text-white/70">
            Select a category to begin your personalized assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;

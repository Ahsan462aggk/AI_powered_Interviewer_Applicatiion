const BASE_URL = '/api/v1';

// Fetch categories (GET /categories/)
export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories/`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return await response.json();
};

// Initialize a session (POST /session/init)
export const initializeSession = async (userId, categoryId) => {
  const response = await fetch(`${BASE_URL}/session/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Category-ID': categoryId
    },
    body: JSON.stringify({ user_id: userId })
  });
  if (!response.ok) throw new Error('Failed to initialize session');
  return await response.json();
};

// Submit an answer (POST /session/answer)
export const submitAnswer = async (sessionId, categoryId, answerText) => {
  const response = await fetch(`${BASE_URL}/session/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Session-ID': sessionId,
      'X-Category-ID': categoryId
    },
    body: JSON.stringify({ answer_text: answerText })
  });
  if (!response.ok) throw new Error('Failed to submit answer');
  return await response.json();
};

// Get final feedback (GET /session/final)
export const getFinalFeedback = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/session/final`, {
    method: 'GET',
    headers: {
      'Session-ID': sessionId
    }
  });
  if (!response.ok) throw new Error('Failed to fetch final feedback');
  return await response.json();
};

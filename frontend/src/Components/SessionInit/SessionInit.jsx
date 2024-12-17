import React, { useState } from 'react';
import { initializeSession } from '../services/api';
import { useSession } from '../context/SessionContext';

const SessionInit = () => {
  const [userId] = useState('fixed_user_id'); // This would ideally come from user authentication
  const { categoryId, setSession } = useSession();

  const startSession = async () => {
    try {
      const sessionData = await initializeSession(userId, categoryId);
      setSession(sessionData); // Store session data
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <button onClick={startSession} disabled={!categoryId}>
        Start Interview
      </button>
    </div>
  );
};

export default SessionInit;

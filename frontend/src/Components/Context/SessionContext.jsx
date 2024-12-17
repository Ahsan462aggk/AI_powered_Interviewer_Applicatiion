import React, { createContext, useState } from 'react';

// Create a new context
export const SessionContext = createContext();

// Create the SessionProvider component
export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null); // Store session data
  const [categoryId, setCategoryId] = useState(null); // Store selected category

  return (
    <SessionContext.Provider value={{ session, setSession, categoryId, setCategoryId }}>
      {children}
    </SessionContext.Provider>
  );
};

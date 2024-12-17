import { useContext } from 'react';
import { SessionContext } from './SessionContext';


// Custom hook for consuming the context
export const useSession = () => useContext(SessionContext);

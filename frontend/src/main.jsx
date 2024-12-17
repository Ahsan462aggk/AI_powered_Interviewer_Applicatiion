import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SessionProvider } from './Components/Context/SessionContext.jsx'
import AnimatedBackground from './Components/AnimatedBackground/AnimatedBackground.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <SessionProvider>
      <AnimatedBackground>
      <App />
      </AnimatedBackground>
 
     </SessionProvider>
  
  </StrictMode>,
)

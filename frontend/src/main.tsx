import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// import "./index.css"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/userContext.tsx';
createRoot(document.getElementById('root')!).render(
  // <StrictMode >
  // </StrictMode>,
  <GoogleOAuthProvider clientId="253144586096-g0j87i64ioq01u44h3l7817u36vh1rth.apps.googleusercontent.com">
    <UserProvider>
      <App />
    </UserProvider>

  </GoogleOAuthProvider>
)

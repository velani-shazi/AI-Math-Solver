/**
 * Main Application Component
 * 
 * Root component that:
 * - Sets up routing with React Router
 * - Wraps entire app with global context providers
 * - Manages authentication flow
 * - Handles OAuth token handling
 * 
 * Architecture:
 * App (Router + Providers)
 * └─ AppContent (Routes and Layout)
 *    ├─ Navbar
 *    ├─ Routes (pages)
 *    └─ Footer
 */

import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions"
import logo from './assets/images/logo.png';
import './App.css';
import BookmarksPage from "./pages/BookmarksPage";
import LoginPage from "./pages/LoginPage";
import AccountsCenter from './pages/AccountsCenter';
import NotFound from './components/NotFound/NotFound';
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { SolutionProvider } from "./context/SolutionContext";
import { storeToken } from "./services/api";

/**
 * Application Content Component
 * Contains all routes and layout elements
 * Placed inside providers so it can access context
 */
function AppContent() {
  const authContext = React.useContext(AuthContext);
  const { user, logout } = authContext;

  /**
   * Handle OAuth callback
   * When backend redirects to app with token in URL,
   * store token and reload to reinitialize auth
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      // Store OAuth token from redirect
      storeToken(tokenFromUrl);
      // Remove token from URL for clean state
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload app to reinitialize auth with new token
      window.location.reload();
    }
  }, []);

  return (
    <div className="App">
      {/* Header with navigation */}
      <Navbar logo={logo} user={user} onLogout={logout}/>
      
      {/* Main content area with page routes */}
      <div className="App-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountsCenter />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      {/* Footer */}
      <Footer logo={logo} />
    </div>
  );
}

/**
 * Root Application Component
 * Initializes router and global context providers
 */
function App() {
  return (
    // Router setup for client-side navigation
    <BrowserRouter>
      {/* Authentication context - provides useAuth() hook */}
      <AuthProvider>
        {/* Solution context - provides useSolution() hook */}
        <SolutionProvider>
          {/* Main app content and routing */}
          <AppContent />
        </SolutionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
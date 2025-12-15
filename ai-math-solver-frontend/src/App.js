import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');
      
      if (tokenFromUrl) {
        localStorage.setItem('jwt_token', tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
      }     

      const token = localStorage.getItem('jwt_token');      
      if (!token) {
        return; 
      }

      try {
        const res = await fetch("/auth/me", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            console.log(data.user);
            setUser(data.user);
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem('jwt_token');
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        localStorage.removeItem('jwt_token');
      }
    }
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('jwt_token', token);
    setUser(userData);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar logo={logo} user={user} onLogout={handleLogout}/>
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solutions" element={<Solutions user={user}/>} />
            <Route path="/bookmarks" element={<BookmarksPage user={user}/>} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
            <Route path="/account" element={<AccountsCenter user={user} onLogout={handleLogout}/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer logo={logo} />
      </div>
    </BrowserRouter>
  );
}

export default App;
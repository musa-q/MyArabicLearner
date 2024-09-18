import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import VerbsPage from './pages/VerbsPage'
import WordsFlashcardsPage from './pages/WordsFlashcardsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavBar from './components/NavBar';
import WordsPracticePage from './pages/WordsPracticePage';
import './components/Scrollbar.css'
import './App.css'
import Logger from './components/Logger';
import { Helmet } from "react-helmet";
import LoginPage from './pages/LoginPage';
import axios from 'axios';


const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userId, token) => {
    setIsLoggedIn(true);
    setUserId(userId);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    navigateToPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
    navigateToPage('home');
  };

  return (
    <div className="dark-background light" data-bs-theme="dark">
      <Helmet>
        <title>My Arabic Learner</title>
        <meta name="description" content="Ahlan wa Sahlan! This is your platform to learn and practice Arabic in the Levantine dialect. Explore our tools to improve your vocabulary and grammar!" />
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "My Arabic Learner",
            "url": "https://www.myarabiclearner.com",
            "description": "Ahlan wa Sahlan! This is your platform to learn and practice Arabic in the Levantine dialect. Explore our tools to improve your vocabulary and grammar!"
          }
          `}
        </script>
        <meta property="og:title" content="My Arabic Learner" />
        <meta property="og:description" content="Ahlan wa Sahlan! This is your platform to learn and practice Arabic in the Levantine dialect. Explore our tools to improve your vocabulary and grammar!" />
        <meta property="og:image" content="https://www.myarabiclearner.com/logo_main.svg" />
        <meta property="og:url" content="https://www.myarabiclearner.com/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="My Arabic Learner" />
        <meta name="twitter:description" content="Ahlan wa Sahlan! This is your platform to learn and practice Arabic in the Levantine dialect. Explore our tools to improve your vocabulary and grammar!" />
        <meta name="twitter:image" content="https://www.myarabiclearner.com/logo_main.svg" />
      </Helmet>
      <MyNavBar onNavigate={navigateToPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {!isLoggedIn && currentPage !== 'login' && <LoginPage onLogin={handleLogin} />}
      {isLoggedIn && (
        <>
          {currentPage === 'home' && <HomePage onNavigate={navigateToPage} />}
          {currentPage === 'verbs' && <VerbsPage />}
          {currentPage === 'wordsflashcard' && <WordsFlashcardsPage />}
          {currentPage === 'wordspractice' && <WordsPracticePage />}
        </>
      )}
    </div>
  )
}

export default App;
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import VerbsPage from './pages/VerbsPage'
import WordsFlashcardsPage from './pages/WordsFlashcardsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavBar from './components/NavBar';
import WordsPracticePage from './pages/WordsPracticePage';
import './components/Scrollbar.css'
import './App.css'
import { Helmet } from "react-helmet";
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import AllQuizResultsPage from './pages/AllQuizResultsPage';
import { API_URL } from './config';


const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const response = await axios.post(`${API_URL}/auth/check-token`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          if (response.data.valid) {
            setIsLoggedIn(true);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          handleLogout();
        }
      }
    };

    verifyToken();
    const tokenCheckInterval = setInterval(verifyToken, 60000); // Check every minute
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    navigateToPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('authToken');
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
          {currentPage === 'quiz-results' && <AllQuizResultsPage />}
        </>
      )}
    </div>
  )
}

export default App;
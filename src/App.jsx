import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import WordsFlashcardsPage from './pages/WordsFlashcardsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavBar from './components/NavBar';
import './components/Scrollbar.css'
import './App.css'
import { Helmet } from "react-helmet";
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import QuizTypesPage from './pages/QuizTypesPage';
import AllQuizResultsPage from './pages/AllQuizResultsPage';
import { API_URL } from './config';
import CheatsheetTypesPage from './pages/CheatsheetTypesPage';


const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const getUserDetails = async () => {
    if (!username) {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_URL}/homepage`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUsername(response.data.username);
      console.log(response.data.other_info);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

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
      <MyNavBar onNavigate={navigateToPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} username={username} />
      {!isLoggedIn && currentPage !== 'login' && <LoginPage onLogin={handleLogin} />}
      {isLoggedIn && (
        <>
          {currentPage === 'home' && <HomePage onNavigate={navigateToPage} username={username} />}
          {currentPage === 'wordsflashcard' && <WordsFlashcardsPage />}
          {currentPage === 'quiz' && <QuizTypesPage />}
          {currentPage === 'quiz-results' && <AllQuizResultsPage />}
          {currentPage === 'cheatsheet' && <CheatsheetTypesPage />}
        </>
      )}
    </div>
  )
}

export default App;
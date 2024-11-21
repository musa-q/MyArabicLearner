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
import CheatsheetTypesPage from './pages/cheatsheets/CheatsheetTypesPage';
import AboutPage from './pages/AboutPage';
import MaintenanceHomePage from './pages/maintenance/MaintenanceHomePage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [extraButtons, setExtraButtons] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserDetails = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/homepage`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUsername(response.data.username);
      if (response.data.extra_buttons) {
        setExtraButtons(response.data.extra_buttons);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
            if (!username) {
              await getUserDetails();
            }
          } else {
            removeLocalStorage();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          removeLocalStorage();
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyToken();
    const tokenCheckInterval = setInterval(verifyToken, 60000);
    return () => clearInterval(tokenCheckInterval);
  }, [username]);

  const removeLocalStorage = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setExtraButtons(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    delete axios.defaults.headers.common['Authorization'];
    navigateToPage('home');
  }


  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = async (token, email) => {
    setIsLoggedIn(true);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await getUserDetails();
    navigateToPage('home');
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.post(`${API_URL}/auth/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (response.data.logged_out) {
          removeLocalStorage();
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
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
      <MyNavBar onNavigate={navigateToPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} username={username} extraButtons={extraButtons} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!isLoggedIn && currentPage !== 'login' && <LoginPage onLogin={handleLogin} />}
          {isLoggedIn && (
            <>
              {!isLoggedIn && currentPage !== 'login' && <LoginPage onLogin={handleLogin} />}
              {isLoggedIn && (
                <>
                  {currentPage === 'home' && <HomePage onNavigate={navigateToPage} username={username} />}
                  {currentPage === 'wordsflashcard' && <WordsFlashcardsPage />}
                  {currentPage === 'quiz' && <QuizTypesPage />}
                  {currentPage === 'quiz-results' && <AllQuizResultsPage />}
                  {currentPage === 'cheatsheet' && <CheatsheetTypesPage />}
                  {currentPage === 'about' && <AboutPage onNavigate={navigateToPage} />}
                  {extraButtons && (
                    <>
                      {currentPage === 'maintenance' && <MaintenanceHomePage />}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default App;
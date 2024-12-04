import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import WordsFlashcardsPage from './pages/WordsFlashcardsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavBar from './components/NavBar';
import './components/Scrollbar.css';
import './App.css';
import { Helmet } from "react-helmet";
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import QuizTypesPage from './pages/QuizTypesPage';
import AllQuizResultsPage from './pages/AllQuizResultsPage';
import { API_URL } from './config';
import CheatsheetTypesPage from './pages/cheatsheets/CheatsheetTypesPage';
import AboutPage from './pages/AboutPage';
import MaintenanceHomePage from './pages/maintenance/MaintenanceHomePage';
import { Spinner } from 'react-bootstrap';
import { authManager } from './utils';
import Footer from './components/Footer';
import TeamPage from './components/TeamPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [username, setUsername] = useState(null);
  const [extraButtons, setExtraButtons] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');

  const publicPages = ['home', 'about', 'login'];

  const getUserDetails = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // console.log('Making homepage request with token:', token.substring(0, 10) + '...'); // Debug log

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
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response?.status === 401) {
        authManager.clearTokens();
        setIsAuthenticated(false);
        setEmail('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('sessionExpired') === 'true') {
        handleSessionExpired();
        return;
      }

      if (!localStorage.getItem('deviceId')) {
        localStorage.setItem('deviceId', `web-${Math.random().toString(36).substr(2, 9)}`);
      }

      const authToken = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedEmail = localStorage.getItem('email');

      if (authToken && refreshToken) {
        if (!authManager.initializeFromStorage()) {
          // console.log('Auth state migration required, redirecting to login');
          setIsLoading(false);
          return;
        }
        setEmail(storedEmail);
        authManager.initializeFromStorage();
        await getUserDetails();
      } else {
        setIsLoading(false);
      }
    };

    authManager.setupAxiosInterceptors(() => {
      handleLogout();
    });

    checkAuth();

    return () => {
      if (authManager.refreshTokenTimeout) {
        clearTimeout(authManager.refreshTokenTimeout);
      }
    };
  }, []);

  const handleSessionExpired = () => {
    localStorage.removeItem('sessionExpired');
    authManager.clearTokens();
    localStorage.removeItem('email');
    localStorage.removeItem('deviceId');
    setIsAuthenticated(false);
    setEmail('');
    setUsername(null);
    setExtraButtons(null);
    setCurrentPage('login');
  };


  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = async (token, refresh_token, userEmail) => {
    // console.log('Login response:', { token, userEmail });

    if (!token || !userEmail) {
      // console.error('Missing login data:', { token, userEmail });
      return;
    }

    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', `web-${Math.random().toString(36).substr(2, 9)}`);
    }

    try {
      authManager.setTokens(token, refresh_token, userEmail);
      setEmail(userEmail);
      await getUserDetails();
      navigateToPage('home');
    } catch (error) {
      console.error('Login process failed:', error);
      authManager.clearTokens();
      setEmail('');
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authManager.clearTokens();
      localStorage.removeItem('email');
      localStorage.removeItem('deviceId');
      setIsAuthenticated(false);
      setEmail('');
      setUsername(null);
      setExtraButtons(null);
      navigateToPage('home');
    }
  };

  const renderPage = () => {
    if (!isAuthenticated && !publicPages.includes(currentPage)) {
      return <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateToPage} username={username} />;
      case 'about':
        return <AboutPage onNavigate={navigateToPage} />;
      case 'meet-team':
        return <TeamPage onNavigate={navigateToPage} />;
      case 'wordsflashcard':
        return isAuthenticated ? <WordsFlashcardsPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'quiz':
        return isAuthenticated ? <QuizTypesPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'quiz-results':
        return isAuthenticated ? <AllQuizResultsPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'cheatsheet':
        return isAuthenticated ? <CheatsheetTypesPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'maintenance':
        return isAuthenticated && extraButtons ? <MaintenanceHomePage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      default:
        return <HomePage onNavigate={navigateToPage} username={username} />;
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

      <MyNavBar
        onNavigate={navigateToPage}
        isLoggedIn={isAuthenticated}
        onLogout={handleLogout}
        username={username}
        extraButtons={extraButtons}
      />

      <main className="flex-grow pb-5">
        {isLoading ? (
          <div className="text-center py-5 mt-5">
            <Spinner animation="border" variant="purple" />
            <p className="mt-2">Loading page...</p>
          </div>
        ) : (
          renderPage()
        )}
      </main>
      <Footer onNavigate={navigateToPage} isLoggedIn={isAuthenticated} />
    </div>
  );
};

export default App;
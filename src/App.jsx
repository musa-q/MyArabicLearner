import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import WordsFlashcardsPage from './pages/tools/WordsFlashcardsPage';
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
import TutorialPage from './components/TutorialPage';
import ToolsPage from './pages/tools/ToolsPage';
import VerbConjunctionVisualiserPage from './pages/tools/VerbConjunctionVisualiserPage';
import VocabVisualiserPage from './pages/tools/VocabVisualiserPage';
import WordsPracticePage from './pages/WordsPracticePage';
import VerbsPage from './pages/VerbsPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [username, setUsername] = useState(null);
  const [extraButtons, setExtraButtons] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);

  const publicPages = ['home', 'about', 'login', 'meet-team', 'tutorial'];


  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const [smallImg, largeImg] = await Promise.all([
          loadSingleImage('/background_image-640.webp'),
          loadSingleImage('/background_image-1920.webp')
        ]);

        if (!isMounted) return;

        document.documentElement.style.setProperty('--hero-background', 'url("/background_image-640.webp")');
        setIsHeroImageLoaded(true);

        requestAnimationFrame(() => {
          if (!isMounted) return;
          document.documentElement.style.setProperty('--hero-background', 'url("/background_image-1920.webp")');
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const loadSingleImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    loadImage();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    authManager.setupAxiosInterceptors(() => {
      handleSessionExpired();
    });
  }, []);

  const getUserDetails = async () => {
    const deviceId = authManager.getDeviceId();
    const token = localStorage.getItem(`authToken_${deviceId}`);
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
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error.response?.status === 401) {
        try {
          await authManager.refreshToken();
          await getUserDetails();
        } catch (refreshError) {
          authManager.clearTokens();
          setIsAuthenticated(false);
          setEmail('');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const deviceId = authManager.getDeviceId();
      const authToken = localStorage.getItem(`authToken_${deviceId}`);
      const refreshToken = localStorage.getItem(`refreshToken_${deviceId}`);
      const storedEmail = localStorage.getItem('email');

      if (authToken && refreshToken) {
        try {
          if (!authManager.initializeFromStorage()) {
            setIsLoading(false);
            return;
          }

          setEmail(storedEmail);
          await getUserDetails();

        } catch (error) {
          console.error('Auth check failed:', error);
          if (error.response?.status === 401) {
            handleSessionExpired();
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
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
    if (!token || !userEmail) {
      console.error('Missing required login data');
      return;
    }

    try {
      authManager.clearTokens();

      authManager.setTokens(token, refresh_token, userEmail);

      const initialized = authManager.initializeFromStorage();
      if (!initialized) {
        throw new Error('Failed to initialize auth from storage');
      }

      setEmail(userEmail);
      try {
        await getUserDetails();
        setIsAuthenticated(true);
        navigateToPage('home');
      } catch (userDetailsError) {
        console.error('Failed to fetch user details:', userDetailsError);
        authManager.clearTokens();
        setEmail('');
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Login process failed:', error);
      authManager.clearTokens();
      setEmail('');
      setIsAuthenticated(false);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const deviceId = authManager.getDeviceId();
      const token = localStorage.getItem(`authToken_${deviceId}`);
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {
          device_id: deviceId
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authManager.clearTokens();
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
      case 'tutorial':
        return <TutorialPage />;
      case 'tools':
        return isAuthenticated ? <ToolsPage onNavigate={navigateToPage} /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'verbconjugationvisualiser':
        return isAuthenticated ? <VerbConjunctionVisualiserPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'vocabvisualiser':
        return isAuthenticated ? <VocabVisualiserPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'wordsflashcard':
        return isAuthenticated ? <WordsFlashcardsPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'quiz':
        return isAuthenticated ? <QuizTypesPage onNavigate={navigateToPage} /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'vocab-quiz':
        return isAuthenticated ? <WordsPracticePage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
      case 'verb-quiz':
        return isAuthenticated ? <VerbsPage /> : <LoginPage onLogin={handleLogin} sessionExpired={localStorage.getItem('sessionExpired') === 'true'} />;
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
    <div className="dark-background" data-bs-theme="dark">
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
        currentPage={currentPage}
      />

      <main className="flex-grow">
        {isLoading ? (
          <div className="text-center py-5 mt-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/logo_main.svg"
              alt="Loading Logo"
              style={{
                height: "100px",
                margin: 'auto',
                paddingBottom: '2em',
                animation: 'jump 3s infinite'
              }}
            />
            <style>
              {`
                @keyframes jump {
                  0%, 50%, 100% {
                    transform: translateY(0);
                  }
                  75% {
                    transform: translateY(-30px);
                  }
                }
              `}
            </style>
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
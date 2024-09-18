import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import logo from '/logo_main.svg';
import './NavBar.css';

const MyNavBar = ({ onNavigate, isLoggedIn, onLogout }) => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand onClick={() => onNavigate('home')}>
                    <div className='aref-ruqaa-regular gold nav-title logo-container unselectable'>
                        <img src={logo} alt="Logo" className="nav-logo" />
                        متعلمو العربية
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => onNavigate('home')}>Home</Nav.Link>
                        {isLoggedIn && (
                            <>
                                <Nav.Link onClick={() => onNavigate('wordsflashcard')}>Flashcards</Nav.Link>
                                <Nav.Link onClick={() => onNavigate('wordspractice')}>Vocab Quiz</Nav.Link>
                                <Nav.Link onClick={() => onNavigate('verbs')}>Conjugation Quiz</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <div className="d-flex align-items-center">
                        {isLoggedIn ? (
                            <Button variant="outline-light" onClick={onLogout}>Logout</Button>
                        ) : (
                            <Button variant="outline-light" onClick={() => onNavigate('login')}>Login</Button>
                        )}
                        <span className="ms-3 me-3">Follow the developer:</span>
                        <a href="https://www.linkedin.com/in/musa-qureshi/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white"
                                alt="LinkedIn Badge"
                            />
                        </a>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavBar;
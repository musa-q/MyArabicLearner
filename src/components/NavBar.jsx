import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '/logo_main.svg';
import './NavBar.css';

const MyNavBar = ({ onNavigate, isLoggedIn, onLogout, username }) => {
    const [expanded, setExpanded] = useState(false);

    const handleNavigate = (path) => {
        onNavigate(path);
        setExpanded(false);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" expanded={expanded}>
            <Container fluid className="navbar-container">
                <div className="navbar-left">
                    <Navbar.Brand onClick={() => onNavigate('home')}>
                        <div className='aref-ruqaa-regular gold nav-title logo-container unselectable'>
                            <img src={logo} alt="Logo" className="nav-logo" />
                            متعلمو العربية
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
                </div>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => handleNavigate('home')}>Home</Nav.Link>
                        {isLoggedIn && (
                            <>
                                <Nav.Link onClick={() => handleNavigate('wordsflashcard')}>Flashcards</Nav.Link>
                                <Nav.Link onClick={() => handleNavigate('quiz')}>Quizzes</Nav.Link>
                                <Nav.Link onClick={() => handleNavigate('cheatsheet')}>Cheatsheets</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
                <div className="navbar-right">
                    <NavDropdown
                        id="user-dropdown"
                        title={<span className='aref-ruqaa-regular gold nav-title unselectable'>انا</span>}
                        menuVariant="dark"
                        align="end"
                    >
                        {isLoggedIn ? (
                            <>
                                {username &&
                                    <>
                                        <NavDropdown.Item style={{ 'pointerEvents': 'none', 'textAlign': 'center' }}>{username}</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                    </>
                                }
                                <NavDropdown.Item onClick={() => onNavigate('quiz-results')}>
                                    View Results
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={onLogout}>
                                    Logout
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    onClick={() => window.open('https://www.linkedin.com/in/musa-qureshi/', '_blank')}
                                >
                                    Follow the developer
                                </NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item onClick={() => onNavigate('')}>
                                    Login
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    onClick={() => window.open('https://www.linkedin.com/in/musa-qureshi/', '_blank')}
                                >
                                    Follow the developer
                                </NavDropdown.Item>
                            </>
                        )}
                    </NavDropdown>
                </div>
            </Container>
        </Navbar>
    );
}

export default MyNavBar;
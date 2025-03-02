import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '/logo_main.svg';
import AppFeedback from './AppFeedback';
import './NavBar.css';

const MyNavBar = ({ onNavigate, isLoggedIn, onLogout, username, extraButtons, currentPage }) => {
    const [expanded, setExpanded] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleNavigate = (path) => {
        onNavigate(path);
        setExpanded(false);
    };

    const handleCloseFeedback = () => setShowFeedback(false);

    const createExtraButtons = Array.isArray(extraButtons) && extraButtons.map((button, index) => (
        <Nav.Link key={index} onClick={() => handleNavigate(button.action)}>
            {button.label}
        </Nav.Link>
    ));

    return (
        <>
            <Navbar expand="lg" className='navbar-main' expanded={expanded}>
                <Container fluid className="navbar-container">
                    <div className="navbar-left">
                        <Navbar.Brand onClick={() => onNavigate('home')}>
                            <div className='aref-ruqaa-regular gold nav-title logo-container unselectable display-1'>
                                <img src={logo} alt="Logo" className="nav-logo" />
                                متعلمو العربية
                            </div>
                        </Navbar.Brand>
                        {
                            currentPage === 'home' && !isLoggedIn ? null : (
                                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
                            )
                        }
                    </div>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {currentPage === 'home' && !isLoggedIn ? null : (
                                <>
                                    <Nav.Link onClick={() => handleNavigate('home')}>Home</Nav.Link>
                                    <Nav.Link onClick={() => handleNavigate('about')}>About</Nav.Link>
                                </>
                            )}
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link onClick={() => handleNavigate('tools')}>Tools</Nav.Link>
                                    <Nav.Link onClick={() => handleNavigate('quiz')}>Quizzes</Nav.Link>
                                    <Nav.Link onClick={() => handleNavigate('cheatsheet')}>Cheatsheets</Nav.Link>
                                    {createExtraButtons}
                                </>
                            ) : (
                                <>
                                    {currentPage === 'home' ? null : (
                                        <Nav.Link onClick={() => handleNavigate('')}>Login</Nav.Link>
                                    )}
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
                                    <NavDropdown.Item onClick={() => onNavigate('meet-team')}>
                                        Meet the Team
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => setShowFeedback(true)}>
                                        Feedback
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                <>
                                    <NavDropdown.Item onClick={() => onNavigate('')}>
                                        Login
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => onNavigate('meet-team')}>
                                        Meet the Team
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>
                    </div>
                </Container>
            </Navbar>
            <AppFeedback show={showFeedback} handleClose={handleCloseFeedback} />
        </>
    );
}

export default MyNavBar;
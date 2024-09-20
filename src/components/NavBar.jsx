import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
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
                        <Nav>
                            <NavDropdown
                                id="user-dropdown"
                                title={<span className='aref-ruqaa-regular gold dropdown-title'>انا</span>}
                                menuVariant="dark"
                                align={{ lg: 'end' }}
                            >
                                {isLoggedIn ? (
                                    <>
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
                        </Nav>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavBar;
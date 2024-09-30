import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '/logo_main.svg';
import './NavBar.css';

const MyNavBar = ({ onNavigate }) => {
    const [expanded, setExpanded] = useState(false);

    const handleNavigate = (path) => {
        onNavigate(path);
        setExpanded(false);
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" expanded={expanded}>
            <Container>
                <Navbar.Brand onClick={() => onNavigate('home')}>
                    <div className='aref-ruqaa-regular gold nav-title logo-container unselectable'>
                        <img src={logo} alt="Logo" className="nav-logo" />
                        متعلمو العربية
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => handleNavigate('home')}>Home</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate('wordsflashcard')}>Flashcards</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate('wordspractice')}>Vocab Quiz</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate('verbs')}>Conjugation Quiz</Nav.Link>
                    </Nav>
                    <div className="d-flex align-items-center">
                        <span className="me-3">Follow the developer:</span>
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

export default MyNavBar
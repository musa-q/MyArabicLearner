import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import VerbsPage from '../VerbsPage';
import '../QuizTypesPage.css';
import PossessiveEndingsPage from './PossessiveEndingsPage';
import VerbConjugationPage from './VerbConjugationPage';

const CheatsheetTypesPage = () => {
    const [cheatsheetType, setCheatsheetType] = useState(null);

    const chooseCheatsheetType = () => {
        return (
            <div className="choose-type-container">
                <h1>Choose a cheatsheet type</h1>
                <div className="buttons-list">
                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickCheatsheetType('PossessiveEndings')}>
                        Possessive Endings
                    </Button>
                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickCheatsheetType('VerbConjugation')}>
                        Verb Conjugation
                    </Button>
                </div>
            </div>
        );
    };

    const clickCheatsheetType = (userType) => {
        setCheatsheetType(userType);
    };

    const loadCheatsheetPage = () => {
        if (cheatsheetType === 'PossessiveEndings') {
            return <PossessiveEndingsPage />;
        } else if (cheatsheetType === 'VerbConjugation') {
            return <VerbConjugationPage />;
        } else if (cheatsheetType === 'VerbConjugationCheatsheet') {
            return <VerbsPage />;
        }
        return null;
    };

    return (
        <div>
            {cheatsheetType === null ? chooseCheatsheetType() : loadCheatsheetPage()}
        </div>
    );
};

export default CheatsheetTypesPage;

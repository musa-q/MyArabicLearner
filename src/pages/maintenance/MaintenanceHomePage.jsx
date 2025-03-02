import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import '../QuizTypesPage.css';
import EditCategoriesPage from './EditCategoriesPage';
import CheckVocabPage from './CheckVocabPage';
import CheckVerbPage from './CheckVerbPage';

const MaintenanceHomePage = () => {
    const [maintenanceType, setMaintenanceType] = useState(null);

    const chooseMaintenanceType = () => {
        return (
            <div className="choose-type-container">
                <h1>Choose a maintenance type</h1>
                <div className="buttons-list">
                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickMaintenanceType('CategoryNames')}>
                        Edit category names
                    </Button>
                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickMaintenanceType('Vocab')}>
                        Edit vocab
                    </Button>
                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickMaintenanceType('VerbsConjugation')}>
                        Edit verbs Conjugation
                    </Button>
                </div>
            </div>
        );
    };

    const clickMaintenanceType = (userType) => {
        setMaintenanceType(userType);
    };

    const loadMaintenancePage = () => {
        if (maintenanceType === 'CategoryNames') {
            return <EditCategoriesPage />;
        } else if (maintenanceType === 'Vocab') {
            return <CheckVocabPage />;
        } else if (maintenanceType === 'VerbsConjugation') {
            return <CheckVerbPage />;
        }
        return null;
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            {maintenanceType === null ? chooseMaintenanceType() : loadMaintenancePage()}
        </div>
    );
}

export default MaintenanceHomePage;
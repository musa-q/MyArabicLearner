import { useState } from 'react';
import { motion } from "framer-motion";
import { BookOpen, ScrollText, ArrowLeft } from 'lucide-react';
import { Container, Button } from 'react-bootstrap';
import PossessiveEndingsPage from './PossessiveEndingsPage';
import VerbConjugationPage from './VerbConjugationPage';

const CheatsheetTypesPage = () => {
    const [cheatsheetType, setCheatsheetType] = useState(null);

    const cheatsheetTypes = [
        {
            id: 'PossessiveEndings',
            title: 'Possessive Endings',
            description: 'Learn about Arabic possessive endings',
            icon: BookOpen
        },
        {
            id: 'VerbConjugation',
            title: 'Verb Conjugation',
            description: 'Master Arabic verb conjugations',
            icon: ScrollText
        },
    ];

    const handleBack = () => {
        setCheatsheetType(null);
    };

    const CheatsheetTypeCard = ({ cheatsheetType }) => {
        const Icon = cheatsheetType.icon;

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 p-4 rounded-lg cursor-pointer border border-gray-700 hover:border-purple-500 mb-3"
            >
                <div
                    onClick={() => setCheatsheetType(cheatsheetType.id)}
                >
                    <Container className="d-flex justify-content-start">
                        <div style={{ padding: '20px', marginRight: '10px' }}>
                            <Icon className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1 display-6">
                                {cheatsheetType.title}
                            </h3>
                            <p className="text-gray-400 text-sm lead">
                                {cheatsheetType.description}
                            </p>
                        </div>
                    </Container>
                </div>
            </motion.div>
        );
    };

    const renderContent = () => {
        switch (cheatsheetType) {
            case 'PossessiveEndings':
                return (
                    <div>
                        <div className="mb-4 px-4 mt-3">
                            <Button
                                onClick={handleBack}
                                className="flex items-center"
                                variant="outline-light"
                            >
                                <div className="lead">
                                    <ArrowLeft className="me-2" />
                                    Back to flashcards
                                </div>
                            </Button>
                        </div>
                        <PossessiveEndingsPage />
                    </div>
                );
            case 'VerbConjugation':
                return (
                    <div>
                        <div className="mb-4 px-4 m-3">
                            <Button
                                onClick={handleBack}
                                className="flex items-center"
                                variant="outline-light"
                            >
                                <div className="lead">
                                    <ArrowLeft className="me-2" />
                                    Back to flashcards
                                </div>
                            </Button>
                        </div>
                        <VerbConjugationPage />
                    </div>
                );
            default:
                return null;
        }
    };

    if (cheatsheetType) {
        return renderContent();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center gold pt-5 pb-4 display-4">
                        Choose a Cheatsheet Type
                    </h1>

                    <div className="space-y-4">
                        {cheatsheetTypes.map((type) => (
                            <CheatsheetTypeCard key={type.id} cheatsheetType={type} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CheatsheetTypesPage;
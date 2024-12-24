import { useState } from 'react';
import { motion } from "framer-motion";
import { BookOpen, ScrollText, ArrowLeft, Hammer, XCircle, Sigma } from 'lucide-react';
import { Container, Button } from 'react-bootstrap';
import PossessiveEndingsPage from './PossessiveEndingsPage';
import VerbConjugationPage from './VerbConjugationPage';
import SentenceConstructionPage from './SentenceConstructionPage';
import NegationPage from './NegationPage';
import PluralisationCheatsheet from './PluralisationCheatsheet';

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
        {
            id: 'SentenceConstructionPage',
            title: 'Constructing A Sentence',
            description: 'Learn how to make basic sentences in Arabic',
            icon: Hammer
        },
        {
            id: 'NegationPage',
            title: 'Negation',
            description: 'How to make negative statements',
            icon: XCircle
        },
        {
            id: 'PluralisationCheatsheet',
            title: 'Plurals in Arabic',
            description: 'Master regular and irregular plurals',
            icon: Sigma
        },
    ];

    const handleBack = () => {
        setCheatsheetType(null);
    };

    const CheatsheetTypeCard = ({ cheatsheetType }) => {
        const Icon = cheatsheetType.icon;

        const handleClick = () => {
            window.scrollTo(0, 0);
            setCheatsheetType(cheatsheetType.id);
        };

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-lg cursor-pointer border mb-3"
            >
                <div
                    onClick={() => handleClick()}
                >
                    <Container className="d-flex justify-content-start">
                        <div style={{ padding: '20px', marginRight: '10px' }}>
                            <Icon />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1 display-6">
                                {cheatsheetType.title}
                            </h3>
                            <p className="text-sm lead">
                                {cheatsheetType.description}
                            </p>
                        </div>
                    </Container>
                </div>
            </motion.div>
        );
    };

    const BackButton = () => (
        <div className="mb-0 px-4 mt-3">
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCheatsheetType(null);
                }}
                className="flex items-center text-decoration-none text-white"
                variant="link"
            >
                <div className="lead">
                    <ArrowLeft className="me-2" />
                    Back to cheatsheets
                </div>
            </Button>
        </div>
    );

    const renderContent = () => {
        const components = {
            PossessiveEndings: PossessiveEndingsPage,
            VerbConjugation: VerbConjugationPage,
            SentenceConstructionPage: SentenceConstructionPage,
            NegationPage: NegationPage,
            PluralisationCheatsheet: PluralisationCheatsheet
        };

        const Component = components[cheatsheetType];

        return Component ? (
            <div>
                <BackButton />
                <Component />
            </div>
        ) : null;
    };

    if (cheatsheetType) {
        return renderContent();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8" style={{ minHeight: "100vh" }}>
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
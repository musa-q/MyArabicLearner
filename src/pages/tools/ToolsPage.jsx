import { motion } from "framer-motion";
import { BookOpen, ClipboardPlus, ClipboardList } from 'lucide-react';
import { Container, Button } from 'react-bootstrap';

const ToolsPage = ({ onNavigate }) => {
    const ToolsTypes = [
        {
            id: 'wordsflashcard',
            title: 'Flash Cards',
            description: 'Practice vocabulary with interactive flashcards',
            icon: BookOpen
        },
        {
            id: 'verbconjugationvisualiser',
            title: 'Verb Conjugation Visualiser',
            description: 'Visualise the conjugation of Arabic verbs',
            icon: ClipboardPlus
        },
        {
            id: 'vocabvisualiser',
            title: 'Vocab Visualiser',
            description: 'Visualise the vocabulary of Arabic words',
            icon: ClipboardList
        },

    ];


    const ToolsTypeCard = ({ ToolsType }) => {
        const Icon = ToolsType.icon;

        const handleClick = () => {
            window.scrollTo(0, 0);
            onNavigate(ToolsType.id);
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
                                {ToolsType.title}
                            </h3>
                            <p className="text-sm lead">
                                {ToolsType.description}
                            </p>
                        </div>
                    </Container>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8" style={{ minHeight: "100vh" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="font-bold text-center gold pt-5 pb-4 display-4">
                        Practice Tools
                    </h1>

                    <div className="space-y-4">
                        {ToolsTypes.map((type) => (
                            <ToolsTypeCard key={type.id} ToolsType={type} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ToolsPage;
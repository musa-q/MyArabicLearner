import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { BookOpen, ScrollText } from 'lucide-react';
import { Container, Spinner, Button } from 'react-bootstrap';

const QuizTypesPage = ({ onNavigate }) => {
    const [selectedQuizType, setSelectedQuizType] = useState(null);

    useEffect(() => {
        if (selectedQuizType) {
            if (selectedQuizType === 'VocabQuiz') {
                onNavigate('vocab-quiz');
            } else if (selectedQuizType === 'VerbConjugationQuiz') {
                onNavigate('verb-quiz');
            }
        }
    }, [selectedQuizType, onNavigate]);

    const quizTypes = [
        {
            id: 'VocabQuiz',
            title: 'Vocabulary Quiz',
            description: 'Practice and test your vocabulary knowledge',
            icon: BookOpen
        },
        {
            id: 'VerbConjugationQuiz',
            title: 'Verb Conjugation Quiz',
            description: 'Master verb conjugations and tenses',
            icon: ScrollText
        }
    ];

    const QuizTypeCard = ({ quizType }) => {
        const Icon = quizType.icon;

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 border mb-3"
                style={{ 'cursor': 'pointer' }}
            >
                <div
                    onClick={() => setSelectedQuizType(quizType.id)}
                >
                    <Container className="d-flex justify-content-start">
                        <div style={{ padding: '20px', marginRight: '10px' }}>
                            <Icon />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1 display-6">
                                {quizType.title}
                            </h3>
                            <p className="lead">
                                {quizType.description}
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
                    <h1 className="text-3xl font-bold text-center gold pt-5 pb-4 display-4">
                        Choose a Quiz Type
                    </h1>

                    <div className="space-y-4">
                        {quizTypes.map((quizType) => (
                            <QuizTypeCard key={quizType.id} quizType={quizType} />
                        ))}
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default QuizTypesPage;
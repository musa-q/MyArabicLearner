import { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { BookOpen, ScrollText } from 'lucide-react';
import { Container, Spinner, Button } from 'react-bootstrap';
import WordsPracticePage from './WordsPracticePage';
import VerbsPage from './VerbsPage';

const QuizTypesPage = () => {
    const [selectedQuizType, setSelectedQuizType] = useState(null);

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
                className="bg-gray-800 p-4 rounded-lg cursor-pointer border border-gray-700 hover:border-purple-500 mb-3"
            >
                <div
                    onClick={() => setSelectedQuizType(quizType)}
                >
                    <Container className="d-flex justify-content-start">
                        <div style={{ padding: '20px', marginRight: '10px' }}>
                            <Icon className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-1 display-6">
                                {quizType.title}
                            </h3>
                            <p className="text-gray-400 text-sm lead">
                                {quizType.description}
                            </p>
                        </div>
                    </Container>

                </div>
            </motion.div>
        );
    };

    if (selectedQuizType) {
        return selectedQuizType === 'VocabQuiz' ? <WordsPracticePage /> : <VerbsPage />;
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
import { useState, useEffect } from 'react';
import FlashCards from '../components/FlashCards';
import './FlashCardsPage.css'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { capitaliseWords } from '../utils';
import { API_URL } from '../config';
import { ArrowLeft } from 'lucide-react';

const FlashCardsPage = ({ wordsList, category_name, onBack }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [pageTitle, setPageTitle] = useState("Words Practice");

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.post(`${API_URL}/flashcards/get-category-flashcards`,
                    {
                        category_id: wordsList,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const data = await response.data;
                setFlashcards(data.words);
                setPageTitle(data.title);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flash-cards-page-container">
            <div className="max-w-4xl mx-auto ">
                <div className="back-button-container">
                    <Button
                        onClick={onBack}
                        className="flex items-center"
                        variant="outline-light"
                    >
                        <ArrowLeft className="me-2" />
                        Back to groups
                    </Button>
                </div>
                <h1 className='gold'>{category_name ? capitaliseWords(category_name) : capitaliseWords(pageTitle)}</h1>

                <div>
                    <FlashCards flashcards={flashcards} />
                </div>
            </div>
        </div>

    );
};

export default FlashCardsPage;
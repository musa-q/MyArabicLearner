import { useState, useEffect } from 'react';
import FlashCards from '../components/FlashCards';
import './FlashCardsPage.css'
import axios from 'axios';
import { capitaliseWords } from '../utils';
import { API_URL } from '../config';

const FlashCardsPage = ({ wordsList, category_name }) => {
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
            <h1>{category_name ? capitaliseWords(category_name) : capitaliseWords(pageTitle)}</h1>
            <div>
                <FlashCards flashcards={flashcards} />
            </div>
        </div>
    );
};

export default FlashCardsPage;

import { useState, useEffect } from 'react';
import FlashCards from '../../components/FlashCards';
import './FlashCardsPage.css'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { capitaliseWords } from '../../utils';
import { API_URL } from '../../config';
import { ArrowLeft } from 'lucide-react';
import { authManager } from '../../utils';

const FlashCardsPage = ({ wordsList, category_name, onBack }) => {
    const [flashcards, setFlashcards] = useState([]);
    const [pageTitle, setPageTitle] = useState("Words Practice");

    useEffect(() => {
        const fetchData = async () => {
            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);
            try {
                const response = await axios.post(`${API_URL}/flashcards/get-category-flashcards`,
                    {
                        category_id: wordsList,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-Device-ID': deviceId,
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
        <div className="flash-cards-page-container" style={{ minHeight: "100vh" }}>
            <div className="max-w-4xl mx-auto ">
                <div className="back-button-container">
                    <Button
                        onClick={onBack}
                        className="flex items-center text-decoration-none text-white"
                        variant="link"
                    >
                        <div className="lead">
                            <ArrowLeft className="me-2" />
                            Back to groups
                        </div>
                    </Button>
                </div>
                <h1 className='gold pb-2 display-4'>{category_name ? capitaliseWords(category_name) : capitaliseWords(pageTitle)}</h1>

                <div>
                    <FlashCards flashcards={flashcards} />
                </div>
            </div>
        </div>

    );
};

export default FlashCardsPage;
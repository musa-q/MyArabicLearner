import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './ChooseWordsPage.css';
import axios from 'axios';
import { capitaliseWords } from '../utils';
import { API_URL } from '../config';

const ChooseWordsPage = ({ onChoose, title, setCategoryname }) => {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchFileList = async () => {
            try {
                const response = await axios.get(`${API_URL}/flashcards/get-all-category-names`);
                setFileList(response.data);
            } catch (error) {
                console.error('Error fetching file list:', error);
            }
        };
        fetchFileList();
    }, []);

    const handleCategoryClick = async (categoryId, name) => {
        try {
            onChoose(categoryId);
            setCategoryname(name);
        } catch (error) {
            console.error('Error sending category ID:', error);
        }
    };

    return (
        <div className="choose-words-page-container">
            <h1>{capitaliseWords(title)}</h1>
            <div className="buttons-list">
                {fileList.map((category) => (
                    <Button
                        className="button p-3"
                        variant="outline-light"
                        type="button"
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id, category.category_name)}
                    >
                        {capitaliseWords(category.category_name)}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ChooseWordsPage;
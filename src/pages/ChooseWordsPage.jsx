import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { Container, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';
import { capitaliseWords } from '../utils';
import { API_URL } from '../config';
import { motion } from "framer-motion";
import { extractCategory, extractSubcategory } from '../utils';

const ChooseWordsPage = ({ onChoose, title, setCategoryname }) => {
    const [fileList, setFileList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    const groupedCategories = useMemo(() => {
        const groups = {};
        fileList.forEach(category => {
            const extractedCategoryName = extractCategory(category.category_name);
            if (!groups[extractedCategoryName]) {
                groups[extractedCategoryName] = [];
            }
            groups[extractedCategoryName].push(category);
        });
        return groups;
    }, [fileList]);

    // Filter categories based on search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return fileList;
        return fileList.filter(category =>
            category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [fileList, searchQuery]);

    useEffect(() => {
        const fetchFileList = async () => {
            const token = localStorage.getItem('authToken');
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.post(
                    `${API_URL}/flashcards/get-all-category-names`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setFileList(response.data);
            } catch (error) {
                setError('Failed to load categories. Please try again later.');
                console.error('Error fetching file list:', error);
            } finally {
                setIsLoading(false);
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

    const CategoryCard = ({ category }) => {
        const subcategory = category.category_name;
        const displayText = subcategory || category.category_name || 'Unnamed Category';

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
            >
                <button
                    onClick={() => handleCategoryClick(category.id, category.category_name)}
                    className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200
                             flex items-center justify-between group border border-gray-700 hover:border-purple-500"
                >
                    <div className="flex items-center w-full">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <span className="text-left text-lg text-gray-200 ms-2 lead">
                            {capitaliseWords(displayText)}
                        </span>
                    </div>
                </button>
            </motion.div>
        );

    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden lead">Loading results...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-6 text-center gold pt-5 mb-4 display-4">
                        {capitaliseWords(title)}
                    </h1>

                    {/* Search Bar Toggle */}
                    <div className="relative mb-6 pb-4">
                        <Search
                            className="text-gray-500"
                            onClick={() => setShowSearch(!showSearch)}
                            style={{ cursor: 'pointer' }}
                        />
                        {showSearch && (
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="py-2 ms-2"
                                style={{ width: '60%' }}
                            />
                        )}
                    </div>

                    {/* Category List */}
                    <div className="space-y-4">
                        {searchQuery && showSearch ? (
                            filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <CategoryCard key={category.id} category={category} />
                                ))
                            ) : (
                                <p className="text-center text-gray-400 lead">No categories found.</p>
                            )
                        ) : (
                            selectedGroup ? (
                                <div>
                                    <Button
                                        onClick={() => setSelectedGroup(null)}
                                        className="flex items-center mb-4 text-decoration-none text-white"
                                        variant="link"
                                    >
                                        <div className="lead">
                                            <ArrowLeft className="w-4 h-4 mr-2 me-2" />
                                            Back to groups
                                        </div>
                                    </Button>
                                    <div className="space-y-3">
                                        {groupedCategories[selectedGroup].map((category) => (
                                            <CategoryCard key={category.id} category={category} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // Show category groups
                                Object.entries(groupedCategories).map(([group, categories]) => (
                                    <motion.div
                                        key={group}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-gray-800 p-4 rounded-lg cursor-pointer
                                                 border border-gray-700 hover:border-purple-500 mb-3"
                                        onClick={() => setSelectedGroup(group)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-semibold mb-1 display-6">
                                                    {capitaliseWords(group)}
                                                </h3>
                                                <p className="text-gray-400 text-sm lead">
                                                    {categories.length} categories
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ChooseWordsPage;

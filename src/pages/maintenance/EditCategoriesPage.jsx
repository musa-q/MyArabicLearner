import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../config';
import { authManager } from '../../utils';

const EditCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(
                `${API_URL}/flashcards/get-all-category-names`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories');
        }
    };

    const handleEditCategory = (category) => {
        setEditedCategory({ ...category });
        setShowModal(true);
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const handleShowAddModal = () => {
        setShowAddModal(true);
        setNewCategoryName('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDeleteModal(false);
        setShowAddModal(false);
        setEditedCategory(null);
        setCategoryToDelete(null);
        setNewCategoryName('');
        setError('');
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setEditedCategory(prev => ({ ...prev, category_name: value }));
    };

    const handleNewCategoryInputChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleSaveCategory = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(
                `${API_URL}/maintenance/update-category`,
                {
                    category_id: editedCategory.id,
                    new_name: editedCategory.category_name
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            if (response.data.success) {
                const updatedCategories = categories.map(cat =>
                    cat.id === editedCategory.id ? editedCategory : cat
                );
                setCategories(updatedCategories);
                handleCloseModal();
            } else {
                setError(response.data.message || 'Failed to update category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            setError('Failed to save category');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(
                `${API_URL}/maintenance/add-category`,
                {
                    category_name: newCategoryName
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            if (response.data.success) {
                await fetchCategories();
                handleCloseModal();
            } else {
                setError(response.data.message || 'Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Failed to add category');
        }
    };

    const handleConfirmDelete = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(
                `${API_URL}/maintenance/delete-category`,
                {
                    category_id: categoryToDelete.id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            if (response.data.success) {
                const updatedCategories = categories.filter(
                    cat => cat.id !== categoryToDelete.id
                );
                setCategories(updatedCategories);
                handleCloseModal();
            } else {
                setError(response.data.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category');
        }
    };

    return (
        <Container className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Edit Categories</h1>
                <Button
                    onClick={handleShowAddModal}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New Category
                </Button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Table className="w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Category Name</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id} className="border-t">
                            <td className="px-4 py-2">{category.category_name}</td>
                            <td className="px-4 py-2 space-x-2">
                                <Button
                                    onClick={() => handleEditCategory(category)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDeleteCategory(category)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedCategory && (
                        <Form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={editedCategory.category_name}
                                    onChange={handleInputChange}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSaveCategory();
                                        }
                                    }}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleCloseModal}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveCategory}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {categoryToDelete && (
                        <p>
                            Are you sure you want to delete the category "{categoryToDelete.category_name}"?
                            This action cannot be undone.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleCloseModal}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={handleNewCategoryInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCategory();
                                    }
                                }}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleCloseModal}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddCategory}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EditCategoriesPage;
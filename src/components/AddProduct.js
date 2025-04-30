import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AddProduct = ({ fetchData }) => {
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setProductName('');
    setProductDescription('');
    setProductPrice('');
  };

  // Handle form submission and send a POST request to backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in as an admin');
      return;
    }

    const newProduct = {
      name: productName,
      description: productDescription,
      price: productPrice,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: result.message || 'Product Added Successfully',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });

      fetchData();
      handleCloseModal();

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  // Check if all fields are filled
  const isFormValid = productName && productDescription && productPrice;

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Add Product
      </Button>

      {/* Add Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="productName" className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productDescription" className="mb-3">
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="productPrice" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!isFormValid} // Disable the button if the form is invalid
              >
                Save Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddProduct;

import React, { useState, useEffect } from 'react';
import { Button, Modal, Container, Row, Col, Card, Form } from 'react-bootstrap';

const AdminView = ({ productsData, fetchData }) => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    if (!Array.isArray(productsData)) return;
  
    const productsArr = productsData.map(product => ({
      ...product,
      isActive: product.isActive === 'true' || product.isActive === true
    }));
    setProducts(productsArr);
  }, [productsData]);

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
      const response = await fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const result = await response.json();
      console.log('Product added successfully:', result);


      fetchData(); 

      handleCloseModal(); 

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Header>
              <h3>Admin Dashboard</h3>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="text-center mb-3">
                  <Button variant="primary" onClick={handleShowModal}>
                    Add Product
                  </Button>
                </Col>
                <Col md={6} className="text-center mb-3">
                  <Button variant="secondary">
                    Show Orders
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminView;

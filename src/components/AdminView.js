import React, { useState, useEffect } from 'react';
import { Button, Modal, Container, Row, Col, Card, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AdminView = ({ productsData, fetchData }) => {
  // State variables
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Store the filtered products
  const [searchQuery, setSearchQuery] = useState(''); // Store the search query
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage] = useState(10); 

  useEffect(() => {
    if (!Array.isArray(productsData)) return;

    const productsArr = productsData.map(product => ({
      ...product,
      isActive: product.isActive === 'true' || product.isActive === true
    }));
    setProducts(productsArr);
    setFilteredProducts(productsArr); // Set filtered products initially as all products
  }, [productsData]);

  useEffect(() => {
    // Filter products whenever search query changes
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, products]);

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
     
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.message || 'Product Added Successfully',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })

      fetchData();
      handleCloseModal();

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination range logic
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getPageNumbersToDisplay = () => {
    const rangeSize = 3; 
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    if (endPage - startPage < rangeSize - 1) {
      if (currentPage <= 3) {
        endPage = Math.min(rangeSize, totalPages);
      } else {
        startPage = Math.max(totalPages - rangeSize + 1, 1);
      }
    }

    return pageNumbers.slice(startPage - 1, endPage);
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
          {/* Button Row */}
          <Row className="mb-4">
            <Col md={6} className="text-center">
              <Button variant="primary" onClick={handleShowModal}>
                Add Product
              </Button>
            </Col>
            <Col md={6} className="text-center">
              <Button variant="secondary">
                Show Orders
              </Button>
            </Col>
          </Row>

          {/* Search Bar */}
          <Row className="mb-4">
            <Col md={12} className="text-center">
              <Form.Control
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
          </Row>

          {/* Product Table */}
          <Row className="mb-4">
            <Col md={12}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="text-center">
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>{product.isActive ? 'Active' : 'Inactive'}</td>
                      <td>
                        <Button variant="warning">Edit</Button>
                      </td>
                      <td>
                        <Button variant="danger">Archive</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Pagination Controls */}
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <div>
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                >
                  Prev
                </Button>

                {currentPage > 3 && (
                  <>
                    <Button variant="outline-primary" onClick={() => paginate(1)}>
                      1
                    </Button>
                    <span>...</span>
                  </>
                )}

                {getPageNumbersToDisplay().map((number) => (
                  <Button
                    key={number}
                    variant="outline-primary"
                    className={currentPage === number ? 'active' : ''}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </Button>
                ))}

                {currentPage < totalPages - 2 && (
                  <>
                    <span>..</span>
                    <Button variant="outline-primary" onClick={() => paginate(totalPages)}>
                      {totalPages}
                    </Button>
                  </>
                )}

                <Button
                  variant="outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
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
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Product
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
</Container>

  );
};

export default AdminView;

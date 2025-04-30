import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import AddProduct from './AddProduct'; // Import AddProduct
import ProductDetails from './ProductDetails'; // Import ProductDetails
import ShowOrders from './ShowOrders'; // Import ShowOrders

const AdminView = ({ productsData, fetchData }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showOrders, setShowOrders] = useState(false);  // Track which component to show
  const [buttonText, setButtonText] = useState("Show Orders"); // Button text

  useEffect(() => {
    if (!Array.isArray(productsData)) return;

    const productsArr = productsData.map(product => ({
      ...product,
      isActive: product.isActive === 'true' || product.isActive === true
    }));
    setProducts(productsArr);
    setFilteredProducts(productsArr);
  }, [productsData]);

  // Filter products based on search query
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page after a search
  }, [searchQuery, products]);

  // Pagination logic

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbersToDisplay = () => {
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const toggleComponent = () => {
    setShowOrders(prev => !prev);
    setButtonText(prev => prev === "Show Orders" ? "Show Product Details" : "Show Orders");
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
                  <AddProduct fetchData={fetchData} /> {/* Render AddProduct component */}
                </Col>
                <Col md={6} className="text-center">
                  <Button 
                    variant={showOrders ? "danger" : "success"} 
                    onClick={toggleComponent}
                  >
                    {buttonText}
                  </Button>
                </Col>
              </Row>

              {/* Conditional Rendering */}
              {showOrders ? (
                <ShowOrders fetchData={fetchData} />  // Render ShowOrders component
              ) : (
                <ProductDetails
                  products={filteredProducts}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  paginate={paginate}
                  getPageNumbersToDisplay={getPageNumbersToDisplay}
                  totalPages={totalPages}
                  fetchData={fetchData}
                  searchQuery={searchQuery}  // Pass search query to ProductDetails
                  setSearchQuery={setSearchQuery} // Pass setSearchQuery to handle changes in ProductDetails
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminView;

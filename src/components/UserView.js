import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

export default function UserView({
  productsData,
  onLoadMore,
  canLoadMore,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData);
  }, [productsData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <Container className="mt-5 mb-5">
      {/* Search and Sort Inputs */}
      <Form className="mb-4">
        <Row>
          <Col md={8} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Col>
          <Col md={4}>
            <Form.Select value={sortOption} onChange={handleSortChange}>
              <option value="">Sort by</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {/* Product Cards */}
      <Row className="mt-4 gx-4 gy-4">
        {products.map((product) => (
          <ProductCard key={product._id} productProp={product} />
        ))}
      </Row>

      {/* Load More Button */}
      {canLoadMore && (
        <Row className="mt-4">
          <Col className="text-center">
            <Button onClick={onLoadMore} variant="outline-primary">
              Load More ..
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

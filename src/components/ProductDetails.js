import React from 'react';
import { Table, Button, Row, Col, Form, Badge } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';



const ProductDetails = ({ products, currentPage, itemsPerPage, paginate, getPageNumbersToDisplay, totalPages, fetchData, searchQuery, setSearchQuery }) => {
  // Calculate the current products for pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      {/* Search Bar (only appears when viewing ProductDetails) */}
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
          <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Image</th><th>Availability</th><th colSpan={2}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product) => (
          <tr key={product._id} className="text-center">
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>₱{Number(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                />
              ) : (
                <span>No image available</span>
              )}
            </td>
            <td className="text-center">
              {product.isActive ? (
                <Badge bg="success" className="d-flex align-items-center justify-content-center gap-1 p-2">
                  <FaCheckCircle /> Available
                </Badge>
              ) : (
                <Badge bg="danger" className="d-flex align-items-center justify-content-center gap-1 p-2">
                  <FaTimesCircle /> Unavailable
                </Badge>
              )}
            </td>
            <td><EditProduct product={product} fetchData={fetchData} /></td>
            <td><ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Col>
</Row>



{/* Pagination Controls */}
<Row className="justify-content-center">
  <Col md={6} className="text-center">
    <div className="pagination-controls">
      <Button
        variant="outline-primary"
        disabled={currentPage === 1}
        onClick={() => paginate(currentPage - 1)}
        className="mx-1"
      >
        Prev
      </Button>

      {currentPage > 3 && (
        <>
          <Button variant="outline-primary" onClick={() => paginate(1)} className="mx-1">
            1
          </Button>
          <span className="mx-1">...</span>
        </>
      )}

      {getPageNumbersToDisplay().map((number) => (
        <Button
          key={number}
          variant="outline-primary"
          className={`mx-1 ${currentPage === number ? 'active' : ''}`}
          onClick={() => paginate(number)}
        >
          {number}
        </Button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          <span className="mx-1">..</span>
          <Button variant="outline-primary" onClick={() => paginate(totalPages)} className="mx-1">
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline-primary"
        disabled={currentPage === totalPages}
        onClick={() => paginate(currentPage + 1)}
        className="mx-1"
      >
        Next
      </Button>
    </div>
  </Col>
</Row>

    </>
  );
};

export default ProductDetails;

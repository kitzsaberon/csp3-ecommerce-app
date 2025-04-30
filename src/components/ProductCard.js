import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Helper function to format the price
const formatPrice = (price) => {
  return price.toLocaleString('en-US', { style: 'currency', currency: 'PHP' });
};

export default function ProductCard({ productProp }) {
  const { _id, name, description, price, image } = productProp;

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 shadow-sm rounded-lg border-light card-hover overflow-hidden">
        
        {/* Product Image */}
        {image && (
          <Card.Img
            variant="top"
            src={image}
            alt={name}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )}

        <Card.Body className="d-flex flex-column justify-content-between p-3">
          <div className="mb-3">
            <Card.Title className="fw-bold text-dark">{name}</Card.Title>
            <Card.Text className="text-muted small">
              {description.length > 100 ? `${description.slice(0, 100)}...` : description}
            </Card.Text>
          </div>

          <Card.Text className="mb-2">
            <strong className="text-dark">Price:</strong> {formatPrice(price)}
          </Card.Text>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between align-items-center">
          <Link
            variant="primary"
            className="btn w-100 text-dark link-hover"
            to={`/products/${_id}`}
          >
            View Product
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}

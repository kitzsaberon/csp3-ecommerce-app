import {Card, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default function ProductCard ({productProp}) {

    const {_id, name, description, price} = productProp;

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
        <Card className="h-100 shadow-sm">
          <Card.Body className="d-flex flex-column justify-content-between">
            <div>
              <Card.Title className="fw-bold text-primary">{name}</Card.Title>
              <Card.Text className="text-muted small">{description}</Card.Text>
            </div>
            <div>
              <Card.Text className="mb-2">
                <strong>Price:</strong> PHP {price}
              </Card.Text>
              <Link className="btn btn-outline-primary w-100 mt-auto" to={`/product/${_id}`}>
                View Product
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    )
}
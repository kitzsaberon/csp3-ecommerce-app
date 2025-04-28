import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props) {
    const {breakPoint, data} = props

    const {_id, name, description, price} = data;

    return (
        <Col xs={12} md={breakPoint} className="mb-4">
            <Card className="shadow-sm h-100 border-0 rounded-4">
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-center mb-3">
                        <Link to={`/products/${_id}`} className="text-decoration-none text-primary fw-bold">
                            {name}
                        </Link>
                    </Card.Title>
                    <Card.Text className="text-muted text-center flex-grow-1">
                        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                    </Card.Text>
                </Card.Body>
    
                <Card.Footer className="bg-white border-0 text-center">
                    <h5 className="mb-3 text-success">₱{price}</h5>
                    <Link
                        className="btn btn-outline-primary w-100 fw-semibold rounded-pill"
                        to={`/products/${_id}`}
                    >
                        View Details
                    </Link>
                </Card.Footer>
            </Card>
        </Col>
    );
    
}
import { Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProducts(props) {
    const { data } = props;
    const { _id, name, description, price, image } = data;

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow-lg h-100 border-0 rounded-3 overflow-hidden">
                
                {/* Product Image */}
                {image && (
                    <Card.Img
                        variant="top"
                        src={image}
                        alt={name}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                )}

                <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="text-center mb-4">
                        <Link
                            to={`/products/${_id}`}
                            className="text-decoration-none text-primary fw-bold fs-5"
                        >
                            {name}
                        </Link>
                    </Card.Title>

                    <Card.Text className="text-muted text-center flex-grow-1 mb-4">
                        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                    </Card.Text>
                </Card.Body>

                <Card.Footer className="bg-light border-0 text-center p-4">
                    <h5 className="mb-3 text-success fs-4">
                        ₱{price.toLocaleString('en-PH', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </h5>

                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant="outline-primary"
                            className="fw-semibold rounded-pill"
                            as={Link}
                            to={`/products/${_id}`}
                        >
                            View Product
                        </Button>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    );
}

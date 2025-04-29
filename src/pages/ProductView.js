import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import UserContext from '../context/UserContext';

export default function ProductView() {
    const { user } = useContext(UserContext);
    const { productId } = useParams();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1); 

    function addToCart(productId) {
        fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/add-to-cart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        })
        .then(async res => {
            if (res.status === 403) {
                Swal.fire('Forbidden', 'Admin access is not allowed.', 'error');
            } else if (res.status === 400) {
                Swal.fire('Missing Information', 'Product ID and Quantity are required.', 'warning');
            } else if (res.status === 404) {
                Swal.fire('Not Found', 'Product not found or inactive.', 'warning');
            } else if (res.status === 200) {
                Swal.fire('Success', 'Successfully added to cart!', 'success');
            } else {
                Swal.fire('Server Error', 'Internal Server Error. Please contact support.', 'error');
            }
        })
        .catch(() => {
            Swal.fire('Network Error', 'Failed to connect to the server.', 'error');
        });
    }

    useEffect(() => {
        fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/${productId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [productId]);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <Container>
            <Row>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>{name}</Card.Title>
                            <Card.Subtitle>Description:</Card.Subtitle>
                            <Card.Text>{description}</Card.Text>
                            <Card.Subtitle>Price:</Card.Subtitle>
                            <Card.Text>${price}</Card.Text>

                            <InputGroup className="mb-3 justify-content-center">
                                <Button variant="outline-secondary" onClick={decreaseQuantity}>-</Button>
                                <FormControl
                                    value={quantity}
                                    readOnly
                                    className="text-center"
                                    style={{ width: "60px" }}
                                />
                                <Button variant="outline-secondary" onClick={increaseQuantity}>+</Button>
                            </InputGroup>

                            {
                                user.id !== null ? (
                                    <Button variant="primary" className="w-100" onClick={() => addToCart(productId)}>
                                        Add to Cart
                                    </Button>
                                ) : (
                                    <Link className="btn btn-danger w-100" to="/login">
                                        Login to Add to Cart
                                    </Link>
                                )
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

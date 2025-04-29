import {useState, useEffect, useContext} from 'react'
import {Container, Card, Button, Row, Col} from 'react-bootstrap';
import {useParams, useNavigate, Link} from 'react-router-dom'
import UserContext from '../context/UserContext';

export default function CourseView(){

    const navigate = useNavigate();

    const { courseId } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);


    function enroll(courseId) {
        fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/add-to-cart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                enrolledCourses: [{ courseId }],
                totalPrice: price
            })
        })
        .then(async res => {
    
            if (res.status === 403) {
                alert("Admin Forbidden");
            } else if (res.status === 409) {
                alert("Already enrolled in this course.");
            } else if (res.status === 201) {
                alert("Successfully Added to Cart");
                navigate("/products");
            } else {
                alert("Internal Server Error. Notify system admin.");
            }
        })
        .catch(() => {
            alert("Failed to connect to the server.");
        });
    }
    
    useEffect(() => {
        fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/${courseId}`)
        .then(res => res.json())
        .then(data => {

            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
        })
    }, [courseId]);

    return (
        <Container>
                <Row>
                    <Col lg={{span: 6, offset: 3}}>
                        <Card>
                            <Card.Body className='text-center'>
                                <Card.Title>{name}</Card.Title>
                                <Card.Subtitle>Description:</Card.Subtitle>
                                <Card.Text>{description}</Card.Text>
                                <Card.Subtitle>Price:</Card.Subtitle>
                                <Card.Text>{price}</Card.Text>
                                <Card.Subtitle>Class Schedule:</Card.Subtitle>
                                <Card.Text>8AM - 5PM </Card.Text>
                                {
                                    user.id !== null?
                                    <Button variant='primary' block='true' onClick={() => enroll( courseId)}>Enroll</Button>
                                    :
                                    <Link className='btn btn-danger btn-block' to='/login'> Login to Enroll </Link>
                                }
                                
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
        </Container>
    )
}
import React, { useContext, useEffect, useState } from 'react'
import {Container, Row, Col, Card} from 'react-bootstrap'
import UserContext from '../context/UserContext';
import {Navigate} from 'react-router-dom';

export default function MyProfile() {

    const  {user} = useContext(UserContext);
    const [details, setDetails] = useState(null);

    const fetchDetails = () => {

        fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/users/details', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(userData => {

            if(userData){
                setDetails(userData);
            } else {
                alert('User not found')
            }
            
        })
        .catch(() => {
            alert('Something went wrong')
        })
    }

    useEffect(() => {

        if(user.id) {

            fetchDetails();
        }
    }, [user.id]);

    if (user.id === null) {

        return <Navigate to="/products"></Navigate>
    }

    return (
        
        <Container className='mt-5'>

            <Row className='justity-content-center'>

            <Card className="text-white bg-primary mb-4">
                    <Card.Body>
                        <Card.Title className='mb-4 text-center'>My Profile</Card.Title>
                        { details ? (

                            <>
                                <Card.Text className='mb-4 text-center'>
                                <strong>
                                    {details.firstName.charAt(0).toUpperCase() + details.firstName.slice(1).toLowerCase()} 
                                    {' '}
                                    {details.lastName.charAt(0).toUpperCase() + details.lastName.slice(1).toLowerCase()}
                                    </strong>
                                </Card.Text>
                                <hr className="bg-light" />
                                <Card.Text className="mt-4">
                                    <strong>Contacts</strong>
                                </Card.Text>
                                <ul className="list-unstyled">
                                    <li><strong>Email:</strong> {details.email}</li>
                                    <li><strong>Mobile No:</strong> {details.mobileNo}</li>
                                </ul>
                            </>
                        ) : (
                                <p>Loading Details</p>
                        )}                   
                    </Card.Body>
                </Card>

            </Row>
        </Container>
    )

}
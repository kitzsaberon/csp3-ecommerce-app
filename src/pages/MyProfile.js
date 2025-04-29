import React, { useContext, useEffect, useState } from 'react'
import {Container, Row, Col, Card} from 'react-bootstrap'
import UserContext from '../context/UserContext';
import {Navigate} from 'react-router-dom';
import UpdateProfile from '../components/UpdateProfile';
import ResetPassword from '../components/ResetPassword.js';

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
        <Container className="mt-5">
        <Row className="justify-content-center">
          <Card className="bg-light shadow-sm rounded-lg w-100" style={{ maxWidth: '600px' }}>
            <Card.Body>
              <Card.Title className="text-center text-dark mb-4">
                <h3>My Profile</h3>
              </Card.Title>
              {details ? (
                <>
                  {/* Full Name */}
                  <Card.Text className="text-center mb-4">
                    <h5>
                      <strong>
                        {details.firstName.charAt(0).toUpperCase() + details.firstName.slice(1).toLowerCase()}
                        {' '}
                        {details.lastName.charAt(0).toUpperCase() + details.lastName.slice(1).toLowerCase()}
                      </strong>
                    </h5>
                  </Card.Text>
  
                  <hr className="bg-dark mb-4" />
  
                  {/* Contact Information */}
                  <Card.Text className="font-weight-bold">Contacts</Card.Text>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Email: </strong>
                      <span>{details.email}</span>
                    </li>
                    <li>
                      <strong>Mobile No: </strong>
                      <span>{details.mobileNo}</span>
                    </li>
                  </ul>
                </>
              ) : (
                <p className="text-center">Loading Details...</p>
              )}
            </Card.Body>
          </Card>
        </Row>
        <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Update Profile</Card.Title>
              <UpdateProfile onUpdate={fetchDetails} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Reset Password</Card.Title>
              <ResetPassword />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    )

}
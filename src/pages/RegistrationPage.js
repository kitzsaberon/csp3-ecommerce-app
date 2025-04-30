import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';


const RegistrationPage = () => {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {

    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo.length === 11 &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);


  function registerUser(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success === true) {
        // Registration was successful
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobileNo("");
        setPassword("");
        setConfirmPassword("");

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message || 'Registration successful',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });

      } else if (data.success === false) {
        // Display error message from data.message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Something went wrong',
          confirmButtonColor: '#d33'
        });
      }
    })
    .catch(error => {
      // Catch network errors or other issues
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'There was an issue with the registration process.',
        confirmButtonColor: '#d33'
      });
    });
}

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="text-center">
              <h3>Register</h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={registerUser}>
                {/* First Name and Last Name */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Email */}
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                {/* Mobile Number */}
                <Form.Group controlId="formMobile" className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter mobile number"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    maxLength={11} // Limit input length to 11 digits
                  />
                </Form.Group>

                {/* Password and Verify Password */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formVerifyPassword">
                      <Form.Label>Verify Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  {isActive ? (
                    <Button variant="success" type="submit" id="submitBtn">
                      Submit
                    </Button>
                  ) : (
                    <Button variant="danger" type="submit" id="submitBtn" disabled>
                      Submit
                    </Button>
                  )}
                </div>
              </Form>

              {/* "Already Have an Account?" section */}
              <div className="mt-3 text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="btn btn-link">Click here to login</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationPage;

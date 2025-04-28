import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';

export default function Login() {
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  function authenticate(e) {
    e.preventDefault();

    fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/users/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.access !== undefined) {
        localStorage.setItem('token', data.access);
        retrieveUserDetails(data.access);
        setEmail('');
        setPassword('');

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'You are now logged in!',
          confirmButtonColor: '#3085d6'
        });
      } else if (data.message === "Incorrect email or password") {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'Incorrect email or password',
          confirmButtonColor: '#d33'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: `${email} does not exist`,
          text: 'Please check your email and try again',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  function retrieveUserDetails(token) {
    fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/users/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setUser({
        id: data._id,
        isAdmin: data.isAdmin
      });
    });
  }

  useEffect(() => {
    if (email !== '' && password !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  return (
    user.id !== null ? 
      <Navigate to="/products" /> :
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="p-4 shadow-lg">
              <h1 className="text-center mb-4">Login</h1>
              <Form onSubmit={(e) => authenticate(e)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">

                { 
                  isActive ? 
                    <Button variant="primary" type="submit" block>
                      Login
                    </Button>
                  : 
                    <Button variant="danger" type="submit" block disabled>
                      Login
                    </Button>
                }
                  <Button variant="outline-secondary" onClick={() => alert('Reset password functionality coming soon!')}>
                    Forgot Password?
                  </Button>
				  </div>
                <hr />

                <Button variant="outline-danger" className="w-100 mb-3" onClick={() => alert('Google login coming soon!')}>
                  Sign in with Google
                </Button>

                <p className="text-center">
                  Don't have an account? <a href="/register">Sign up</a>
                </p>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
  );
}

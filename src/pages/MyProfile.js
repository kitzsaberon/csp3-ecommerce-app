// src/pages/MyProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import { FaEnvelope, FaPhoneAlt, FaEdit, FaLock } from 'react-icons/fa'; // Icons for UI
import UpdateProfile from '../components/UpdateProfile';
import ResetPassword from '../components/ResetPassword';

export default function MyProfile() {
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const fetchDetails = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        if (userData) {
          setDetails(userData);
        } else {
          alert('User not found');
        }
        setLoading(false);
      })
      .catch(() => {
        alert('Something went wrong');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user.id) {
      fetchDetails();
    }
  }, [user.id]);

  if (user.id === null) {
    return <Navigate to="/products" />;
  }

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="bg-light shadow-sm rounded-lg w-100">
            <Card.Body>
              <Card.Title className="text-center text-dark mb-4">
                <h3>My Profile</h3>
              </Card.Title>

              {loading ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                details && (
                  <>
                    {/* Full Name */}
                    <div className="text-center mb-4">
                      <h5>
                        <strong>
                          {details.firstName.charAt(0).toUpperCase() +
                            details.firstName.slice(1).toLowerCase()}{' '}
                          {details.lastName.charAt(0).toUpperCase() +
                            details.lastName.slice(1).toLowerCase()}
                        </strong>
                      </h5>
                    </div>

                    <hr className="bg-dark mb-4" />

                    {/* Contact Information */}
                    <Card.Text className="font-weight-bold">Contacts</Card.Text>
                    <ul className="list-unstyled">
                      <li>
                        <FaEnvelope /> <strong>Email:</strong> {details.email}
                      </li>
                      <li>
                        <FaPhoneAlt /> <strong>Mobile No:</strong> {details.mobileNo}
                      </li>
                    </ul>
                    <hr className="bg-dark mb-4" />

                    {/* Action Buttons */}
                    <div className="text-center">
                    <Button 
                      variant="primary" 
                      className="mb-3 me-2"  // Added margin-bottom to create space
                      onClick={() => handleShowModal('update')}
                    >
                      <FaEdit /> Update Profile
                    </Button>
                    <Button 
                      variant="warning" 
                      className="mb-3 me-2"  // Added margin-bottom to create space
                      onClick={() => handleShowModal('reset')}
                    >
                      <FaLock /> Reset Password
                    </Button>
                  </div>
                  </>
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'update' ? 'Update Profile' : 'Reset Password'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'update' ? (
            <UpdateProfile currentDetails={details} onUpdate={fetchDetails} />
          ) : (
            <ResetPassword />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

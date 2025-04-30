// src/components/UpdateProfile.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';

const UpdateProfile = ({ currentDetails, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: ''
  });

  // Initialize form data with current details
  useEffect(() => {
    if (currentDetails) {
      setFormData({
        firstName: currentDetails.firstName,
        lastName: currentDetails.lastName,
        email: currentDetails.email,
        mobileNo: currentDetails.mobileNo
      });
    }
  }, [currentDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Call your API to update user details
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        onUpdate(); // Callback to refresh user details in MyProfile
        alert('Profile updated successfully!');
      })
      .catch(() => {
        alert('Error updating profile');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formMobileNo">
        <Form.Label>Mobile No</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Mobile No"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
      </Button>
    </Form>
  );
};

export default UpdateProfile;

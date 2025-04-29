// src/components/ResetPassword.js
import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match!');
      setLoading(false);
      return;
    }

    // Call your API to reset the password
    await fetch('https://your-api-endpoint.com/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(passwords)
    })
      .then((res) => res.json())
      .then(() => {
        alert('Password reset successfully!');
      })
      .catch(() => {
        alert('Error resetting password');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCurrentPassword">
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Current Password"
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formNewPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter New Password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formConfirmPassword">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm New Password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
      </Button>
    </Form>
  );
};

export default ResetPassword;

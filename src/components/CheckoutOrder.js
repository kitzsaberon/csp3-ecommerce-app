import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';

const CheckoutOrder = ({ userId, resetCart }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (response.ok) {
        // Reset the cart
        if (typeof resetCart === 'function') {
          resetCart();
        }

        // Show success modal
        await Swal.fire({
          title: 'Order Placed!',
          text: 'Your order has been successfully checked out.',
          icon: 'success',
          confirmButtonText: 'Go to Orders'
        });

        // Redirect to success/orders page
        navigate('/products');
      } else {
        setErrorMessage(data.message || 'Checkout failed.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during checkout.');
    }

    setLoading(false);
  };

  return (
<Row className="mb-3">
  <Col md={12}> {/* Or adjust based on your grid structure */}
        <button
        className="btn btn-success py-3 px-4 w-100"
        onClick={handleCheckout}
        disabled={loading}
        style={{
          fontWeight: 'bold', // Bold text for emphasis
          borderRadius: '30px', // Rounded corners
          boxShadow: '0 4px 8px rgba(0, 128, 0, 0.2)', // Subtle shadow for depth
          transition: 'background-color 0.3s, transform 0.3s', // Smooth transition for hover effects
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        {loading ? 'Processing...' : 'Checkout Order'}
      </button>

    {errorMessage && (
      <div className="alert alert-danger mt-3" role="alert">
        {errorMessage}
      </div>
    )}
  </Col>
</Row>

  );
};

export default CheckoutOrder;

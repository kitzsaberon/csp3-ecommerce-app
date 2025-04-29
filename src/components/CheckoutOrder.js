import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CheckoutOrder = ({ userId, resetCart }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/orders/checkout', {
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
    <div className="container mt-4">
      <button
        className="btn btn-primary w-100"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Checkout Order'}
      </button>

      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default CheckoutOrder;

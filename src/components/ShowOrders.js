import React, { useEffect, useState } from 'react';

const ShowOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');

    // Check if the token exists and set it in the request headers
    fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/orders/all-orders', {
      method: 'GET', // Default is 'GET', but it's explicitly set here
      headers: {
        'Authorization': `Bearer ${token}`, // Add the token as Bearer
        'Content-Type': 'application/json', // Ensure content type is JSON (if required by API)
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json();
      })
      .then(data => {
        setOrders(data.orders || []);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []); // Empty dependency array to only run on component mount

  return (
    <div>
      <h4>Orders</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={order._id || index}>
              <strong>User:</strong> {order.userId?.email || 'Unknown'} <br />
              <strong>Email:</strong> {order.userId?.email || 'N/A'} <br />
              <strong>Total:</strong> ₱{order.totalPrice} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Ordered On:</strong> {new Date(order.orderedOn).toLocaleString()} <br />
              {order.productOrdered && order.productOrdered.length > 0 && (
                <div>
                  <strong>Products Ordered:</strong>
                  <ul>
                    {order.productOrdered.map((product, i) => (
                      <li key={i}>
                        Product ID: {product.productId}, Quantity: {product.quantity}, Subtotal: ₱{product.subtotal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowOrders;

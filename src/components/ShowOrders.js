import React, { useEffect, useState } from 'react';

const ShowOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/orders/all-orders')
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
  }, []);

  return (
    <div>
      <h4>Orders</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={order._id || index}>
              <strong>User:</strong> {order.userId?.name || 'Unknown'} <br />
              <strong>Email:</strong> {order.userId?.email || 'N/A'} <br />
              <strong>Total:</strong> ₱{order.totalPrice} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Ordered On:</strong> {new Date(order.orderedOn).toLocaleString()}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowOrders;

import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import UserContext from '../context/UserContext';

function OrderHistory() {
  const { user } = useContext(UserContext); // ✅ Access user from context

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch order history');
        }
        return res.json();
      })
      .then((data) => {
        console.log("Logged-in User ID:", user?.id);  
        console.log('Data', data);
        setOrders(data.orders || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Order History</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <Alert variant="info">You have no past orders.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th># of Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>{order.products.length}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  );
}

export default OrderHistory;

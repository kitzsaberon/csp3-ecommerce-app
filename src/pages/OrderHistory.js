import React, { useEffect, useState, useContext } from 'react';
import { Container, Table, Spinner, Alert, Card } from 'react-bootstrap';
import UserContext from '../context/UserContext';

function OrderHistory() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
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
        setOrders(data.orders || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Order History</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading your order history...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <Card className="p-4 text-center">
              <Alert variant="info">
                You have no past orders.
              </Alert>
            </Card>
          ) : (
            <Table striped bordered hover responsive className="shadow-sm">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th># of Items</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.orderedOn).toLocaleDateString()}</td>
                    <td>₱{order.totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{order.productOrdered.length}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
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

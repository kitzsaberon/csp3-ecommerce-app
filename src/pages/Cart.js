import { useEffect, useState, useContext, useCallback } from "react";
import { Container, Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import UserContext from "../context/UserContext";
import CartContext from "../context/CartContext";
import Swal from 'sweetalert2';
import CheckoutOrder from '../components/CheckoutOrder';
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { Notyf } from 'notyf';

export default function Cart() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchCart = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setCart(data.cart || { cartItems: [], totalPrice: 0 });
      })
      .catch(() => {
        setError("Failed to load cart.");
      });
  }, [setCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    setUpdatingId(productId);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productId, newQuantity })
      });

      if (res.ok) {
        fetchCart();
        notyf.success("Product Quantity Updated");
      } else {
        throw new Error();
      }
    } catch {
      notyf.error("Could not update quantity.");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId) => {
    setUpdatingId(productId);
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ productId })
    });

    if (res.ok) {
      fetchCart();
      notyf.success("Item removed from cart.");
    } else {
      notyf.error("Failed to remove item.");
    }
    setUpdatingId(null);
  };

  const clearCart = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will remove all items from your cart.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    });

    if (result.isConfirmed) {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        setCart({ cartItems: [], totalPrice: 0 });
        Swal.fire("Cleared", "Cart is now empty.", "success").then(() => {
          navigate("/products");
        });
      } else {
        Swal.fire("Error", "Could not clear cart.", "error");
      }
    }
  };

  const resetCart = () => {
    setCart({ cartItems: [], totalPrice: 0 });
    fetchCart();
  };

  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!cart || cart.cartItems.length === 0) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Alert variant="danger" className="text-center w-100 p-4">
        <h4>Your cart is empty.</h4>
        <Button
          variant="success"
          onClick={() => navigate("/products")}
          className="mt-3 px-5 py-2" 
          style={{
            fontSize: '1.2rem',
            borderRadius: '30px',
            textTransform: 'uppercase',
          }}
        >
          Shop Now <FaShoppingCart />
        </Button>
      </Alert>
    </Container>
  );

  return (
    <Container>
      <h3>Your Cart</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.cartItems.map(item => {
            const product = item.productId || {};
            const productId = product._id || item.productId;

            return (
              <tr key={productId}>
                <td>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                    />
                  )}
                  <strong>{product.name || "Unnamed Product"}</strong><br />
                  <small>{product.description || "No description"}</small>
                </td>
                <td>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={updatingId === productId}
                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                  >
                    <FaMinus />
                  </Button>{" "}
                  <Form.Control
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(productId, parseInt(e.target.value))}
                    min={1}
                    style={{ display: "inline-block", width: "60px", textAlign: "center" }}
                    disabled={updatingId === productId}
                  />{" "}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={updatingId === productId}
                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                  >
                    <FaPlus />
                  </Button>
                </td>
                <td>₱{item.subtotal.toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeItem(productId)}
                    disabled={updatingId === productId}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="2"><strong>Total</strong></td>
            <td colSpan="2"><strong>₱{cart.totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </Table>
      <Row className="mb-3">
        <Col md={6}>
          <Button
            onClick={clearCart}
            className="btn btn-danger w-100 py-3 px-4"
            style={{
              fontWeight: 'bold',
              borderRadius: '30px',
              boxShadow: '0 4px 8px rgba(255, 0, 0, 0.2)',
              transition: 'background-color 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} 
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Clear Cart
          </Button>
        </Col>
        <Col md={6}>
          <CheckoutOrder userId={user.id} resetCart={resetCart} />
        </Col>
      </Row>
    </Container>
  );
}

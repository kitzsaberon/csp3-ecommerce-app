import { useEffect, useState, useContext, useCallback } from "react";
import { Container, Table, Button, Alert, Form, Row, Col } from "react-bootstrap";
import UserContext from "../context/UserContext";
import CartContext from "../context/CartContext";
import Swal from "sweetalert2";
import CheckoutOrder from "../components/CheckoutOrder";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

export default function Cart() {
  const { user } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  // Fetch current cart from API, wrapped with useCallback
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/get-cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setCart(data.cart || { cartItems: [], totalPrice: 0 });
    } catch (err) {
      setError("Failed to load cart. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [setCart]);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Include fetchCart in the dependency array

  // Update cart item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingId(productId);
    try {
      const res = await fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/update-cart-quantity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, newQuantity }),
      });
      if (!res.ok) throw new Error();
      await fetchCart();
      Swal.fire({ icon: "success", title: "Updated!", text: "Quantity updated.", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Could not update quantity.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove a cart item
  const removeItem = async (productId) => {
    setUpdatingId(productId);
    try {
      const res = await fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/${productId}/remove-from-cart`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error();
      await fetchCart();
      Swal.fire({ icon: "success", title: "Removed!", text: "Item removed.", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to remove item.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove all items from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/clear-cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error();
        setCart({ cartItems: [], totalPrice: 0 });
        Swal.fire("Cleared", "Cart is now empty.", "success").then(() => navigate("/products"));
      } catch {
        Swal.fire("Error", "Could not clear cart.", "error");
      }
    }
  };

  // Reset cart state and re-fetch
  const resetCart = () => {
    setCart({ cartItems: [], totalPrice: 0 });
    fetchCart();
  };

  // UI states
  if (loading) {
    return (
      <Container>
        <p className="text-center">Loading cart...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Alert variant="danger" className="text-center w-100 p-4">
          <h4>Your cart is empty.</h4>
          <Button
            variant="success"
            onClick={() => navigate("/products")}
            className="mt-3 px-5 py-2"
            style={{ fontSize: "1.2rem", borderRadius: "30px", textTransform: "uppercase" }}
          >
            Shop Now <FaShoppingCart />
          </Button>
        </Alert>
      </Container>
    );
  }

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
          {cart.cartItems.map((item) => {
            const product = item.productId || {};
            const productId = product._id || item.productId;
            const subtotal = item.subtotal ?? 0;

            return (
              <tr key={productId}>
                <td>
                  <strong>{product.name || "Unnamed Product"}</strong>
                  <br />
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
                    disabled={updatingId === productId}
                    style={{ display: "inline-block", width: "60px", textAlign: "center" }}
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
                <td>₱{subtotal.toFixed(2)}</td>
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
              fontWeight: "bold",
              borderRadius: "30px",
              boxShadow: "0 4px 8px rgba(255, 0, 0, 0.2)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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

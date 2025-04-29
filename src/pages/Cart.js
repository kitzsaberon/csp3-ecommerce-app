import { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import UserContext from "../context/UserContext";
import CartContext from "../context/CartContext";
import Swal from 'sweetalert2';

export default function Cart() {
  const { user } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    setLoading(true);
    fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/get-cart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.cart) {
          setCart(data.cart);
        } else {
          setError("Cart not found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cart.");
        setLoading(false);
      });
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    setUpdatingId(productId);

    try {
      const res = await fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/update-cart-quantity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ productId, newQuantity })
      });

      if (res.ok) {
        fetchCart();
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Product quantity updated.",
          timer: 1200,
          showConfirmButton: false
        });
      } else {
        throw new Error();
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not update quantity."
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId) => {
    setUpdatingId(productId);
    const res = await fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/${productId}/remove-from-cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ productId })
    });

    if (res.ok) {
      fetchCart();
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "Item removed from cart.",
        timer: 1200,
        showConfirmButton: false
      });
    } else {
      Swal.fire("Error", "Failed to remove item.", "error");
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
      const res = await fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/cart/clear-cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        setCart({ cartItems: [], totalPrice: 0 });
        Swal.fire("Cleared", "Cart is now empty.", "success");
      } else {
        Swal.fire("Error", "Could not clear cart.", "error");
      }
    }
  };

  if (loading) return <Container><p>Loading cart...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!cart || cart.cartItems.length === 0) return <Container><Alert variant="info">Your cart is empty.</Alert></Container>;

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
                  <strong>{product.name || "Unnamed Product"}</strong><br />
                  <small>{product.description || "No description"}</small>
                </td>
                <td>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={updatingId === productId}
                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                  >-</Button>{" "}
                  <Form.Control
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(productId, parseInt(e.target.value))}
                    min={1}
                    style={{ display: "inline-block", width: "60px", textAlign: "center" }}
                    disabled={updatingId === productId}
                  />{" "}
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={updatingId === productId}
                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                  >+</Button>
                </td>
                <td>₱{item.subtotal.toFixed(2)}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(productId)}
                    disabled={updatingId === productId}
                  >
                    Remove
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
      <Button variant="danger" onClick={clearCart} className="w-100">
        Clear Cart
      </Button>
    </Container>
  );
}

import { useEffect, useState, useContext } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import UserContext from "../context/UserContext";
import CartContext from "../context/CartContext"; // Import CartContext
import Swal from 'sweetalert2';

export default function Cart() {
  const { user } = useContext(UserContext);
  const { cart, setCart } = useContext(CartContext); // Get cart from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, [setCart]);

  const fetchCart = () => {
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
    if (newQuantity <= 0) return; // Prevent quantity from going below 1

    const res = await fetch("https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/update-cart-quantity", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ productId, newQuantity })
    });

    if (res.ok) {
      fetchCart(); // Re-fetch the cart to reflect the updated quantity
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Product quantity updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update quantity.",
      });
    }
  };

  const removeItem = async (productId) => {
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
        text: "Product successfully removed from cart.",
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      alert("Failed to remove item.");
    }
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
        setCart({ cartItems: [], totalPrice: 0 }); // Clear cart in context immediately
        Swal.fire({
          icon: "success",
          title: "Cart Cleared",
          text: "All items have been removed from your cart.",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to clear the cart.",
        });
      }
    }
  };

  if (loading) return <Container><p>Loading cart...</p></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!cart || cart.cartItems.length === 0) return <Container><Alert variant="info">Your cart is empty.</Alert></Container>;

  return (
    <Container>
      <h3>Your Cart</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.cartItems.map(item => (
            <tr key={item._id || item.productId._id || item.productId}>
              <td>
                <strong>{item.productId.name}</strong><br />
                <small>{item.productId.description}</small>
              </td>
              <td>
                <Button variant="secondary" size="sm" onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity - 1)}>-</Button>
                {item.quantity}
                <Button variant="secondary" size="sm" onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity + 1)}>+</Button>
              </td>
              <td>₱{item.subtotal.toFixed(2)}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => removeItem(item.productId._id || item.productId)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
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

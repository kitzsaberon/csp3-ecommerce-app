import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import CartContext from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa'; 

function AppNavbar() {
  const { user } = useContext(UserContext);
  const { cart } = useContext(CartContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">K & G | E-Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user.id !== null ? (
              <>
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products">Products</Nav.Link>

                {/* Show My Cart and Order History only if user is not an admin */}
                {!user.isAdmin && (
                  <>
                  <Nav.Link as={NavLink} to="/cart">
                    <FaShoppingCart className="mr-2" />
                    {" "}My Cart 
                    {cart && cart.cartItems.length > 0 ? (
                      <strong className="ml-2 text-success">
                        {" "}({cart.cartItems.length})
                      </strong>
                    ) : (
                      <span className="ml-2 text-danger">(0)</span>
                    )}
                  </Nav.Link>
                    <Nav.Link as={NavLink} to="/order-history">
                      Order History
                    </Nav.Link>
                  </>
                )}
                <Nav.Link as={NavLink} to="/myProfile">My Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

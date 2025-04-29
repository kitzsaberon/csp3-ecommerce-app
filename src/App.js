import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate here
import { Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext'; 
import RegistrationPage from './pages/RegistrationPage';
import Products from './pages/Products';
import Logout from './pages/Logout';
import MyProfile from './pages/MyProfile';
import ProductView from './pages/ProductView';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  // function for clearing the local storage
  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  useEffect(() => {
    if(localStorage.getItem('token') !== null) {
      fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/users/details', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
      });
    } else {
      setUser({
        id: null,
        isAdmin: null
      });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <CartProvider> 
        <Router>
          <AppNavbar />
          <Container className="mt-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} /> {/* Anyone can view products */}
              <Route path="/myProfile" element={user.id ? <MyProfile /> : <Navigate to="/login" />} />
              <Route path="/cart" element={user.id ? <Cart /> : <Navigate to="/login" />} />
              <Route path="/products/:productId" element={<ProductView />} />
              
              {/* Prevent logged-in users from accessing login and registration pages */}
              <Route path="/login" element={user.id ? <Navigate to="/products" /> : <Login />} />
              <Route path="/register" element={user.id ? <Navigate to="/myProfile" /> : <RegistrationPage />} />

              <Route path="/order-history" element={user.id ? <OrderHistory /> : <Navigate to="/login" />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Container>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { Container } from 'react-bootstrap'; 
import AppNavbar from './components/AppNavbar'; 
import Home from './pages/Home';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';
import RegistrationPage from './pages/RegistrationPage';
import Products from './pages/Products';
import Logout from './pages/Logout';


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
            })
        })
        
    } else {
        setUser({
            id: null,
            isAdmin: null
        })
    }
    
}, [])


  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
    <Router>
      <AppNavbar />
      <Container className="mt-5">
        <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path="/products" element={<Products />} />
          <Route path="/profile" element={<Products />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<RegistrationPage />} /> 
          <Route path="/logout" element={<Logout />} /> 
        </Routes>
      </Container>
    </Router>
    </UserProvider>
  );
}

export default App;

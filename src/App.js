import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { Container } from 'react-bootstrap'; 
import AppNavbar from './components/AppNavbar'; 
import Home from './pages/Home';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="mt-5">
        <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path="/register" element={<RegistrationPage />} /> 
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

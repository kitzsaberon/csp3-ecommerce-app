import React from 'react';
import { Link } from 'react-router-dom'; 

function Home() {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1>Welcome to the K and G E-Commerce Store</h1>
            <p className="lead">Browse and shop the best products at unbeatable prices.</p>
            <Link to="/products">
              <button className="btn btn-primary btn-lg mt-4">Browse Products</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  

export default Home;

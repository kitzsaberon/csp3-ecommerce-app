import { useState, useEffect } from 'react';
import { Row, Spinner, Alert } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';

export default function FeaturedProducts() {

  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/active')
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          setError("No featured products available.");
          setLoading(false);
          return;
        }

        const featured = [];
        const numbers = new Set();

        // Helper function to generate a unique random number
        const generateRandomNumber = () => {
          let randomNum;
          do {
            randomNum = Math.floor(Math.random() * data.length);
          } while (numbers.has(randomNum));
          numbers.add(randomNum);
          return randomNum;
        };

        // Select 3 random featured products
        while (featured.length < 3) {
          const randomIndex = generateRandomNumber();
          featured.push(
            <PreviewProducts 
              data={data[randomIndex]} 
              key={data[randomIndex]._id} 
              breakPoint={4} 
            />
          );
        }

        setPreviews(featured);
        setLoading(false);
      })
      .catch(err => {
        setError("An error occurred while fetching products.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-center mb-4">Featured Products</h2>
      <Row className="justify-content-center">
        {previews}
      </Row>
    </>
  );
}

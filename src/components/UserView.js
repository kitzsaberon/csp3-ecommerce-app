import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import {Container, Row, Col} from 'react-bootstrap';

export default function UserView({productsData}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productsData)
  }, [productsData]);
  return (
    <>
    <Container className="mt-5 mb-5">

      <Row className="mt-4 gx-4 gy-4">
        {products.map(products => (
          <ProductCard key={products.id} productProp={products} />
        ))}
      </Row>
    </Container>
    </>
  );
}

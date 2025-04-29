import { useState, useEffect, useContext } from 'react';

import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  const fetchData = () => {

    const fetchUrl = user.isAdmin
      ? 'https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/all'
      : 'https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/active'

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched products:', data);
        setProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {user.isAdmin ? (
     <AdminView productsData={products} fetchData={fetchData} />

      ) : (
        <UserView productsData={products}/>
      )}
    </>
  );
}

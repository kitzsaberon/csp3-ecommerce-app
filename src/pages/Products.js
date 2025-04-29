import { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12); // Show 12 products initially

  const fetchData = () => {
    const fetchUrl = user.isAdmin
      ? 'https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/all'
      : 'https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/active';

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched products:', data);
        setProducts(data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 8); // Show 8 more products
  };

  const displayedProducts = products.slice(0, visibleProducts);

  return (
    <>
      {user.isAdmin ? (
        <AdminView productsData={displayedProducts} fetchData={fetchData} />
      ) : (
        <UserView productsData={displayedProducts} />
      )}

      {visibleProducts < products.length && (
        <div className="text-center mt-4">
          <button onClick={loadMoreProducts} className="btn btn-outline-primary">
            Load More .. 
          </button>
        </div>
      )}
    </>
  );
}

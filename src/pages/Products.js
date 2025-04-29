import { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';

export default function Products() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

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
        setProducts(data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 8);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  return (
    <>
      {user.isAdmin ? (
        <AdminView productsData={products} fetchData={fetchData} />
      ) : (
        <UserView
          productsData={displayedProducts}
          onLoadMore={loadMoreProducts}
          canLoadMore={visibleProducts < filteredProducts.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      )}
    </>
  );
}

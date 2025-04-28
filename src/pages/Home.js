import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import Banner from '../components/Banner';

function Home() {
  return (
    <>
      <section>
        <Banner />
      </section>
      
      <section>
        <FeaturedProducts />
      </section>
    </>
  );
}

export default Home;

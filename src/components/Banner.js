import { Link } from 'react-router-dom'; 
import { Carousel } from 'react-bootstrap'; 
import bannerImage1 from '../assets/images/banner-1.png'; 
import bannerImage2 from '../assets/images/banner-2.png'; 
import bannerImage3 from '../assets/images/banner-3.png'; 

export default function Banner() {
  return (
    <>
      {/* Banner Section with Background Image */}
      <section className="banner-section">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              {/* Search Input and Button */}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for products"
                  aria-label="Search for products"
                  aria-describedby="search-btn"
                />
                <button className="btn btn-outline-secondary" type="button" id="search-btn">
                  Search
                </button>
              </div>

              {/* Browse Products Button */}
              <Link to="/products">
                <button className="btn btn-primary btn-lg mt-4 mb-3">Browse Products</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section Below Banner */}
      <section className="carousel-section">
        <Carousel fade>
          <Carousel.Item>
            <div
              className="carousel-image"
              style={{
                backgroundImage: `url(${bannerImage1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
              }}
            >
              <div className="carousel-caption">
                <h3>Featured Products</h3>
                <p>Discover our new arrivals.</p>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="carousel-image"
              style={{
                backgroundImage: `url(${bannerImage2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
              }}
            >
              <div className="carousel-caption">
                <h3>New Arrivals</h3>
                <p>Check out our latest collection.</p>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              className="carousel-image"
              style={{
                backgroundImage: `url(${bannerImage3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
              }}
            >
              <div className="carousel-caption">
                <h3>Special Discounts</h3>
                <p>Get the best deals before they're gone!</p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>
    </>
  );
}

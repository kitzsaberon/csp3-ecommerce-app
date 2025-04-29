import { useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { Carousel } from 'react-bootstrap'; 
import bannerImage1 from '../assets/images/banner-1.png'; 
import bannerImage2 from '../assets/images/banner-2.png'; 
import bannerImage3 from '../assets/images/banner-3.png'; 
import AOS from 'aos'; // For animations
import 'aos/dist/aos.css'; // Import AOS styles
import Countdown from 'react-countdown'; // For countdown timer

export default function Banner() {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const countdownEndTime = Date.now() + 1000 * 60 * 60 * 24; // 24 hours countdown

  return (
    <>
      {/* Banner Section with Background Image */}
      <section className="banner-section">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center" data-aos="fade-up">

              {/* Additional CTA Buttons */}
              <Link to="/products">
                <button className="btn btn-warning mx-2">Shop Sale</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-outline-dark mx-2">Join Now</button>
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

      {/* Countdown Section */}
      <section className="countdown-section text-center mt-4">
        <h4 className="text-danger">Limited Time Offer!</h4>
        <p className="text-success">Hurry, only <Countdown date={countdownEndTime} /> left!</p>
      </section>

    </>
  );
}

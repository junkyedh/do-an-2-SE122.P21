import React from "react";
import sliderImg1 from "@/assets/banner-1.jpg";
import sliderImg2 from "@/assets/banner-2.jpg";
import sliderImg3 from "@/assets/banner-3.jpg";
import "./Banner.scss"
import { Carousel } from "react-bootstrap";

const Banner = () => {
  return (
    <>
      <section className="slider">
        <Carousel variant="dark">
          <Carousel.Item>
            <img src={sliderImg1} className="d-block w-100" alt="First slide" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  DISCOVER THE <span>PERFECT STAY</span>
                </h5>
                <p className="sub_text">
                  Experience comfort like never before with our world-class hotel services. 
                  From luxurious rooms to personalized amenities, we ensure every guest feels at home.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src={sliderImg2} className="d-block w-100" alt="Second slide" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  WHERE <span>LUXURY MEETS COMFORT</span>
                </h5>
                <p className="sub_text">
                  Our hotels redefine hospitality with elegant interiors, exceptional dining options, and 
                  unparalleled service. Your perfect getaway starts here.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img src={sliderImg3} className="d-block w-100" alt="Third slide" />
            <Carousel.Caption>
              <div className="slider_des">
                <h5 className="heading">
                  MAKE YOUR <span>STAY UNFORGETTABLE</span>
                </h5>
                <p className="sub_text">
                  Whether you’re traveling for business or leisure, our hotels provide the ultimate escape. 
                  Relax, recharge, and create memories that last a lifetime.
                </p>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>
    </>
  );
};

export default Banner;
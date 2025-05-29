import React from "react";
import "./Features.scss";

import feature1 from "@/assets/deal.png";
import feature2 from "@/assets/location.png";
import feature3 from "@/assets/medal.png";
import { Card, Col, Container, Row } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";

const Features = () => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: true,
          arrows: false,
        },
      },
    ],
  };

  const featureList = [
    {
      id: 1,
      image: feature3,
      title: "Stay in Style",
      des: "With a wide range of luxurious rooms and suites, find the perfect stay tailored to your needs.",
    },
    {
      id: 2,
      image: feature1,
      title: "Exclusive Offers",
      des: "Enjoy special discounts, complimentary services, and rewards to make your stay even better.",
    },
    {
      id: 3,
      image: feature2,
      title: "Effortless Booking",
      des: "Book instantly, manage your reservations, and enjoy free cancellations for a stress-free experience.",
    },
  ];

  return (
    <>
      <section className="feature-section">
        <Container>
          <Row>
            <Col md="12">
              <Slider {...settings}>
                {featureList.map((feature, inx) => {
                  return (
                    <Card key={inx}>
                      <Card.Img
                        variant="top"
                        src={feature.image}
                        className="img-fluid"
                        alt={feature.title}
                      />
                      <Card.Title>{feature.title}</Card.Title>
                      <Card.Text>{feature.des}</Card.Text>
                    </Card>
                  );
                })}
              </Slider>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Features;

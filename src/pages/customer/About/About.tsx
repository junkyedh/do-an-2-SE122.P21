import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import hotelImg1 from "@/assets/img1.jpg";
import hotelImg2 from "@/assets/banner-1.jpg";
import hotelImg3 from "@/assets/img3.jpg";
import hotelImg4 from "@/assets/img4.jpeg";
import hotelImg5 from "@/assets/img5.jpeg";
import about1 from "@/assets/view7.jpg";
import about2 from "@/assets/view8.jpg";
import about3 from "@/assets/lobby.jpeg";
import icons1 from "@/assets/delicious4.jpg";
import icons2 from "@/assets/spa.jpg";
import icons3 from "@/assets/tienich8.jpg";
import Breadcrumbs from "@/layouts/Breadcrumbs/Breadcrumbs";
import "./About.scss";

const About = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs title="About Us" pagename="About Us" />
      <section className="about-section py-5">
        <Container>
          {/* Introduction */}
          <Row className="mb-5">
            <Col md="12" className="text-center">
              <h1 className="lead mt-3">
                Welcome to our luxurious hotel, where comfort and class blend perfectly.
              </h1>
              <p className="mt-3">
                Located in the heart of a bustling city, our hotel is proud to offer an exceptional experience to every guest.
              </p>
            </Col>
          </Row>

          {/* Featured Services */}
          <Row className="mb-5">
            <Col md="12" className="text-center">
              <h2 className="fw-bold mb-4">Featured Services</h2>
              <p>
                We are proud to deliver top-notch services to meet all guest needs, from relaxation and dining to moments of wonderful entertainment.
              </p>
            </Col>
            <Col md="4">
              <Card className="border-0 shadow-sm rounded-3 text-center">
                <Card.Body>
                  <img src={icons1} alt="Room Service" className="mb-3 img-fluid" />
                  <Card.Title className="fw-bold">Premium Room Service</Card.Title>
                  <p>
                    Available 24/7 with a diverse menu from light breakfasts to luxurious meals. Our staff is always ready to meet your every request.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="border-0 shadow-sm rounded-3 text-center">
                <Card.Body>
                  <img src={icons2} alt="Spa" className="mb-3 img-fluid" />
                  <Card.Title className="fw-bold">Luxury Spa Experience</Card.Title>
                  <p>
                    Enjoy relaxing spa treatments, from therapeutic massages to premium skincare, helping you rejuvenate and balance your body.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="border-0 shadow-sm rounded-3 text-center">
                <Card.Body>
                  <img src={icons3} alt="Infinity Pool" className="mb-3 img-fluid" />
                  <Card.Title className="fw-bold">Infinity Pool</Card.Title>
                  <p>
                    Immerse yourself in cool blue water and admire the panoramic city views from our breathtaking rooftop infinity pool.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <section className="about-section py-4">
            <Container>
              {/* History */}
              <Row className="align-items-center mb-5">
                <Col md="6">
                <Card.Title className="fw-bold">HISTORY</Card.Title>
                  <p>
                    Over 20 years ago, we began our journey of building a hotel brand with the goal of becoming a symbol of luxury and elegance. Starting from a small hotel with just a few rooms, we continuously strived to enhance our services, expand our scale, and improve quality.

                    Throughout this time, we have had the privilege of serving thousands of customers from around the globe, including business travelers, tourists, and families seeking the perfect getaway. From luxurious banquets to intimate personal events, we have always been there to turn special moments into cherished memories.

                    We take pride in the fact that every step of our journey has contributed to creating a story, not just about our hotel but also about the connection between people, culture, and innovation. Our history is not just about numbers but a testament to our passion and commitment to quality and customer satisfaction.
                  </p>
                </Col>
                <Col md="6">
                  <img
                    src={about1}
                    alt="Hotel History"
                    className="img-fluid rounded shadow-sm"
                  />
                </Col>
              </Row>

              {/* Mission */}
              <Row className="align-items-center mb-5">
                <Col md="6" className="order-md-2">
                 <Card.Title className="fw-bold">MISSION</Card.Title>
                  <p className="mb-4">
                    Our mission is to provide customers with an unforgettable experience, from attentive service to a comfortable living space. We aim to go beyond offering accommodations by creating an environment where customers feel as welcomed as they would at home, but with elevated luxury and sophistication.

                    Every detail in our hotel, from interior design and relaxation spaces to amenities like spas, pools, and restaurants, is carefully crafted. We continuously improve to meet and exceed customer expectations, turning every trip into an unforgettable memory.

                    Moreover, we are committed to contributing positively to the local community through sustainable activities, collaborating with local suppliers, and organizing cultural events to create value not just for customers but for society as a whole.
                  </p>
                </Col>
                <Col md="6" className="order-md-1">
                  <img
                    src={about2}
                    alt="Hotel Mission"
                    className="img-fluid rounded shadow-sm"
                  />
                </Col>
              </Row>

              {/* Core Values */}
              <Row className="align-items-center mb-5">
                <Col md="6">
                  <Card.Title className="fw-bold">CORE VALUES</Card.Title>
                  <p>
                    Putting customers at the center, we always emphasize customer satisfaction as the greatest measure of success. Every member of our team understands that delivering exceptional service is not just a responsibility but also a source of pride and motivation for growth.

                    We are committed to excellence in every detail, from greeting customers with a genuine smile to providing top-notch services and continuously listening and improving to meet the diverse needs of our guests. For us, a satisfied customer is not just the result of our work but also a driving force for innovation and development.

                    Additionally, we uphold core values such as transparency, respect, and sustainability in all our business activities. We believe that by building long-term relationships with customers based on trust and quality, we can continue to grow and reach greater heights in the future.
                  </p>
                </Col>
                <Col md="6">
                  <img
                    src={about3}
                    alt="Hotel Core Values"
                    className="img-fluid rounded shadow-sm"
                  />
                </Col>
              </Row>
            </Container>
          </section>

          {/* Hotel Images */}
          <Col md="12" className="text-center mb-4">
              <h2 className="fw-bold">A Glimpse of Our Hotel</h2>
              <p>Explore the luxurious and comfortable spaces of our hotel through real images.</p>
            </Col>
          <Col className="mb-4">
              <Card className="border-0">
                <Card.Img src={hotelImg2} alt="view" className="rounded" />
              </Card>
          </Col>
          <Col className="mb-4">
              <Card className="border-0">
                <Card.Img src={hotelImg4} alt="view" className="rounded" />
              </Card>
          </Col>
          <Row className="hotel-images-section mb-5">
            <Col md="4" className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img src={hotelImg3} alt="Hotel Room" className="rounded img-fluid" />
              </Card>
            </Col>
            <Col md="4" className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img src={hotelImg1} alt="Infinity Pool" className="rounded img-fluid" />
              </Card>
            </Col>
            <Col md="4" className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Img src={hotelImg5} alt="Luxury Spa" className="rounded img-fluid" />
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;

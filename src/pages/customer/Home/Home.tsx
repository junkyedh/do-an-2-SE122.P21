import React, { useEffect, useState } from "react";
import Banner from "./partials/Banner/Banner";
import Search from "@/layouts/Search/Search";
import Features from "./partials/Features/Features";
import { Container, Row, Col, Button, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import "./Home.css";

import Cards from "@/layouts/Cards/Cards";
import ProductCard from "@/layouts/Cards/ProductCard";
import { MainApiRequest } from "@/services/MainApiRequest";


const Home = () => {
  var settings: Settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          autoplay: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
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
          arrows: false
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        },
      },
    ],
  };

  const [roomList, setRoomList] = useState<any[]>([]);
  const [visibleRooms, setVisibleRooms] = useState(8);
  const [tierList, setTierList] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchListRooms = async () => {
    const res = await MainApiRequest.get(`/room/filter-available`);
    console.log(res.data);
    setRoomList(res.data);
  };


  const fetchTierList = async () => {
    const res = await MainApiRequest.get('/room/tier/list');
    // console.log(res);
    setTierList(res.data);
  }

  useEffect(() => {
    fetchListRooms();
    fetchTierList();
  }, []);


  const handleShowMore = () => {
    navigate("/rooms");
  };


  return (
    <>
      <Banner />
      <Search tierList={tierList} />
      <Features />

      {/* room seciton start */}
      <section className="rooms_section slick_slider">
        <Container>
          <Row>
            <Col md="12">
              <div className="main_heading">
                <h1> Find Your Ideal Room For Your Next Stay </h1>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md="12">
              <Slider {...settings}>
                {/* {roomTierData.map((tier, inx) => {
                  return (
                    <Cards tier={tier} key={inx} />
                  );
                })} */}
                {
                  tierList.map((tier, inx) => {
                    return (
                      <Cards tier={tier} key={inx} />
                    );
                  })
                }
              </Slider>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="popular py-5">
        <Container>
          <Row>
            <Col md="12">
              <div className="main_heading">
                <h1> Popular Rooms </h1>
              </div>
            </Col>
          </Row>
          <Row>
            {roomList.slice(0, visibleRooms).map((val, inx) => {
              return (
                <Col md={3} sm={6} xs={12} className="mb-5" key={inx}>
                  <ProductCard val={val} />
                </Col>
              );
            })}
          </Row>
          {visibleRooms < roomList.length && (
            <Row>
              <Col md="12" className="text-center">
                <Button onClick={handleShowMore} variant="primary">
                  Show More
                </Button>
              </Col>
            </Row>
          )}
        </Container>

        {/* <Container>
          <div className="overflow-hidden rounded-2xl mt-5">
            <div className="w-100 rounded-2xl relative">
              <video
                loop
                muted
                autoPlay
                className="d-block w-100 object-cover rounded-2xl"
              >
                <source src={video} type="video/mp4" />
              </video>
            </div>
          </div>
        </Container> */}
      </section>

      <section className="call_us px-5">
        <Container>
          <Row className="align-items-center">
            <Col md="8">
              <h2 className="heading">
                READY FOR AN UNFORGETTABLE STAY? CHOOSE US!
              </h2>
              <p className="text">
                Experience exceptional comfort and luxury at our hotel. From elegant rooms
                to world-class amenities, we ensure every moment of your stay is unforgettable.
              </p>
            </Col>
            <Col md="4" className="text-center mt-3 mt-md-0">
              <Link
                to="/contact-us"
                className="secondary_btn bounce"
              >
                Contact Us!
              </Link>
            </Col>
          </Row>
        </Container>
        <div className="overlay px-5"></div>
      </section>

    </>
  );
};

export default Home;
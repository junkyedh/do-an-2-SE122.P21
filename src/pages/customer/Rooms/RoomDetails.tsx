import React, { useEffect, useState } from "react";
import "./Room.scss";
import ImageGallery from "react-image-gallery";
import { Container, Row, Col, Tab, Card, Stack, ListGroup } from "react-bootstrap";
import Breadcrumbs from "@/layouts/Breadcrumbs/Breadcrumbs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { MainApiRequest } from "@/services/MainApiRequest";
import moment from "moment";
import { maxHeight, minHeight, minWidth } from "@mui/system";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState<any>();

  const fetchRoomDetail = async () => {
    const res = await MainApiRequest.get(`/room/${id}`);
    setRoomDetail(res.data);
  }

  useEffect(() => {
    window.scroll(0, 0);

    fetchRoomDetail();
  }, []);

  const features = {
    isBalcony: roomDetail?.isBalcony,
    isBathroom: roomDetail?.isBathroom,
    isAirConditioner: roomDetail?.isAirConditioner,
    isFreeWifi: roomDetail?.isFreeWifi,
    isTelevision: roomDetail?.isTelevision,
    isRefrigerator: roomDetail?.isRefrigerator,
    isBreakfast: roomDetail?.isBreakfast,
    isLunch: roomDetail?.isLunch,
    isDinner: roomDetail?.isDinner,
    isSnack: roomDetail?.isSnack,
    isDrink: roomDetail?.isDrink,
    isParking: roomDetail?.isParking,
    isSwimmingPool: roomDetail?.isSwimmingPool,
    isGym: roomDetail?.isGym,
    isSpa: roomDetail?.isSpa,
    isLaundry: roomDetail?.isLaundry,
    isCarRental: roomDetail?.isCarRental,
    isBusService: roomDetail?.isBusService,
  }

  const featureIcons: { [key: string]: string } = {
    isBalcony: "bi-house",
    isTelevision: "bi-tv",
    isAirConditioner: "bi-fan",
    isBathroom: "bi-droplet",
    isFreeWifi: "bi-wifi",
    isRefrigerator: "bi-box",
    isBreakfast: "bi-cup",
    isLunch: "bi-cup",
    isDinner: "bi-spoon",
    isSnack: "bi-basket",
    isDrink: "bi-cup-straw",
    isParking: "bi-car-front",
    isSwimmingPool: "bi-person-workspace",
    isGym: "bi-droplet-half",
    isSpa: "bi-person-workspace",
    isLaundry: "bi-bucket",
    isCarRental: "bi-car-front",
    isBusService: "bi-bus-front",
  };

  const bookNowHandler = () => {
    navigate("/booking", {
      state: {
        roomId: roomDetail.id,
        roomTier: roomDetail.roomTier.name,
        roomName: roomDetail.name,
        checkInDate: moment().toDate(),
        checkOutDate: moment().add(1, 'days').toDate(),
        price: roomDetail.price
      }
    })
  };

  const hasRating = roomDetail?.ratings?.length > 0;
  const rating = hasRating ? roomDetail.ratings.reduce((acc: number, rating: any) => acc + rating.score, 0) / roomDetail.ratings.length : 0;

  return (
    <>
      <Breadcrumbs
        title={roomDetail?.name || "Room"}
        pagename={<NavLink to="/hotel">Room</NavLink>}
        childpagename={roomDetail?.name || "Room"}
      />

      <section className="room_details py-5">
        <Container>
          <Row>
            <h1 className="fs-2 font-bold mb-4">{roomDetail?.name || ""}</h1>
            <ImageGallery
              items={(roomDetail?.roomTier?.images || []).map((image: string) => ({
                original: image,
                thumbnail: image,
                originalHeight: 700,
                style: { objectFit: "none" },
              }))}
              showNav={false}
              showBullets={false}
              showPlayButton={false}
            />

            <Tab.Container id="left-tabs-example" defaultActiveKey="1">
              <Row className="py-5">
                <Col md={8}>
                  <Tab.Content className="mt-1">
                    <div className="room_details">
                      <h3 className="font-bold mb-2 h3 border-bottom pb-2">Overview</h3>
                      <p className="body-text">{roomDetail?.roomTier?.description}</p>

                      <h3 className="font-bold mb-2 h3 mt-3 border-bottom pb-2">Features</h3>
                      <div style={{ lineHeight: 1.5 }}>
                        {Object.entries(features || {}).map(([key, value]) =>
                          value ? (
                            <span key={key} className="mx-2" style={{ whiteSpace: 'nowrap' }}>
                              <i className={`bi ${featureIcons[key]} me-1 text-success`}></i>
                              {key.replace("is", "").replace(/([A-Z])/g, " $1")}
                            </span>
                          ) : null
                        )}
                      </div>

                      <h3 className="font-bold mb-2 h3 mt-3 border-bottom pb-2">Reviews</h3>
                      <div style={{ lineHeight: 1.5 }}>
                        {roomDetail?.ratings?.length ?
                          roomDetail.ratings.map((rating: any) => (
                            <div key={rating.id} className="mb-3">
                              <div className="d-flex justify-content-between">
                                <h5 className="fw-bold">{rating.user.name}</h5>
                                <div>
                                  {[...Array(Math.floor(rating.score))].map(
                                    (_, i) => (
                                      <i
                                        key={i}
                                        className="bi bi-star-fill text-warning"
                                      ></i>
                                    )
                                  )}
                                  {(rating.score % 1) > 0 && (
                                    <i className="bi bi-star-half text-warning"></i>
                                  )}
                                </div>
                              </div>
                              <p>{rating.comment}</p>
                            </div>
                          ))
                          : <p>No reviews yet</p>
                        }
                      </div>
                    </div>
                  </Tab.Content>
                </Col>

                {/* Sidebar */}
                <Col md={4}>
                  <aside>
                    {/* Price Info */}
                    <Card className="rounded-3 p-2 shadow-sm mb-4">
                      <Card.Body>
                        <Stack gap={2} direction="horizontal">
                          <h1 className="font-bold h2">{roomDetail?.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }) || "Contact for price"}</h1>
                          <span className="fs-4">{roomDetail?.price ? "/night" : ""}</span>
                        </Stack>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          {/* Rating */}
                          <div>
                            <span className="fw-bold">
                              {(Math.round((rating || 0) * 10) / 10).toFixed(1)} {/* Làm tròn đến 1 chữ số thập phân */}
                            </span>
                            {[...Array(Math.floor(rating || 0))].map((_, i) => (
                              <i key={i} className="bi bi-star-fill text-warning"></i>
                            ))}
                            {(Math.round((rating || 0) * 10) / 10) % 1 > 0 && (
                              <i className="bi bi-star-half text-warning"></i>
                            )}
                          </div>
                          <h5>({roomDetail?.ratings?.length || 0} reviews)</h5>
                        </div>
                        <button
                          onClick={bookNowHandler}
                          className="primaryBtn w-100 fw-bold text-center"
                        >
                          Book Now
                        </button>
                      </Card.Body>
                    </Card>

                    {/* Help Info */}
                    <Card className="shadow-sm">
                      <Card.Body>
                        <h3 className="font-bold mb-3">Need Help?</h3>
                        <ListGroup>
                          <ListGroup.Item className="border-0">
                            <i className="bi bi-telephone me-1"></i> Call us:{" "}
                            <strong>+91 123 456 789</strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0">
                            <i className="bi bi-alarm me-1"></i> Timing:{" "}
                            <strong>10AM to 7PM</strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0">
                            <strong>
                              <i className="bi bi-headset me-1"></i> Let us call
                              you
                            </strong>
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0">
                            <i className="bi bi-calendar-check me-1"></i>{" "}
                            <strong>Book Appointments</strong>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </aside>
                </Col>
              </Row>
            </Tab.Container>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default RoomDetails;

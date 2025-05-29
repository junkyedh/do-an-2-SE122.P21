import React, { useState, useEffect } from "react";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import "./Room.scss";
import Breadcrumbs from "@/layouts/Breadcrumbs/Breadcrumbs";
import Filters from "./Filters";
import ProductCard from "@/layouts/Cards/ProductCard";
import { popularsData } from "@/modules/data";
import { useLocation, useNavigate } from "react-router-dom";
import { MainApiRequest } from "@/services/MainApiRequest";
import Search from "@/layouts/Search/Search";
import { LoadingOverlay } from '@achmadk/react-loading-overlay';
import moment from "moment";

const Rooms = () => {
  const navigate = useNavigate();
  const {
    state,
  } = useLocation();

  const startDate = state?.startDate ? moment(state?.startDate).startOf('day').toDate() : moment().startOf('day').toDate();
  const endDate = state?.endDate ? moment(state?.endDate).startOf('day').toDate() : moment().add(5, 'days').startOf('day').toDate();

  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [roomList, setRoomList] = useState<any[]>([]);
  const [tierList, setTierList] = useState<any[]>([]);


  const fetchTierList = async () => {
    const res = await MainApiRequest.get('/room/tier/list');
    // console.log(res);
    setTierList(res.data);
  }


  const handleClose = () => setShow(false);

  const fetchListRooms = async () => {
    setIsLoading(true);
    let optionalParams = "";
    if (state?.tier) {
      optionalParams += `&roomTierId=${state.tier}`;
    }
    if (state?.guest) {
      optionalParams += `&guestNum=${state.guest}`;
    }
    const res = await MainApiRequest.get(`/room/filter-available?checkInDate=${startDate.toISOString()}&checkOutDate=${endDate.toISOString()}${optionalParams}`);
    console.log(res.data);
    setRoomList(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    window.scroll(0, 0);

    fetchTierList();
  }, []);

  useEffect(() => {
    fetchListRooms();
  }, [state]);

  return (
    <LoadingOverlay
      active={isLoading && tierList?.length > 0}
      spinner
      text='Searching...'
    >
      <Breadcrumbs title="Hotel" pagename="Hotel" />
      <section className="py-5 room_list">
        <Search tierList={tierList} startDateInp={startDate} endDateInp={endDate} />
        <Container>
          <Col>
            <Row>
              {roomList.map((val, inx) => {
                return (
                  <Col md={3} sm={6} xs={12} className="mb-5" key={inx}>
                    <ProductCard val={val} checkInDate={startDate.toISOString()} checkOutDate={endDate.toISOString()} />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Container>
      </section>
    </LoadingOverlay>
  );
};

export default Rooms;
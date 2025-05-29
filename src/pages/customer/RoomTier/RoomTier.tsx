import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './RoomTier.scss';
import Breadcrumbs from '@/layouts/Breadcrumbs/Breadcrumbs';
import Cards from '@/layouts/Cards/Cards';
import { roomTierData } from '@/modules/data';

const RoomTier = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs title="RoomTier" pagename="RoomTier" />

      <section className="tiers py-5">
        <Container>
          <Row>
            {roomTierData.map((tier, inx) => {
              return (
                <Col md="3" sm="6" key={inx} className="pb-4">
                  <Cards tier={tier} key={inx} />
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default RoomTier;

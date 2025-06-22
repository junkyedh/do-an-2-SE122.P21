import React, { useState } from 'react';
import GalleryImg1 from "@/assets/cup32.jpg";
import GalleryImg3 from "@/assets/bread9.jpg";
import GalleryImg5 from "@/assets/cup15.jpg";
import GalleryImg6 from "@/assets/cup29.jpg";
import cafeImg1 from "@/assets/coffee4.jpg";
import cafeImg2 from "@/assets/img5.jpg";
import cafeImg3 from "@/assets/juice7.jpg";
import cafeImg4 from "@/assets/img11.jpg";
import cafeImg5 from "@/assets/img1.jpg";
import Lightbox from 'yet-another-react-lightbox'; // Import đúng thư viện Lightbox

import './Gallery.scss';
import { Card, CardTitle, Col, Row } from 'react-bootstrap';

const Gallery = () => {
  // Thông tin hình ảnh liên quan đến thức uống, đồ ăn
  const images = [
    {
      src: GalleryImg1,
      desc: "Trà sữa trân châu thơm béo",
      sub: "Trà Sữa Trân Châu"
    },
    {
      src: GalleryImg3,
      desc: "Bánh socola mềm mịn",
      sub: "Bánh Socola"
    },
    {
      src: GalleryImg5,
      desc: "Sinh tố dâu tươi mát",
      sub: "Sinh Tố Dâu"
    },
    {
      src: GalleryImg6,
      desc: "Trà đào cam sả thanh mát",
      sub: "Trà Đào Cam Sả"
    },
  ];

  const settings = {
    columnCount: {
      default: 3,
      mobile: 2,
      tab: 3,
    },
    mode: "dark",
    enableZoom: false,
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Lightbox
        slides={images}
        open={isOpen}
        close={() => setIsOpen(false)}
      />
      {/* Hình ảnh quán */}

      <Row className="section-spacing pt-5">
        <Col md="4" className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Img src={cafeImg3} alt="Không gian 1" className="rounded img-fluid" />
          </Card>
        </Col>
        <Col md="4" className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Img src={cafeImg1} alt="Không gian 2" className="rounded img-fluid" />
          </Card>
        </Col>
        <Col md="4" className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Img src={cafeImg5} alt="Không gian 3" className="rounded img-fluid" />
          </Card>
        </Col>
        <Col md="12">
          <Card className="border-0">
            <Card.Img src={cafeImg4} alt="view" className="rounded" />
          </Card>
        </Col>
      </Row>
      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img
              src={image.src}
              alt={image.desc || 'Gallery Image'}
              onClick={() => setIsOpen(true)}
              
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;

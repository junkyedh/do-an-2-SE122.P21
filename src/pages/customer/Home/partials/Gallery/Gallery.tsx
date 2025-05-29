import React, { useState } from 'react';
import GalleryImg1 from "@/assets/room1.jpg";
import GalleryImg3 from "@/assets/room3.jpg";
import GalleryImg4 from "@/assets/room2.jpg";
import GalleryImg6 from "@/assets/room9.jpg";
import GalleryImg7 from "@/assets/room6.jpg";
import Lightbox from 'yet-another-react-lightbox'; // Import đúng thư viện Lightbox

import './Gallery.scss';

const Gallery = () => {
  const images = [
    {
      src: GalleryImg1,
      desc: "Person wearing shoes",
      sub: "Gift Habeshaw"
    },
    {
      src: GalleryImg3,
      desc: "Blonde woman wearing sunglasses smiling at the camera",
      sub: "Dmitriy Frantsev"
    },
    {
      src: GalleryImg6,
      sub: "Harry Cunningham"
    },
    {
      src: GalleryImg4,
      desc: "Jaipur, Rajasthan India",
      sub: "Liam Baldock"
    },
    {
      src: GalleryImg7,
      sub: "Verne Ho"
    },
    {
      src: GalleryImg6,
      desc: "Rann of Kutch, India",
      sub: "Hari Nandakumar"
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

  const [isOpen, setIsOpen] = useState(false); // Quản lý trạng thái mở của lightbox

  return (
    <div>
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

      {/* Lightbox để hiển thị ảnh khi nhấn */}
      <Lightbox
        slides={images}
        open={isOpen}
        close={() => setIsOpen(false)} // Đóng lightbox
        // settings={settings}
      />
    </div>
  );
};

export default Gallery;

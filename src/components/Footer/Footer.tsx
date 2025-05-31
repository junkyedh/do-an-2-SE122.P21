import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaAppStore, FaGooglePlay } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {

  const [visible, setVisible]= useState(false);

  const toggleVisible=()=>{
    const scrolled = document.documentElement.scrollTop;
    if(scrolled > 300){
      setVisible(true)
    }
   else if(scrolled  <= 300){
      setVisible(false)
    }
  }

  const scrollTop =()=>{
    window.scrollTo({
      top:0,
      behavior:"smooth"
    })
  }

  if(typeof window !== "undefined"){
    window.addEventListener("scroll", toggleVisible)
  }
   
  const handleClick = (section: any) => {
    console.log(`Navigating to ${section}`);
    // Thêm logic điều hướng hoặc xử lý sự kiện tại đây
  };

  return (
    <>
    <footer className="footer">
      <div className="footer__section footer__logo-section">
        <h2 className="footer__logo">PEACH HOTEL</h2>
        <p className="footer__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="footer__socials footer__buttons">
          <button className="footer__social footer__button"><FaGooglePlay />  PlayStore</button>
          <button className="footer__social footer__button"><FaAppStore />  AppleStore</button>
        </div>
      </div>

      <div className="footer__section" style={{ paddingLeft: 40 }}>
        <h3 className="footer__title">COMPANY</h3>
        <div className="footer__list">
          <div className="footer__item" onClick={() => handleClick('About Us')}>About Us</div>
          <div className="footer__item" onClick={() => handleClick('Legal Information')}>Legal Information</div>
          <div className="footer__item" onClick={() => handleClick('Contact Us')}>Contact Us</div>
          <div className="footer__item" onClick={() => handleClick('Blogs')}>Blogs</div>
        </div>
      </div>

      <div className="footer__section">
        <h3 className="footer__title">HELP CENTER</h3>
        <div className="footer__list">
          <div className="footer__item" onClick={() => handleClick('Find a Property')}>Find a Property</div>
          <div className="footer__item" onClick={() => handleClick('How To Host?')}>How To Host?</div>
          <div className="footer__item" onClick={() => handleClick('Why Us?')}>Why Us?</div>
          <div className="footer__item" onClick={() => handleClick('FAQs')}>FAQs</div>
          <div className="footer__item" onClick={() => handleClick('Rental Guides')}>Rental Guides</div>
        </div>
      </div>

      <div className="footer__section">
        <h3 className="footer__title">CONTACT INFO</h3>
        <div className="footer__list">
          <div>Phone: 1234567890</div>
          <div>Email: company@email.com</div>
          <div>Location: 100 Smart Street, LA, USA</div>
        </div>
        <div className="footer__socials">
          <div className="footer__social" style={{ fontSize: 20 }} onClick={() => handleClick('Facebook')}><FaFacebookF /></div>
          <div className="footer__social" style={{ fontSize: 20 }} onClick={() => handleClick('Twitter')}><FaTwitter /></div>
          <div className="footer__social" style={{ fontSize: 20 }} onClick={() => handleClick('Instagram')}><FaInstagram /></div>
          <div className="footer__social" style={{ fontSize: 20 }} onClick={() => handleClick('LinkedIn')}><FaLinkedinIn /></div>
        </div>
      </div>
    </footer>

    <div id="back-top"
      onClick={scrollTop}
      className={visible ? "active" : ""}>
      <i className="bi bi-arrow-up"></i>
    </div>
    </>
  );
};

export default Footer;

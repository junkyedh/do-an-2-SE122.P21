import React, { useEffect } from "react";
import { Col, Container, Row, Card, ListGroup, Form, FloatingLabel } from "react-bootstrap";
import image from "@/assets/service2.jpg";
import "./Contact.scss";
import Breadcrumbs from "@/components/littleComponent/Breadcrumbs/Breadcrumbs";

const Contact = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs 
        title="Liên hệ"
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Liên hệ" }
        ]}
      />
      <section className="contact pt-5">
        <Container>
          <Row>
            <Col md="12">
              <h1 className="mb-2 h1 font-bold">
                Liên hệ với chúng tôi
              </h1>
              <p className="body-text mt-1 align-items-center px-3 text-center">
                Chúng tôi rất vui được nghe ý kiến của bạn! Nếu bạn có bất kỳ câu hỏi, đề xuất hoặc phản hồi nào về cửa hàng thức uống của chúng tôi, hãy để lại thông tin liên hệ bên dưới. Chúng tôi sẽ cố gắng trả lời bạn trong thời gian sớm nhất.
              </p>
            </Col>
          </Row>

          <Row className="py-5">
            <Col lg="4" md="6" className="mb-4 mb-lg-0">
              <Card className="border-0 shadow rounded-3 mb-4">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center align-item-search my-2">
                    <div className="bg-info rounded-circle text-info shadow-sm bg-opacity-10 p-3 mb-2">
                      <i className="bi bi-headset h3"></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h5">Phone</Card.Title>
                  <p className="mb-3 body-text">Gọi cho chúng tôi để được hỗ trợ nhanh chóng và hiệu quả.</p>
                  <div className="d-block justify-content-between">
                    <a type="button" className="btn btn-light me-2 btn-sm">
                      <i className="bi bi-phone me-1"></i>
                      +84 336126905
                    </a>
                    <a type="button" className="btn btn-light me-2 btn-sm">
                      <i className="bi bi-telephone me-1"></i>
                      +84 336126905
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg="4" md="6" className="mb-4 mb-lg-0">
              <Card className="border-0 shadow rounded-3 mb-4">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center align-item-search my-2">
                    <div className="bg-danger rounded-circle text-danger shadow-sm bg-opacity-10 p-3 mb-2">
                      <i className="bi bi-envelope h3"></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h5">Email</Card.Title>
                  <p className="mb-3 body-text">
                    Gửi email cho chúng tôi để nhận được phản hồi chi tiết và đầy đủ nhất.
                  </p>
                  <div className="d-block justify-content-between">
                    <a type="button" className="btn btn-light me-2 btn-sm">
                      <i className="bi bi-envelope me-2"></i>
                      anhhan@gmail.com
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg="4" md="12" className="mb-4 mb-lg-0">
              <Card className="border-0 shadow rounded-3 mb-4">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center align-item-search my-2">
                    <div className="bg-warning rounded-circle text-warning shadow-sm bg-opacity-10 p-3 mb-2">
                      <i className="bi bi-globe h3"></i>
                    </div>
                  </div>
                  <Card.Title className="fw-bold h5">Social Media</Card.Title>
                  <p className="mb-3 body-text">Liên hệ trang mạng xã hội</p>
                  <div className="d-block justify-content-center">
                    <ListGroup horizontal className="justify-content-center">
                      <ListGroup.Item className="border-0">
                        <i className="bi bi-youtube"></i>
                      </ListGroup.Item>
                      <ListGroup.Item className="border-0">
                        <i className="bi bi-instagram"></i>
                      </ListGroup.Item>
                      <ListGroup.Item className="border-0">
                        <i className="bi bi-twitter"></i>
                      </ListGroup.Item>
                      <ListGroup.Item className="border-0">
                        <i className="bi bi-youtube"></i>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="py-5 align-items-center">
            <Col xl="6" md="6" className="d-none d-md-block">
              <img src={image} alt="" className="img-fluid me-3" />
            </Col>
            <Col xl="6" md="6">
              <Card className="bg-light p-4 border-0 shadow-sm">
                <div className="form-box">
                  <h1 className="h3 font-bold mb-4">Send us message</h1>
                  <Form>
                    <Row>
                      <Col md="6">
                        <FloatingLabel controlId="name" label="Full Name" className="mb-4">
                          <Form.Control type="text" placeholder="Full Name" />
                        </FloatingLabel>
                      </Col>
                      <Col md="6">
                        <FloatingLabel controlId="email" label="Email address" className="mb-4">
                          <Form.Control type="email" placeholder="name@example.com" />
                        </FloatingLabel>
                      </Col>

                      <Col md="12">
                        <FloatingLabel controlId="phone" label="Phone Number" className="mb-4">
                          <Form.Control type="text" placeholder="Phone Number" />
                        </FloatingLabel>
                      </Col>

                      <Col md="12">
                        <FloatingLabel controlId="message" label="Message">
                          <Form.Control as="textarea" placeholder="Message" style={{ height: "126px" }} />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <button className="primaryBtn mt-3" type="button"> Send Message</button>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;

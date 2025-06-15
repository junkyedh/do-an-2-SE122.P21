import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import useProducts from "@/hooks/useProducts";
import "./Home.scss";
import Banner from "@/components/customer/Banner/Banner";
import Features from "@/components/customer/Features/Features";
import CategoryShowcase from "@/components/customer/Category/CategoryShowcase";
import FeaturedList from "@/components/customer/FeaturedProduct/FeaturedProduct";
import Gallery from "@/components/customer/Gallery/Gallery";

const Home = () => {
  const navigate = useNavigate();
  const { products: productList, isLoading } = useProducts();
  const [cart, setCart] = useState<any[]>([]);

  const handleAddToCart = (productId: string, size: { name: string; price: number }, temperature?: string) => {
    const product = productList.find((p) => p.id === productId);
    if (product) {
      const cartItem = {
        id: `${productId}-${size.name}${temperature ? `-${temperature}` : ""}`,
        productId,
        name: product.name,
        size: size.name,
        temperature,
        price: size.price,
        quantity: 1
      };
      setCart((prev) => [...prev, cartItem]);
      console.log("Cart updated:", cartItem);
    }
  };

  const handleProductClick = (productId: string) => {
    console.log(`Navigate to product detail: ${productId}`);
    navigate(`/product/${productId}`);
  };

  const handleShowMore = () => {
    navigate("/menu");
  };

  return (
    <>
      <Banner />
      <Features />
      <CategoryShowcase />

      <section className="popular py-5">
        <Container>
          <Row>
            <Col md={12} className="product-slider">
              <FeaturedList
                products={productList}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            </Col>
          </Row>
        </Container>

        <Gallery />
        <section className="call_us px-5">
          <Container>
            <Row className="align-items-center">
              <Col md="4" className="text-center mt-3 mt-md-0">
                <Link to="/contact-us" className="secondary_btn bounce">
                  Liên hệ với chúng tôi!
                </Link>
              </Col>
              <Col md="8">
                <h2 className="heading">
                  SẴN SÀNG VỚI TRẢI NGHIỆM TUYỆT VỜI TẠI CỬA HÀNG CHÚNG TÔI?
                </h2>
                <p className="text">
                  Thưởng thức các loại thức uống thơm ngon và bánh ngọt hấp dẫn trong không gian ấm cúng tại cửa hàng của chúng tôi. Đội ngũ thân thiện và thực đơn đa dạng luôn sẵn sàng phục vụ bạn mỗi ngày!
                </p>
              </Col>
            </Row>
          </Container>
          <div className="overlay px-5"></div>
        </section>
      </section>
    </>
  );
};

export default Home;
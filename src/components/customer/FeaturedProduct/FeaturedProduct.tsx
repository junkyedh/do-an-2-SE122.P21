import React from "react";
import Slider from "react-slick";
import "./FeaturedProduct.scss";
import CardProduct, { CardProductProps } from "@/components/customer/CardProduct/CardProduct";
import { useNavigate } from "react-router-dom";

interface FeaturedListProps {
  title?: string;
  products: CardProductProps[];
  onAddToCart?: (productId: string, size: any, temperature?: string) => void;
  onProductClick?: (productId: string) => void;
}

const FeaturedList: React.FC<FeaturedListProps> = ({
  title = "Sản phẩm nổi bật",
  products,
  onAddToCart,
  onProductClick,
}) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: false } },
    ],
  };

  const popularProducts = products.filter((p) => p.isPopular);
const navigate = useNavigate();

const handleShowMore = () => {
  navigate("/menu"); 
};
  console.log("Popular products:", popularProducts);
  return (
    <section className="featured-list">
        <div className="container">
            <h2 className="featured-title text-center mb-4">{title}</h2>
            <Slider {...sliderSettings}>
            {popularProducts.map((product) => (
                <div key={product.id} className="featured-item">
                <CardProduct
                    {...product}
                    onAddToCart={onAddToCart}
                    onProductClick={onProductClick}
                />
                </div>
            ))}
            </Slider>

            {/* Nút Xem Thêm */}
            <div className="see-more-wrapper text-center mt-4">
                <button className="see-more-btn" onClick={handleShowMore}>
                    Xem thêm
                </button>
            </div>
        </div>
    </section>
  );
};

export default FeaturedList;

// src/components/customer/CardProduct.tsx
import React, { useState } from "react";
import { FaCartPlus, FaStar } from "react-icons/fa";
import "./CardProduct.scss";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/cartContext";
import { message } from "antd";

export interface ProductSize {
  sizeName: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  available: boolean;
  sizes: ProductSize[];
  hot?: boolean;   // nếu có nghĩa là mặc định “nóng”
  cold?: boolean;  // nếu có nghĩa là mặc định “lạnh”
  description?: string;
  isPopular: boolean;
  isNew?: boolean;
  rating?: number;
  discount?: number;
}

interface Props {
  product: Product;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (size:string, quantity: number, mood?: string) => void;
}

const CardProduct: React.FC<Props> = ({ product, onProductClick , onAddToCart}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedTemp, setSelectedTemp] = useState<'hot' | 'cold'>('hot')
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const size = product.sizes[selectedSizeIndex];
  const finalPrice = size.price - (product.discount || 0);

  // nếu là cà phê hoặc trà, mood mặc định hot/cold từ product.hot/product.cold
  const defaultMood = ["Cà phê", "Trà trái cây"].includes(product.category)
    ? product.hot ? "hot" : "cold"
    : undefined;

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    const sizeName = product.sizes[selectedSizeIndex].sizeName;
    const mood = defaultMood;
    if (onAddToCart) {
      onAddToCart(size.sizeName, quantity, mood);
    } else {
      addToCart(Number(product.id), size.sizeName, 1, mood)
        .then(() => message.success("Đã thêm vào giỏ hàng"))
        .catch(() => message.error("Không thể thêm vào giỏ hàng"));
  };
}

  return (
    <div
      className={`cardProduct ${!product.available ? "disabled" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: product.available ? "pointer" : "not-allowed" }}
    >
      <div className="cardProductImageWrapper">
        <img src={product.image} alt={product.name} className="cardProductImage" />
        {(product.isPopular || product.isNew) && (
          <div className={`cardProductBadge ${product.isNew ? "badgeNew" : "badgePopular"}`}>
            {product.isNew ? "Mới" : "Phổ biến"}
          </div>
        )}
        {/* {product.discount && product.discount > 0 && (
          <div className="cardProductDiscount">
            -{Math.round((product.discount / size.price) * 100)}%
          </div>
        )} */}
      </div>

      <div className="cardProductContent">
        <div className="cardProductHeader">
          <span className="cardProductCategory">{product.category}</span>
          {product.rating != null && (
            <div className="cardProductRating">
              <FaStar className="ratingIcon" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="cardProductTitle">{product.name}</h3>
        {product.description && (
          <p className="cardProductDescription">{product.description}</p>
        )}

        <div className="cardProductFooter">
          <div className="cardProductPriceGroup">
            <span className="cardProductPrice">
              {finalPrice.toLocaleString("vi-VN")}₫
            </span>
            {/* {product.discount && (
              <span className="cardProductOldPrice">
                {size.price.toLocaleString("vi-VN")}₫
              </span>
            )} */}
          </div>

          <div className="cardProductActions">
            <button
              className="cardProductBtn"
              onClick={handleCardClick}
              disabled={!product.available}
            >
              Chi tiết
            </button>
            <button
              className="cardProductCartBtn"
              onClick={handleAddToCart}
              disabled={!product.available}
            >
              <FaCartPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;

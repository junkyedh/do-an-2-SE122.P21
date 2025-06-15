import React, { useState } from "react";
import { FaCartPlus, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import "./CardProduct.scss";
import { useNavigate } from "react-router-dom";

export interface ProductSize {
  name: string;
  price: number;
}

export interface CardProductProps {
  id: string;
  name: string;
  category: string;
  image: string;
  available: boolean;
  sizes: ProductSize[];
  hot?: boolean;
  cold?: boolean;
  materials: { name: string }[];
  description?: string;
  isPopular: boolean;
  isNew?: boolean;
  rating?: number;
  discount?: number;
  onAddToCart?: (productId: string, size: ProductSize, temperature?: string) => void;
  onProductClick?: (productId: string) => void;
}

const CardProduct: React.FC<CardProductProps> = ({
  id,
  name,
  category,
  image,
  available,
  sizes,
  isPopular,
  description = "Đang cập nhật mô tả...",
  isNew,
  rating = 0,
  discount = 0,
  onAddToCart,
  onProductClick,
}) => {
  const [selectedSize] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const size = sizes[selectedSize];
  const finalPrice = size?.price - discount;

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(id);
    } else {
      navigate(`/product/${id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!available) return;
    onAddToCart?.(id, size);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={`cardProduct ${!available ? "disabled" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: available ? "pointer" : "not-allowed" }}
    >
      <div className="cardProductImageWrapper">
        {image && <img src={image} alt={name} className="cardProductImage" />}
        {(isPopular || isNew) && (
          <div className={`cardProductBadge ${isNew ? "badgeNew" : "badgePopular"}`}>
            {isNew ? "Mới" : "Phổ biến"}
          </div>
        )}
        {discount > 0 && (
          <div className="cardProductDiscount">
            -{Math.round((discount / size.price) * 100)}%
          </div>
        )}
        <div className={`favoriteButton ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </div>
      </div>

      <div className="cardProductContent">
        <div className="cardProductHeader">
          <span className="cardProductCategory">{category}</span>
          {rating > 0 && (
            <div className="cardProductRating">
              <FaStar className="ratingIcon" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="cardProductTitle">{name}</h3>

        <div className="cardProductFooter">
          <div className="cardProductPriceGroup">
            <span className="cardProductPrice">{finalPrice.toLocaleString("vi-VN")}₫</span>
            {discount > 0 && (
              <span className="cardProductOldPrice">{size.price.toLocaleString("vi-VN")}₫</span>
            )}
          </div>

          <div className="cardProductActions">
            <button
              className="cardProductBtn"
              onClick={handleCardClick}
              disabled={!available}
            >
              Chi tiết
            </button>
            <button
              className="cardProductCartBtn"
              onClick={handleAddToCart}
              disabled={!available}
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

import React, { useState } from "react";
import { FaCartPlus, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import "./CardProduct.scss";
import { useNavigate } from "react-router-dom";

export interface ProductSize {
  name: string;
  price: number;
}

export interface Product {
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
}

interface Props {
  product: Product;
  onAddToCart?: (productId: string, size: ProductSize, temperature?: string) => void;
  onProductClick?: (productId: string) => void;
}

const CardProduct: React.FC<Props> = ({product, onAddToCart, onProductClick}) => {
  const [selectedSize] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const size = product.sizes[selectedSize];
  const finalPrice = size.price - (product.discount || 0);

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
    onAddToCart?.(product.id, size);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={`cardProduct ${!product.available ? "disabled" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: product.available ? "pointer" : "not-allowed" }}
    >
      <div className="cardProductImageWrapper">
        {product.image && <img src={product.image} alt={product.name} className="cardProductImage" />}
        {(product.isPopular || product.isNew) && (
          <div className={`cardProductBadge ${product.isNew ? "badgeNew" : "badgePopular"}`}>
            {product.isNew ? "Mới" : "Phổ biến"}
          </div>
        )}
        {typeof product.discount === "number" && product.discount > 0 && (
          <div className="cardProductDiscount">
            -{Math.round((product.discount / size.price) * 100)}%
          </div>
        )}
        {/* <div className={`favoriteButton ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </div> */}
      </div>

      <div className="cardProductContent">
        <div className="cardProductHeader">
          <span className="cardProductCategory">{product.category}</span>
          {typeof product.rating === "number" && product.rating > 0 && (
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
            <span className="cardProductPrice">{finalPrice.toLocaleString("vi-VN")}₫</span>
            {typeof product.discount === "number" && product.discount > 0 && (
              <span className="cardProductOldPrice">{size.price.toLocaleString("vi-VN")}₫</span>
            )}
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

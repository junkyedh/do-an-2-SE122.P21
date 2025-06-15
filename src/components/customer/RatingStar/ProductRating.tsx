import React from "react";
import { FaStar } from "react-icons/fa";
import "./ProductRating.scss";

interface ProductRatingProps {
  /** Trung bình số sao, ví dụ 4.8 */
  averageStar: number;
  /** Tổng số đánh giá, ví dụ 128. Nếu undefined, không hiển thị phần text */
  totalRatings?: number;
  /** showText = true: hiển thị "(4.5 • 128 đánh giá)" 
      showText = false: chỉ hiện stars */
  showText?: boolean;
}

const ProductRating: React.FC<ProductRatingProps> = ({
  averageStar,
  totalRatings,
  showText = true,
}) => {
  // Số sao vàng: floor(averageStar)
  const fullStars = Math.floor(averageStar);
  return (
    <div className="productRating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= fullStars ? "filled" : ""}`}
          />
        ))}
      </div>
      {showText && totalRatings != null && (
        <span className="reviewCount">
          ({averageStar.toFixed(1)} • {totalRatings} đánh giá)
        </span>
      )}
    </div>
  );
};

export default ProductRating;

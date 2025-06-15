import React from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./CardListView.scss";

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  image: string;
  isPopular: boolean;
  isNew?: boolean;
  sizes: { name: string; price: number }[];
  discount?: number;
}

interface Props {
  product: Product;
  onFavoriteToggle?: (id: string, fav: boolean) => void;
}

const CardListView: React.FC<Props> = ({ product, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [fav, setFav] = React.useState(false);

  const price = product.sizes[0].price - (product.discount || 0);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFav(!fav);
    onFavoriteToggle?.(product.id, !fav);
  };

  return (
    <div
      className="product-list-item"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="pli__image">
        <img src={product.image} alt={product.name} />
        {/* <button className="pli__fav-btn" onClick={handleFav}>
          {fav ? <FaHeart /> : <FaRegHeart />}
        </button> */}
      </div>
      <div className="pli__info">
        <h3 className="pli__title">{product.name}</h3>
        {product.description && (
          <p className="pli__desc">{product.description}</p>
        )}
        <div className="pli__badges">
          <span className="badge category">{product.category}</span>
          {product.isPopular && <span className="badge hot">Hot</span>}
        </div>
      </div>
      <div className="pli__actions">
        <span className="pli__price">{price.toLocaleString("vi-VN")}₫</span>
        <button className="pli__btn">Xem chi tiết</button>
      </div>
    </div>
  );
};

export default CardListView;

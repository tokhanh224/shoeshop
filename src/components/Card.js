import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { BsCartPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../index.css"
const Card = ({ img, title, star, reviews, prevPrice, newPrice, id }) => {
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const [addedToCart, setAddedToCart] = useState(false); // State thông báo đã thêm vào giỏ hàng

  const handleAddToCart = () => {
    const product = { img, title, prevPrice, newPrice, id }; 
    addToCart(product); // Thêm sản phẩm vào giỏ hàng
    setAddedToCart(true); // Cập nhật trạng thái thêm sản phẩm
    setTimeout(() => setAddedToCart(false), 3000); // Ẩn thông báo sau 3 giây
  };

  return (
    <section className="card h-252">
      <Link to={`/product/${id}`}>
        <img src={img} alt={title} className="card-img" />
      </Link>
      <div className="card-details">
        <h3 className="card-title">{title}</h3>
        <section className="card-reviews">
          {star} {star} {star} {star}
          <span className="total-reviews">{reviews}</span>
        </section>
        <section className="card-price">
          <div className="price">
            <del>{prevPrice}</del> {newPrice}$
          </div>
          <div className="bag" onClick={handleAddToCart}>
            <BsCartPlus className="bag-icon" />
          </div>
        </section>
      </div>
      
      {/* Hiển thị thông báo khi sản phẩm được thêm vào giỏ hàng */}
      {addedToCart && (
        <div className="cart-notification">
          <p>{title} has been added to your cart!</p>
        </div>
      )}
    </section>
  );
};

export default Card;

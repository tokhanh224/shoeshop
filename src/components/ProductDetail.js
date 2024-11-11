import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState } from "react";

function ProductDetail({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Lấy hàm addToCart từ context
  const [addedToCart, setAddedToCart] = useState(false); // State thông báo đã thêm vào giỏ hàng

  // Tìm sản phẩm từ id
  const product = products.find((prod) => prod.id === parseInt(id));

  const handleAddToCart = () => {
    const productToAdd = { 
      img: product.img, 
      title: product.title, 
      prevPrice: product.prevPrice, 
      newPrice: product.newPrice, 
      id: product.id 
    };
    addToCart(productToAdd); // Thêm sản phẩm vào giỏ hàng
    setAddedToCart(true); // Cập nhật trạng thái thêm sản phẩm
    setTimeout(() => setAddedToCart(false), 3000); // Ẩn thông báo sau 3 giây
  };

  // Nếu không tìm thấy sản phẩm, hiển thị thông báo lỗi hoặc chuyển hướng
  if (!product) {
    return (
      <div className="container error-message">
        <h2>Sản phẩm không tồn tại</h2>
        <button onClick={() => navigate("/")}>Trở về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="container product-detail">
      <h1>{product.title}</h1>
      <div className="product-details">
        <div className="product-image">
          <img src={product.img} alt={product.title} />
        </div>
        <div className="product-info">
          <p><strong>Star Rating:</strong> {product.star}</p>
          <p><strong>Reviews:</strong> {product.reviews}</p>
          <p><strong>Giá cũ:</strong> <del>{product.prevPrice}</del></p>
          <p className="price"><strong>Giá mới:</strong> {product.newPrice}$</p>
          <div className="product-rating">
            <strong>Đánh giá:</strong> {product.star} ⭐
          </div>
          <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
        </div>
      </div>
      {/* Hiển thị thông báo khi sản phẩm được thêm vào giỏ hàng */}
      {addedToCart && (
        <div className="cart-notification">
          <p>{product.title} đã được thêm vào giỏ hàng!</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;

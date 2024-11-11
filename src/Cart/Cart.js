import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // State để quản lý voucher đã chọn và giảm giá
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [availableVouchers, setAvailableVouchers] = useState([
    { code: "WELCOME10", discount: 0.1 }, // Ví dụ: voucher giảm 10%
  ]);

  // State để quản lý các sản phẩm đã chọn để thanh toán
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Lấy voucher từ localStorage và thiết lập mặc định nếu có
    const storedVoucher = localStorage.getItem("voucher");
    if (storedVoucher) {
      setSelectedVoucher(storedVoucher); // Không cần JSON.parse nữa
      const selectedVoucherData = availableVouchers.find(voucher => voucher.code === storedVoucher);
      if (selectedVoucherData) {
        setDiscount(calculateDiscount(selectedItems, selectedVoucherData)); // Áp dụng giảm giá nếu có
      }
    }
  }, [selectedItems, availableVouchers]);

  // Tính tổng giá trị của các sản phẩm đã chọn
  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => {
      if (selectedItems.includes(product.id)) {
        return total + product.newPrice * product.quantity;
      }
      return total;
    }, 0);
  };

  // Tính giảm giá
  const calculateDiscount = (selectedItems, voucherData) => {
    const totalPrice = calculateTotalPrice();
    return totalPrice * voucherData.discount;
  };

  // Kiểm tra giỏ hàng có trống không
  const isCartEmpty = cart.length === 0;

  // Hàm xử lý thay đổi voucher
  const handleVoucherChange = (event) => {
    const voucherCode = event.target.value;
    setSelectedVoucher(voucherCode);

    const voucher = availableVouchers.find(voucher => voucher.code === voucherCode);
    if (voucher) {
      setDiscount(calculateDiscount(selectedItems, voucher)); // Giảm giá theo voucher
    } else {
      setDiscount(0); // Nếu không có voucher hợp lệ, không giảm giá
    }

    // Lưu voucher vào localStorage
    localStorage.setItem("voucher", voucherCode);
  };

  // Tổng giá trị sau khi giảm giá
  const totalCartPrice = calculateTotalPrice(); // Cập nhật lại tổng giá trị giỏ hàng
  const finalPrice = totalCartPrice - discount;

  // Chuyển hướng đến checkout nếu giỏ hàng không trống
  const handleCheckout = () => {
    if (isCartEmpty || selectedItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống hoặc chưa chọn sản phẩm để thanh toán.");
      navigate("/");
    } else {
      // Lưu giá trị finalPrice vào localStorage để sử dụng trong Checkout
      localStorage.setItem("finalPrice", finalPrice.toFixed(2));
      navigate("/checkout");
    }
  };

  // Hàm xử lý chọn/deselect sản phẩm
  const handleSelectProduct = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter(itemId => itemId !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {isCartEmpty ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((product) => {
          const totalPrice = product.newPrice * product.quantity;
          const isSelected = selectedItems.includes(product.id); // Kiểm tra sản phẩm có được chọn không

          return (
            <div key={product.id} className="cart-item">
              <img src={product.img} alt={product.title} className="cart-item-img" />
              <div className="cart-item-details">
                <h4>{product.title}</h4>
                <p className="cart-item-price">{product.newPrice}$</p>

                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={() => decreaseQuantity(product.id)}>
                    -
                  </button>
                  <span className="quantity">{product.quantity}</span>
                  <button className="quantity-btn" onClick={() => increaseQuantity(product.id)}>
                    +
                  </button>
                </div>

                <p className="cart-item-total-price">Total: {totalPrice.toFixed(2)}$</p>
                <button className="remove-btn" onClick={() => removeFromCart(product.id)}>
                  Remove
                </button>

                {/* Checkbox chọn sản phẩm */}
                <div className="cart-item-select">
                  <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={() => handleSelectProduct(product.id)} 
                  />
                  <label>Select for checkout</label>
                </div>
              </div>
            </div>
          );
        })
      )}

      <div className="cart-summary">
        <h3>Total Price: {totalCartPrice.toFixed(2)}$</h3>

        {/* Chọn voucher */}
        <div className="voucher-container">
          <label htmlFor="voucher-select">Apply Voucher:</label>
          <select id="voucher-select" value={selectedVoucher} onChange={handleVoucherChange}>
            <option value="">None</option>
            {availableVouchers.length > 0 && availableVouchers.map((voucher) => (
              <option key={voucher.code} value={voucher.code}>
                {voucher.code}
              </option>
            ))}
          </select>
        </div>

        {selectedVoucher && discount > 0 && (
          <p>Discount: -{discount.toFixed(2)}$</p>
        )}

        {selectedVoucher && discount > 0 && (
          <div className="cart-summary">
            <h3>Total after discount: {finalPrice.toFixed(2)}$</h3>
          </div>
        )}

        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

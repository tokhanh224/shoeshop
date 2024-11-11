import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { QRCode } from "antd";
import "./Checkout.css";

const Checkout = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  // Lấy giá trị finalPrice từ localStorage
  const storedFinalPrice = parseFloat(localStorage.getItem("finalPrice")) || 0;

  // Lấy voucher đã sử dụng từ localStorage
  const storedVoucher = localStorage.getItem("voucher");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isQRVisible, setIsQRVisible] = useState(false);

  const handleCheckout = (event) => {
    event.preventDefault();

    if (!name || !address || !paymentMethod) {
      alert("Please fill in all fields");
      return;
    }

    if (paymentMethod === "paypal") {
      alert("Payment successful! You will receive a QR code.");
      setIsPaymentSuccessful(true);
      setIsQRVisible(true);
    } else {
      alert("Payment failed. Please choose another method.");
    }
  };

  useEffect(() => {
    if (isQRVisible) {
      const timer = setTimeout(() => {
        setIsQRVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isQRVisible]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      {/* Giới thiệu thông tin giỏ hàng */}
      <div className="cart-summary">
        {cart.length > 0 ? (
          <table className="cart-summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Voucher</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.img} alt={product.title} className="cart-item-img" />
                    <p>{product.title}</p>
                  </td>
                  <td>{product.newPrice}$</td>
                  <td>{product.quantity}</td>
                  <td>{(product.newPrice * product.quantity).toFixed(2)}$</td>
                  <td>
                    {/* Hiển thị voucher đã sử dụng */}
                    {storedVoucher && (
                      <div className="used-voucher">
                        <h3>Applied Voucher:</h3>
                        <p>{storedVoucher}</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty</p>
        )}
        <h3>Final Price: {storedFinalPrice.toFixed(2)}$</h3>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="checkout-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="checkout-field">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="checkout-field">
          <label htmlFor="payment-method">Payment Method:</label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="paypal">Online Banking</option>
          </select>
        </div>

        <button type="submit" className="checkout-btn">
          Place Order
        </button>
      </form>

      {isPaymentSuccessful && isQRVisible && paymentMethod === "paypal" && (
        <div className="qr-code">
          <h3>Scan this QR code for payment:</h3>
          <QRCode value={`https://payment-qr.com/${storedFinalPrice.toFixed(2)}`} size={256} />
        </div>
      )}

      {isPaymentSuccessful && !isQRVisible && (
        <div className="success-message">
          <p>Payment successful! Your order is being processed.</p>
          <Link to={`/`}>
            <button>Back to Home</button>
          </Link>
          <button onClick={handlePrint}>Print Order</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

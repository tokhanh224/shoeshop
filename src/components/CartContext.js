import React, { createContext, useContext, useState } from 'react';

// Tạo context Cart
const CartContext = createContext();

// Custom Hook để sử dụng CartContext
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider để bao bọc các component sử dụng CartContext
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    const productExists = cart.find(item => item.id === product.id);
    if (productExists) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // Giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

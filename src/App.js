import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import ProductDetail from "./components/ProductDetail";
import "./index.css";
import ProductList from "./Admin/Product/ProductList.tsx";
import LayOutAdmin from "./Admin/Layout/Layout.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductAdd from "./Admin/Product/ProductAdd.tsx";
import ProductEdit from "./Admin/Product/ProductEdit.tsx";
import { CartProvider } from "./components/CartContext.js";
import Cart from "./Cart/Cart";
import Checkout from "./Checkout/Checkout.js";
import SignUp from "./Admin/Auth/SignUp.tsx";
import SignIn from "./Admin/Auth/SignIn.tsx";
import Profile from "./Profile/Profile.tsx";
import PrivateRoute from "./Admin/Private/PrivateRoute.js";

const queryClient = new QueryClient();

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm từ API

  // Kiểm tra thông tin đăng nhập
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = accessToken && user.email;
  useEffect(() => {
    // console.log("Is logged in:", isLoggedIn);
    // console.log("User info:", user);
  }, [isLoggedIn, user]);
  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("Có lỗi khi lấy dữ liệu: ", error);
      });
  }, []); // Chạy chỉ một lần khi component mount

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredItems = products.filter(
    (product) => product.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    if (query) {
      filteredProducts = filteredItems;
    }

    if (selected) {
      filteredProducts = filteredProducts.filter(
        ({ category, color, company, newPrice, title }) =>
          category === selected ||
          color === selected ||
          company === selected ||
          newPrice === selected ||
          title === selected
      );
    }
// console.log(localStorage.getItem("accessToken")); // Kiểm tra accessToken
// console.log(localStorage.getItem("user")); // Kiểm tra thông tin người dùng

    return filteredProducts.map(
      ({ img, title, star, reviews, prevPrice, newPrice, id }) => (
        <Card
          key={id}
          img={img}
          title={title}
          star={star}
          reviews={reviews}
          prevPrice={prevPrice}
          newPrice={newPrice}
          id={id}
        />
      )
    );
    
  }
//   console.log(localStorage.getItem("accessToken")); // Kiểm tra accessToken
// console.log(localStorage.getItem("user")); // Kiểm tra thông tin người dùng


  const result = filteredData(products, selectedCategory, query);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Sidebar handleChange={handleChange} />
                  <Navigation query={query} handleInputChange={handleInputChange} isLoggedIn={isLoggedIn} user={user} />
                  <Products result={result} />
                </>
              }
            />
            <Route
              path="/product/:id"
              element={
                <>                 
                  <Navigation query={query} handleInputChange={handleInputChange} isLoggedIn={isLoggedIn} user={user} />
                  <ProductDetail products={products} />
                </>
              }
            />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Routes */}
            <Route element={<LayOutAdmin />}>
              <Route 
                path="/admin/list" 
                element={<PrivateRoute><ProductList /></PrivateRoute>} 
              />
              <Route 
                path="/admin/add" 
                element={<PrivateRoute><ProductAdd /></PrivateRoute>} 
              />
              <Route 
                path="/admin/edit/:id" 
                element={<PrivateRoute><ProductEdit /></PrivateRoute>} 
              />
            </Route>

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <>
                  <Navigation query={query} handleInputChange={handleInputChange} isLoggedIn={isLoggedIn} user={user} />
                  <Cart />
                </>
              }
            />
            <Route 
              path="/checkout" 
              element={<PrivateRoute><Checkout /></PrivateRoute>} 
            />

            {/* Authentication Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;

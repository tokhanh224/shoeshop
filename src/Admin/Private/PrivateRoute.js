import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    alert("Bạn chưa đăng nhập tài khoản")
    return <Navigate to="/signin" />;
  }

  return children; 
};

export default PrivateRoute;

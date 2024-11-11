import { AiOutlineShoppingCart, AiOutlineUserAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Nav.css";
import { IoHomeOutline } from "react-icons/io5";
const Nav = ({ handleInputChange, query, isLoggedIn, user }) => {
  return (
    <nav>
      <div className="nav-container">
        <input
          className="search-input"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Enter your search shoes."
        />
      </div>
      <div className="profile-container1">
        <Link to={`/`}>
          <IoHomeOutline className="nav-icons" />
        </Link>
        <Link to={`/Cart`}>
          <AiOutlineShoppingCart className="nav-icons" />
        </Link>
        {/* Nếu người dùng đã đăng nhập, hiển thị email, nếu không thì hiển thị nút đăng ký */}
        {isLoggedIn && user ? (
          <Link to={`/profile`}>
          <span>{user.email}</span>
          </Link>
        ) : (
          <Link to={`/signup`}>
            <AiOutlineUserAdd className="nav-icons" />
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Nav;

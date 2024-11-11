import React, { useEffect, useState } from 'react';
import { User } from '../Admin/interface/User';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import "./Profile.css"
import { RiAdminFill } from "react-icons/ri";
const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [voucher, setVoucher] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedVoucher = localStorage.getItem('voucher');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedVoucher) setVoucher(storedVoucher);
  }, []);

  const handleLogout = () => {
    // Xoá dữ liệu người dùng và voucher từ localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('voucher');
    // Điều hướng về trang đăng nhập
    navigate('/signin');
  };

  return (
    <div className="profile-container">
      {user ? (
        <div>
          <h1>Welcome to Your Profile</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <Link to={`/admin/list`}>
            <RiAdminFill />ADMIN PAGE
          </Link>
          {voucher && (
            <p><strong>Your Voucher:</strong> {voucher}</p>
          )}
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
          <Button onClick={handleLogout} style={{ marginLeft: '10px' }}>Log Out</Button>
        </div>
      ) : (
        <div>
          <h1>You are not logged in</h1>
          <p>Please log in to view your profile.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

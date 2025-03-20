import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // 引入CSS文件以支持样式

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Product List</Link></li>
        <li><Link to="/wardrobe">衣橱</Link></li>
        <li><Link to="/cart">购物车</Link></li>
        <li><Link to="/user">用户</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ProductList from './components/ProductList'; // 根据实际路径调整
import ProductDetail from './components/ProductDetail';
import RegisterForm from './components/RegisterForm'; // 根据实际路径调整
import LoginForm from './components/LoginForm'; // 根据实际路径调整
import Wardrobe from './components/Wardrobe'; // 新增衣橱页面
import Cart from './components/Cart'; // 新增购物车页面
import User from './components/User'; // 新增用户页面
import Navbar from './components/Navbar'; // 导入导航栏组件

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 检查 token 是否过期
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          // token 已过期
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('products'); // 清除产品数据
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {!isLoggedIn ? (
            <>
              <RegisterForm />
              <LoginForm onLogin={handleLogin} />
            </>
          ) : (
            <>
              <Navbar />
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </header>
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/register" element={<RegisterForm />} />
              {/* 删除这里重复的登录路由，因为已经在header中显示了登录表单 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" exact element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/wardrobe" element={<Wardrobe />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/user" element={<User />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;



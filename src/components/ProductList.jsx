import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css'; // 引入CSS文件以支持样式

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    
    if (!token) {
      setError('请先登录后查看商品。');
      setLoading(false);
      return;
    }

    // 修改请求头格式
    fetch('http://localhost:5000/api/products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 403) {
        // token 过期或无效，需要重新登录
        localStorage.removeItem('token');
        setError('登录已过期，请重新登录。');
        window.location.href = '/login';
        return;
      }
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText} (${response.status})`);
      }
      return response.json();
    })
      .then(data => {
        console.log('Received data:', data); // 添加调试信息
        setProducts(data);
        localStorage.setItem('products', JSON.stringify(data)); // 存储产品数据到 localStorage
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error.message); // 添加调试信息
        setError(`Failed to load products. Please try again later. (${error.message})`);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <div className="product-grid">
        {products.map(product => {
          const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);
          return (
            <div key={product.id} className="product-item">
              <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={`/images/${product.image_path}`} alt={product.name} className="product-image" />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">Price: ${price.toFixed(2)}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductList;



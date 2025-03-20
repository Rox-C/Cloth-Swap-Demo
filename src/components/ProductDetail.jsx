import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';  // 导入新的样式文件

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view product details.');
      setLoading(false);
      return;
    }

    // 获取存储在 localStorage 中的产品列表
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    if (!storedProducts || !Array.isArray(storedProducts)) {
      setError('Failed to load products data.');
      setLoading(false);
      return;
    }

    // 根据 id 查找产品
    const foundProduct = storedProducts.find(p => p.id === parseInt(id, 10));
    if (foundProduct) {
      setProduct(foundProduct);
      setLoading(false);
    } else {
      setError('Product not found.');
      setLoading(false);
    }
  }, [id]);

  // 添加到衣橱的函数
  const addToWardrobe = () => {
    if (!product) return;
    
    // 从localStorage获取现有的衣橱商品
    const wardrobeItems = JSON.parse(localStorage.getItem('wardrobeItems')) || [];
    
    // 检查商品是否已经在衣橱中
    const isItemExist = wardrobeItems.some(item => item.id === product.id);
    
    if (!isItemExist) {
      // 添加商品到衣橱
      wardrobeItems.push(product);
      localStorage.setItem('wardrobeItems', JSON.stringify(wardrobeItems));
      alert('商品已添加到衣橱！');
    } else {
      alert('商品已经在衣橱中！');
    }
  };

  // 添加到购物车的函数
  const addToCart = () => {
    if (!product) return;
    
    // 从localStorage获取现有的购物车商品
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // 检查商品是否已经在购物车中
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // 如果商品已存在，增加数量
      cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
    } else {
      // 添加新商品到购物车，默认数量为1
      cartItems.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('商品已添加到购物车！');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-image-section">
        <img 
          src={`/images/${product?.image_path}`} 
          alt={product?.name} 
          className="product-image"
        />
      </div>
      
      <div className="product-info-section">
        <h1 className="product-name">{product?.name}</h1>
        <p className="product-price">￥{product?.price}</p>
        <p className="product-description">{product?.description}</p>
        
        <div className="action-buttons">
          <button onClick={addToWardrobe}>添加到衣橱</button>
          <button onClick={addToCart}>添加到购物车</button>
          <button onClick={() => navigate('/')}>返回列表</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css'; // 复用ProductList的样式

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // 从localStorage获取购物车商品
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
    
    // 计算总价
    const total = items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
      return sum + price * (item.quantity || 1);
    }, 0);
    
    setTotalPrice(total);
    setLoading(false);
  }, []);

  // 更新商品数量
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // 重新计算总价
    const total = updatedItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
      return sum + price * (item.quantity || 1);
    }, 0);
    
    setTotalPrice(total);
  };

  // 从购物车中移除商品
  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // 重新计算总价
    const total = updatedItems.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
      return sum + price * (item.quantity || 1);
    }, 0);
    
    setTotalPrice(total);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-list">
      <h1>购物车</h1>
      {cartItems.length === 0 ? (
        <p>你的购物车是空的，请添加商品。</p>
      ) : (
        <>
          <div className="product-grid">
            {cartItems.map(product => {
              const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);
              const itemTotal = price * (product.quantity || 1);
              
              return (
                <div key={product.id} className="product-item">
                  <Link to={`/products/${product.id}`}>
                    <img src={`/images/${product.image_path}`} alt={product.name} className="product-image" />
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">单价: ${price.toFixed(2)}</p>
                  </Link>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(product.id, (product.quantity || 1) - 1)}>-</button>
                    <span>{product.quantity || 1}</span>
                    <button onClick={() => updateQuantity(product.id, (product.quantity || 1) + 1)}>+</button>
                  </div>
                  <p className="item-total">小计: ${itemTotal.toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(product.id)}
                    className="remove-button"
                  >
                    从购物车中移除
                  </button>
                </div>
              );
            })}
          </div>
          <div className="cart-summary">
            <h2>总计: ${totalPrice.toFixed(2)}</h2>
            <button className="checkout-button">结算</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;



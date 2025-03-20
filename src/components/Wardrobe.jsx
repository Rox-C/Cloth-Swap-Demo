import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Wardrobe.css'; // 新建独立的样式文件

function Wardrobe() {
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('1');
  const [selectedClothes, setSelectedClothes] = useState(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnResult, setTryOnResult] = useState(null);
  const models = ['1', '2', '3', '4', '5']; // 修改这里，包含所有模特图片

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wardrobeItems')) || [];
    setWardrobeItems(items);
    setLoading(false);
  }, []);

  const removeFromWardrobe = (id) => {
    const updatedItems = wardrobeItems.filter(item => item.id !== id);
    setWardrobeItems(updatedItems);
    localStorage.setItem('wardrobeItems', JSON.stringify(updatedItems));
  };

  const handleTryOn = async () => {
    if (!selectedModel || !selectedClothes) {
      alert('请选择模特和衣服');
      return;
    }

    setTryOnLoading(true);
    try {
      const formData = new FormData();
      
      // 获取模特图片
      const modelResponse = await fetch(`/images/models/${selectedModel}.png`);
      if (!modelResponse.ok) {
        throw new Error('无法加载模特图片');
      }
      const modelBlob = await modelResponse.blob();
      formData.append('model_image', modelBlob, 'model.png');
      
      // 获取衣服图片
      const clothesResponse = await fetch(`/images/${selectedClothes.image_path}`);
      if (!clothesResponse.ok) {
        throw new Error('无法加载衣服图片');
      }
      const clothesBlob = await clothesResponse.blob();
      formData.append('clothes_image', clothesBlob, 'clothes.png');
      
      // 添加类别信息
      formData.append('category', selectedClothes.category || 'upper_body');

      const response = await fetch('http://localhost:5000/api/try-on', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`服务器响应错误: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTryOnResult(`data:image/png;base64,${data.images[0]}`);
      } else {
        throw new Error(data.error || '试穿失败');
      }
    } catch (error) {
      console.error('试穿失败:', error);
      alert(`试穿失败: ${error.message}`);
    } finally {
      setTryOnLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wardrobe-container">
      {/* 左侧模特选择区 */}
      <div className="model-selector">
        <h3>选择模特</h3>
        <div className="model-list">
          {models.map((modelId) => (
            <div
              key={modelId}
              className={`model-item ${selectedModel === modelId ? 'selected' : ''}`}
              onClick={() => setSelectedModel(modelId)}
            >
              <img
                src={`/images/models/${modelId}.png`}
                alt={`Model ${modelId}`}
                className="model-thumbnail"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 中间展示区 */}
      <div className="model-display">
        {tryOnLoading ? (
          <div>处理中...</div>
        ) : tryOnResult ? (
          <img src={tryOnResult} alt="Try-on result" className="model-main-image" />
        ) : (
          <img
            src={`/images/models/${selectedModel}.png`}
            alt="Selected model"
            className="model-main-image"
          />
        )}
        
        {/* 修改试穿按钮 */}
        <button
          className="try-on-button"
          onClick={handleTryOn}
          disabled={!selectedModel || !selectedClothes || tryOnLoading}
        >
          {tryOnLoading ? '试穿进行中...' : '立即试穿 👔'}
        </button>
      </div>

      {/* 右侧衣橱商品区 */}
      <div className="wardrobe-items">
        <h2>我的衣橱</h2>
        {wardrobeItems.length === 0 ? (
          <p>你的衣橱是空的，请添加商品。</p>
        ) : (
          <div className="wardrobe-grid">
            {wardrobeItems.map(product => {
              const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);
              return (
                <div 
                  key={product.id} 
                  className={`wardrobe-item ${selectedClothes?.id === product.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedClothes(product);
                    setTryOnResult(null); // Reset try-on result when changing clothes
                  }}
                >
                  <img src={`/images/${product.image_path}`} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Price: ${price.toFixed(2)}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWardrobe(product.id);
                      if (selectedClothes?.id === product.id) {
                        setSelectedClothes(null);
                        setTryOnResult(null);
                      }
                    }}
                    className="remove-button"
                  >
                    从衣橱中移除
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wardrobe;



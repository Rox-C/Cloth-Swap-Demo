const express = require('express');
const mysql2 = require('mysql2'); // 使用 mysql2 而不是 mysql
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { spawn } = require('child_process');
const fs = require('fs');
const multer = require('multer'); // 添加 multer
const FormData = require('form-data'); // 添加 form-data
const fetch = require('node-fetch'); // 添加 node-fetch

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000', // 允许来自前端应用的请求
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // 解析 JSON 请求体

// 提供 public 目录下的静态文件
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));
app.use(express.static(path.join(__dirname, '../client/public')));

// 设置数据库连接
const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root', // 替换为你的数据库用户名
  password: 'lxt031222', // 替换为你的数据库密码
  database: 'simple_ecommerce'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// 注册新用户
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 检查用户名和邮箱是否已存在
    const checkQuery = 'SELECT * FROM customers WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], async (err, results) => {
      if (err) {
        console.error('Error checking existing users:', err.stack);
        return res.status(500).send('Server error');
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // 加密密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 插入新用户
      const insertQuery = 'INSERT INTO customers (username, email, password_hash) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting new user:', err.stack);
          return res.status(500).send('Server error');
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Server error');
  }
});

// 用户登录
// 登录接口
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM customers WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 生成 token，设置较短的过期时间
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        'your_jwt_secret_key',
        { expiresIn: '1h' } // token 1小时后过期
      );

      res.json({
        token,
        username: user.username,
        email: user.email
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 获取所有商品的 API 端点（受保护）
app.get('/api/products', verifyToken, (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// 验证 JWT 令牌的中间件
// 修改验证中间件
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// 修改产品接口
app.get('/api/products', verifyToken, (req, res) => {
  console.log('Authenticated user:', req.user); // 添加日志
  
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// 添加试穿接口
// 删除旧的试穿接口
// 删除这段代码:
// app.post('/api/try-on', async (req, res) => {
//   try {
//     const formData = new FormData();
//     formData.append('model_image', req.files.model_image.data);
//     formData.append('clothes_image', req.files.clothes_image.data);
//     formData.append('category', req.body.category);

// });

// 配置 multer 中间件
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制文件大小为 10MB
  }
});

// 修改试穿接口
app.post('/api/try-on', upload.fields([
  { name: 'model_image', maxCount: 1 },
  { name: 'clothes_image', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received try-on request');
    
    if (!req.files || !req.files.model_image || !req.files.clothes_image) {
      console.error('Missing files');
      return res.status(400).json({
        success: false,
        error: '缺少必要的图片文件'
      });
    }

    const formData = new FormData();
    
    const modelBuffer = req.files.model_image[0].buffer;
    const clothesBuffer = req.files.clothes_image[0].buffer;
    
    formData.append('model_image', modelBuffer, {
      filename: 'model_image.png',
      contentType: 'image/png'
    });
    
    formData.append('clothes_image', clothesBuffer, {
      filename: 'clothes_image.png',
      contentType: 'image/png'
    });
    
    const category = 'upper_body';  // 确保使用正确的类别名称
    console.log('Using category:', category);
    formData.append('category', category);

    const response = await fetch('http://localhost:7865/try-on', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python server error:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.images || !result.images.length) {
      throw new Error('Invalid response from server');
    }

    res.json(result);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
});



const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/mock-api',
    createProxyMiddleware({
      target: 'http://localhost:5000', // 假设你的后端运行在这个地址
      changeOrigin: true,
    })
  );
};



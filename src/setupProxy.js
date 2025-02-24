// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:8080', // URL вашего бэкенда
      changeOrigin: true,
      secure: false
    })
  );
};
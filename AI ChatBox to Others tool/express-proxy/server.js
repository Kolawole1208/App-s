const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const AZURE = 'https://operamadic-chatbox-bbgag9gudhegeeca.westeurope-01.azurewebsites.net';
const app = express();

// request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy ONLY /api/customers (no duplicate context)
app.use('/api/customers', createProxyMiddleware({
  target: AZURE,
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/api/customers': '/api/customers' },
  onProxyReq: (proxyReq, req, res) => {
    console.log('proxy -> upstream:', req.method, req.originalUrl, '->', proxyReq.path);
    if (req.headers.authorization) proxyReq.setHeader('authorization', req.headers.authorization);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('upstream response:', proxyRes.statusCode, proxyRes.headers['content-type']);
  },
  onError: (err, req, res) => {
    console.error('proxy error:', err && err.message);
    res.status(502).send('Proxy error');
  }
}));

// static UI
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express proxy listening on http://localhost:${PORT}`));
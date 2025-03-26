/**
 * Proxy Server dla Expo Snack
 * 
 * Ten serwer służy jako pośrednik w komunikacji z Expo Snack, aby obejść ograniczenia CORS.
 * 
 * Instalacja:
 * npm install express http-proxy-middleware cors
 * 
 * Uruchomienie:
 * node proxy-server.js
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

// Konfiguracja CORS
app.use(cors({
  origin: '*', // Lub konkretna domena Twojej aplikacji
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logowanie zapytań
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Proxy do Expo Snack
app.use('/expo-proxy', createProxyMiddleware({
  target: 'https://snack.expo.dev',
  changeOrigin: true,
  pathRewrite: {
    '^/expo-proxy': ''
  },
  onProxyRes: function(proxyRes, req, res) {
    // Dodawanie nagłówków CORS do odpowiedzi
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy Error');
  }
}));

// Prosty endpoint do sprawdzenia, czy serwer działa
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Expo Snack Proxy Server</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2196F3; }
          code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Expo Snack Proxy Server</h1>
        <p>Serwer proxy dla Expo Snack działa poprawnie!</p>
        <p>Adres proxy: <code>http://localhost:${PORT}/expo-proxy</code></p>
        <p>Przykład użycia: <code>http://localhost:${PORT}/expo-proxy/embedded?preview=true&platform=ios&code=...</code></p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Proxy endpoint: http://localhost:${PORT}/expo-proxy`);
}); 
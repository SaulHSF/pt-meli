/**
 * API server with CORS protection
 * Only allows requests from the configured FRONTEND_URL origin
 */

const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = parseInt(process.env.API_PORT || '3001', 10);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// CORS: solo permitir el origen del frontend
server.use(
  cors({
    origin: (origin, callback) => {
      const allowNoOrigin = process.env.NODE_ENV !== 'production';
      if (!origin && allowNoOrigin) {
        return callback(null, true);
      }
      const allowedOrigins = FRONTEND_URL.split(',').map((u) => u.trim());
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

server.use(middlewares);
server.use(router);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
  console.log(`CORS allowed origin: ${FRONTEND_URL}`);
});

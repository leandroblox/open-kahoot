import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { GameServer } from './src/lib/game';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000');

// Optional public facing URL used only for logging purposes
const publicUrl = process.env.PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Allow larger payloads (e.g. base64-encoded images) but keep it reasonable
  const io = new SocketIOServer(httpServer, {
    // 1 MB - sufficient for text/JSON, images should be URLs
    maxHttpBufferSize: 1e6,
    cors: {
      origin: ["http://99ia.com.br", "http://localhost:3000"],
      methods: ["GET", "POST"]
    }
  });

  // Initialize the modular GameServer
  const gameServer = new GameServer(io);
  
  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    gameServer.shutdown();
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    gameServer.shutdown();
    httpServer.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      const addressDescription = publicUrl || `http://${hostname === '0.0.0.0' ? 'localhost' : hostname}:${port}`;
      console.log(`Ready on ${addressDescription}`);
      console.log(`Game server initialized with modular architecture`);
    });
}); 

// src/server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './prisma.js';

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`
🚀 VaultFlow API is running!
📡 URL: http://localhost:${port}
🛠️  Environment: ${process.env.NODE_ENV || 'development'}
🔒 Database: SQLite (dev.db)
📝 API Docs: http://localhost:${port}/api
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

// Close database connection on shutdown
process.on('exit', () => {
  prisma.$disconnect();
});

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import api from './server/routes/api.js';
import connectDB from './db.js';
import { Server } from 'socket.io';
const log = console.log;
const dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
connectDB();

// Parsers for POST data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(dirname, '/client/build')));

// Set our api routes
app.use('/api', api);

// For all GET requests, send back the compiled index.html
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(dirname, '/client/build/index.html'));
});

// Get port from environment and start listening
const port = process.env.PORT || 5000;
app.set('port', port);
const server = app.listen(port, console.log(`Server running on PORT ${port}`));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  log('socket io connected');

  socket.on('clientCodeChange', ({ roomId, language, code }) => {
    log(code);
    socket.to(roomId).emit('serverCodeChanged', { language, code });
    console.log(code);
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    log(`Socket joined room ${roomId}`);
  });
});

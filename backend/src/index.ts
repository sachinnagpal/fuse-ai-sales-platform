import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import companyRoutes from './routes/companyRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeQueueService } from './services/QueueService';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:['http://localhost:5173', process.env.FRONTEND_URL || 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL || 'http://localhost:3000'],
  methods: ['GET', 'POST']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/company-prospector';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/companies', companyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Company Prospector API' });
});

// Initialize QueueService with Socket.IO
initializeQueueService(io);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
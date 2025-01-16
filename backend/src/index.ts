import express from 'express';
import dotenv from 'dotenv';
import router from './routes/transactionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/transactions', router);

// Start server

 const server=app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app , server};


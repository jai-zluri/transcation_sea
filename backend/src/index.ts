


import express from 'express';
import dotenv from 'dotenv';
import router from './routes/transactionRoutes';
import cors from 'cors';





dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
//cors
app.use(cors());

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/transactions', router);





// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


export { app, server };

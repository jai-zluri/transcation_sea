// import express, { Application, Request, Response } from 'express';
// import bodyParser from 'body-parser';
// import transactionRoutes from './routes/transactions';

// const app: Application = express();
// const port: number = 3000;

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/transactions', transactionRoutes);

// // Test Route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Backend is running!');
// });

// // Start Server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });





import express from 'express';
import router from './routes/transactions'; // Import your routes

const app = express();

// Middleware for parsing JSON and handling form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router for handling routes
app.use('/transactions', router);

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});




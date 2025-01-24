


// import express from 'express';
// import dotenv from 'dotenv';
// import router from './routes/transactionRoutes';
// import cors from 'cors';





// dotenv.config();


// const app = express();
// const PORT = process.env.PORT || 5000;
// //cors
// app.use(cors());


// // Middleware to parse incoming requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// // Define a simple route
// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });
// app.use('/transactions', router);





// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// export { app, server };

// backend/index.ts
import express from 'express';
import dotenv from 'dotenv';
import router from './routes/transactionRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Transactions route
app.use('/transactions', router);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export app and server (for testing, or handling server in tests)
export { app, server };

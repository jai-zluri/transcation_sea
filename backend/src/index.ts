


import express from 'express';
import router from './routes/transactions'; // Import your routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON and handling form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the router for handling routes
app.use('/transactions', router);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app, server }; // Export both app and server for testing


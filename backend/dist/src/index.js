"use strict";
// import express from 'express';
// import dotenv from 'dotenv';
// import router from './routes/transactionRoutes';
// import cors from 'cors';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Root route
app.get("/", (req, res) => {
    res.send("Server is running!");
});
// Transactions route
app.use('/transactions', transactionRoutes_1.default);
// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.server = server;

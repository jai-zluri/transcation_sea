"use strict";
// import express, { Router } from 'express';
// import { upload } from '../helpers/fileHelper';
// import {
//   processCsvFile,
//   addTransaction,
//   updateTransaction,
//   deleteTransaction,
//   getTransactions,
//   getPaginatedTransactions,
// } from '../services/transactionService';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router: Router = express.Router();
// // Upload and process CSV
// router.post('/upload', upload.single('file'), processCsvFile);
// // Fetch all transactions
// router.get('/transactions', getTransactions);
// // Fetch paginated transactions
// router.get('/transactions/paginated', getPaginatedTransactions);
// // Add a new transaction
// router.post('/transactions', addTransaction);
// // Update an existing transaction
// router.put('/transactions/:id', updateTransaction);
// // Delete a transaction (soft or hard delete)
// router.delete('/transactions/:id', deleteTransaction);
// export default router;
// backend/routes/transactionRoutes.ts
const express_1 = __importDefault(require("express"));
const fileHelper_1 = require("../helpers/fileHelper");
const transactionService_1 = require("../services/transactionService");
const router = express_1.default.Router();
// Upload and process CSV
router.post('/upload', fileHelper_1.upload.single('file'), transactionService_1.processCsvFile);
// Fetch all transactions
router.get('/', transactionService_1.getTransactions); // Corrected from '/transactions' to '/' for the route
// Fetch paginated transactions
router.get('/paginated', transactionService_1.getPaginatedTransactions);
// Add a new transaction
router.post('/', transactionService_1.addTransaction); // Corrected from '/transactions' to '/' for the route
// Update an existing transaction
router.put('/:id', transactionService_1.updateTransaction);
// Delete a transaction (soft or hard delete)
router.delete('/:id', transactionService_1.deleteTransaction);
exports.default = router;

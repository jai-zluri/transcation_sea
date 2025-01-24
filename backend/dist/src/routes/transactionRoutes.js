"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileHelper_1 = require("../helpers/fileHelper");
const transactionService_1 = require("../services/transactionService");
const router = express_1.default.Router();
// Upload and process CSV
router.post('/upload', fileHelper_1.upload.single('file'), transactionService_1.processCsvFile);
// Fetch all transactions
router.get('/transactions', transactionService_1.getTransactions);
// Fetch paginated transactions
router.get('/transactions/paginated', transactionService_1.getPaginatedTransactions);
// Add a new transaction
router.post('/transactions', transactionService_1.addTransaction);
// Update an existing transaction
router.put('/transactions/:id', transactionService_1.updateTransaction);
// Delete a transaction (soft or hard delete)
router.delete('/transactions/:id', transactionService_1.deleteTransaction);
exports.default = router;

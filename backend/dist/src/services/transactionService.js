"use strict";
// import { Request, Response } from 'express';
// import fs from 'fs';
// import csvParser from 'csv-parser';
// import Decimal from 'decimal.js';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.addTransaction = exports.getPaginatedTransactions = exports.getTransactions = exports.processCsvFile = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const processCsvFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded!' });
        return;
    }
    const file = req.file;
    // Check file type (ensure it's a CSV)
    if (file.mimetype !== 'text/csv') {
        res.status(400).json({ error: 'Only CSV files are allowed!' });
        return;
    }
    // Check file size limit
    if (file.size > MAX_FILE_SIZE) {
        res.status(400).json({ error: 'File size exceeds the limit of 1MB.' });
        return;
    }
    const filePath = file.path;
    const transactions = [];
    let isEmpty = true; // To track if the file is empty
    let malformedRows = false; // Flag for malformed rows
    fs_1.default.createReadStream(filePath)
        .pipe((0, csv_parser_1.default)())
        .on('data', (row) => {
        var _a, _b, _c;
        isEmpty = false;
        const date = (_a = row.Date) === null || _a === void 0 ? void 0 : _a.trim();
        const description = (_b = row.Description) === null || _b === void 0 ? void 0 : _b.trim();
        const amount = parseFloat((_c = row.Amount) === null || _c === void 0 ? void 0 : _c.trim());
        if (date) {
            const [day, month, year] = date.split('-');
            if (day && month && year) {
                const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
                if (isNaN(formattedDate.getTime())) {
                    malformedRows = true;
                }
                else {
                    transactions.push({
                        date: formattedDate,
                        description,
                        amount,
                        currency: row.Currency || null,
                    });
                }
            }
            else {
                malformedRows = true;
            }
        }
        if (isNaN(amount)) {
            malformedRows = true;
        }
        if (!date || !description || isNaN(amount)) {
            malformedRows = true;
        }
    })
        .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        if (isEmpty) {
            res.status(400).json({ error: 'Uploaded CSV file is empty.' });
            return;
        }
        if (malformedRows) {
            res.status(400).json({ error: 'CSV contains malformed rows. Please fix and retry.' });
            return;
        }
        try {
            yield prisma.transaction.createMany({
                data: transactions,
                skipDuplicates: true,
            });
            res.status(200).json({
                message: 'File processed and transactions saved successfully!',
                inserted: transactions.length,
            });
        }
        catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: 'Failed to save transactions.', details: err.message });
            }
            else {
                res.status(500).json({ error: 'An unexpected error occurred.' });
            }
        }
        finally {
            fs_1.default.unlinkSync(filePath);
        }
    }));
});
exports.processCsvFile = processCsvFile;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.transaction.findMany({
            orderBy: {
                date: 'desc',
            },
        });
        res.json(transactions);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                error: 'Failed to fetch transactions.',
                details: err.message, // Provides details about the error
            });
        }
        else {
            res.status(500).json({
                error: 'An unexpected error occurred.',
            });
        }
    }
});
exports.getTransactions = getTransactions;
// Get paginated transactions
const getPaginatedTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const [transactions, totalCount] = yield Promise.all([
            prisma.transaction.findMany({ skip: offset, take: limit, orderBy: { date: 'desc' } }),
            prisma.transaction.count(),
        ]);
        res.json({ transactions, totalCount });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: 'Failed to fetch transactions.', details: err.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});
exports.getPaginatedTransactions = getPaginatedTransactions;
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, description, amount, currency } = req.body;
    // Check for missing required fields
    if (!date || !description || typeof amount !== 'number') {
        res.status(400).json({ error: 'Missing required fields.' });
        return;
    }
    // Validate the date
    const parsedDate = new Date(date);
    const month = parsedDate.getMonth() + 1; // getMonth() returns 0-based month (0 = January, 1 = February, etc.)
    const day = parsedDate.getDate();
    // Check if the day is valid based on the month
    if ((month === 2 && day < 1 || day > 29) || // For February, only days 1-29 are valid
        (month !== 2 && day < 1 || day > 31) // For other months, only days 1-31 are valid
    ) {
        res.status(400).json({ error: 'Invalid date. Day should be between 1-29 for February or 1-31 for other months.' });
        return;
    }
    try {
        const transaction = yield prisma.transaction.create({
            data: { date: parsedDate, description, amount, currency },
        });
        res.status(201).json(transaction);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: 'Failed to add transaction.', details: err.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});
exports.addTransaction = addTransaction;
//update
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { date, description, amount, currency } = req.body;
    // Check if transaction ID is valid
    if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: 'Missing transaction ID.' });
        return;
    }
    // Validate the date format
    if (!isValidDate(date)) {
        res.status(400).json({ error: 'Invalid date format.' });
        return;
    }
    try {
        const updatedTransaction = yield prisma.transaction.update({
            where: { id: parseInt(id) },
            data: {
                date: new Date(date),
                description,
                amount,
                currency,
            },
        });
        if (!updatedTransaction) {
            res.status(404).json({ error: 'Transaction not found.' });
            return;
        }
        res.status(200).json(updatedTransaction);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: 'Failed to update transaction.', details: err.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});
exports.updateTransaction = updateTransaction;
// Helper function to validate the date
const isValidDate = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    if (month < 1 || month > 12) {
        return false;
    }
    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
};
// Delete a transaction
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const isHardDelete = req.query.hard === 'true';
    if (!id) {
        res.status(400).json({ error: 'Missing transaction ID.' });
        return;
    }
    try {
        if (isHardDelete) {
            yield prisma.transaction.delete({ where: { id: parseInt(id) } });
        }
        else {
            yield prisma.transaction.update({
                where: { id: parseInt(id) },
                data: { deletedAt: new Date() },
            });
        }
        res.status(204).send();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: 'Failed to delete transaction.', details: err.message });
        }
        else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
});
exports.deleteTransaction = deleteTransaction;

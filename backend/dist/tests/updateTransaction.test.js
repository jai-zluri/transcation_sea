"use strict";
// import { updateTransaction } from '../src/services/transactionService';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// describe('updateTransaction', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   beforeEach(() => {
//     req = { params: {}, body: {} };
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });
//   it('should update a transaction successfully', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     // Mocking successful database update
//     (prisma.transaction.update as jest.Mock).mockResolvedValue(req.body);
//     await updateTransaction(req as Request, res as Response);
//     // Ensure status is called with 200 and the updated data is returned
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(req.body);
//   });
//   it('should handle missing transaction id in request params', async () => {
//     req.params = {};  // Missing transaction ID in params
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 400 response with an error message
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
//   });
//   it('should return an error for invalid date (February 30th)', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-02-30', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 400 response with an error message for invalid date
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
//   });
//   it('should return an error for invalid date (31st February)', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-02-31', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 400 response with an error message for invalid date
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
//   });
//   it('should return an error for invalid date (April 31st)', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-04-31', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 400 response with an error message for invalid date
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
//   });
//   it('should return an error for invalid date (Invalid month)', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-13-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 400 response with an error message for invalid month
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
//   });
//   it('should handle errors while updating a transaction (Database error)', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     // Simulating a database error
//     const mockError = new Error('Database error');
//     (prisma.transaction.update as jest.Mock).mockRejectedValue(mockError);
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 500 response with the database error message
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
//   });
//   it('should handle errors while updating a transaction (Non-Error instance)', async () => {
//     req.params = { id: '1' };
//     req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
//     // Simulating a non-Error instance (e.g., string message)
//     const mockError = 'Database error';
//     (prisma.transaction.update as jest.Mock).mockRejectedValue(mockError);
//     await updateTransaction(req as Request, res as Response);
//     // Expecting a 500 response with a generic error message
//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
//   });
// });
const transactionService_1 = require("../src/services/transactionService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('updateTransaction', () => {
    let req;
    let res;
    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should update a transaction successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
        // Mocking successful database update
        prisma.transaction.update.mockResolvedValue(req.body);
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Ensure status is called with 200 and the updated data is returned
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.body);
    }));
    it('should handle missing transaction id in request params', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {}; // Missing transaction ID in params
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 400 response with an error message
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
    }));
    it('should return an error for invalid date (February 30th)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-02-30', description: 'Updated', amount: 200.5, currency: 'EUR' };
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 400 response with an error message for invalid date
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
    }));
    it('should return an error for invalid date (31st February)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-02-31', description: 'Updated', amount: 200.5, currency: 'EUR' };
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 400 response with an error message for invalid date
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
    }));
    it('should return an error for invalid date (April 31st)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-04-31', description: 'Updated', amount: 200.5, currency: 'EUR' };
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 400 response with an error message for invalid date
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
    }));
    it('should return an error for invalid date (Invalid month)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-13-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 400 response with an error message for invalid month
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
    }));
    it('should handle errors while updating a transaction (Database error)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
        // Simulating a database error
        const mockError = new Error('Database error');
        prisma.transaction.update.mockRejectedValue(mockError);
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 500 response with the database error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update transaction.', details: 'Database error' });
    }));
    it('should handle errors while updating a transaction (Non-Error instance)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.body = { date: '2025-01-15', description: 'Updated', amount: 200.5, currency: 'EUR' };
        // Simulating a non-Error instance (e.g., string message)
        const mockError = 'Database error';
        prisma.transaction.update.mockRejectedValue(mockError);
        yield (0, transactionService_1.updateTransaction)(req, res);
        // Expecting a 500 response with a generic error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
    }));
});

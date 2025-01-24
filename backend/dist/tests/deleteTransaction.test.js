"use strict";
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
const transactionService_1 = require("../src/services/transactionService");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('deleteTransaction', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            query: {} // Initialize req.query to avoid undefined error
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });
    it('should delete a transaction successfully (soft delete)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.query = { hard: 'false' }; // Soft delete flag
        prisma.transaction.update.mockResolvedValue({});
        yield (0, transactionService_1.deleteTransaction)(req, res); // TODO: Verify that the transaction is deleted- completed
        // Verify that the update method is called for soft delete
        // Now expecting `deletedAt` instead of `deleted`
        expect(prisma.transaction.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { deletedAt: expect.any(Date) }, // Expecting a timestamp for soft delete
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    }));
    it('should delete a transaction successfully (hard delete)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.query = { hard: 'true' }; // Hard delete flag
        prisma.transaction.delete.mockResolvedValue({});
        yield (0, transactionService_1.deleteTransaction)(req, res);
        // Verify that the delete method is called for hard delete
        expect(prisma.transaction.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    }));
    it('should handle missing transaction id in request params', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = {}; // No ID in params
        yield (0, transactionService_1.deleteTransaction)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing transaction ID.' });
    }));
    it('should handle missing "hard" query parameter (defaults to soft delete)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.query = {}; // Missing hard query parameter, should default to soft delete
        prisma.transaction.update.mockResolvedValue({});
        yield (0, transactionService_1.deleteTransaction)(req, res);
        // Verify that the update method is called for soft delete
        // Expecting `deletedAt` to be set for soft delete
        expect(prisma.transaction.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { deletedAt: expect.any(Date) }, // Expecting a timestamp for soft delete
        });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    }));
    it('should handle errors while deleting a transaction (Database error)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.query = { hard: 'false' }; // Soft delete flag
        const mockError = new Error('Database error');
        prisma.transaction.update.mockRejectedValue(mockError);
        yield (0, transactionService_1.deleteTransaction)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete transaction.', details: 'Database error' });
    }));
    it('should handle errors while deleting a transaction (Non-Error instance)', () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { id: '1' };
        req.query = { hard: 'false' }; // Soft delete flag
        const mockError = 'Database error'; // Simulate non-Error instance
        prisma.transaction.update.mockRejectedValue(mockError);
        yield (0, transactionService_1.deleteTransaction)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred.' });
    }));
});

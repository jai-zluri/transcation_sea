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
describe('getTransactions', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should fetch all transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock detailed transaction data
        const mockTransactions = [
            { id: 1, description: 'Transaction 1', amount: 100, date: '2025-01-10', currency: 'USD' },
            { id: 2, description: 'Transaction 2', amount: 200, date: '2025-01-11', currency: 'USD' },
        ];
        prisma.transaction.findMany.mockResolvedValue(mockTransactions);
        yield (0, transactionService_1.getTransactions)(req, res);
        // Ensure the response contains the full transaction details
        expect(res.json).toHaveBeenCalledWith(mockTransactions);
    }));
    // Add test case for empty response- done
    it('should return an empty array when no transactions exist', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock an empty response from the database
        prisma.transaction.findMany.mockResolvedValue([]);
        yield (0, transactionService_1.getTransactions)(req, res);
        expect(res.json).toHaveBeenCalledWith([]); // Ensure it returns an empty array
    }));
    it('should handle errors while fetching transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma.transaction.findMany.mockRejectedValue(new Error('Database error'));
        yield (0, transactionService_1.getTransactions)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
    }));
});

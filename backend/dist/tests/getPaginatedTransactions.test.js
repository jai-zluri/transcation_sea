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
describe('getPaginatedTransactions', () => {
    let req;
    let res;
    beforeEach(() => {
        req = { query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should fetch paginated transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock query parameters
        req.query = { page: '1', limit: '2' };
        // Mock database response
        const mockTransactions = [
            { id: 1, description: 'Transaction 1', amount: 100, date: '2025-01-10', currency: 'USD' },
            { id: 2, description: 'Transaction 2', amount: 200, date: '2025-01-11', currency: 'USD' },
        ];
        prisma.transaction.findMany.mockResolvedValue(mockTransactions);
        prisma.transaction.count.mockResolvedValue(5);
        // Call the service
        yield (0, transactionService_1.getPaginatedTransactions)(req, res);
        // Assertions
        expect(res.json).toHaveBeenCalledWith({
            transactions: mockTransactions, // Returning detailed transactions instead of just IDs
            totalCount: 5,
        });
    }));
    it('should handle errors while fetching paginated transactions', () => __awaiter(void 0, void 0, void 0, function* () {
        prisma.transaction.findMany.mockRejectedValue(new Error('Database error'));
        yield (0, transactionService_1.getPaginatedTransactions)(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch transactions.', details: 'Database error' });
    }));
});

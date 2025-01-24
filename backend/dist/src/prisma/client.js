"use strict";
// import { PrismaClient } from '@prisma/client';
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
// const prisma = new PrismaClient();
// export default prisma;
// import { PrismaClient } from '@prisma/client';
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function addTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newTransaction = yield prisma.transaction.create({
                data: {
                    date: new Date('2025-01-20'),
                    description: 'Test Transaction',
                    amount: 100.50, // Use native JavaScript number type
                    currency: 'USD',
                },
            });
            console.log('Transaction added:', newTransaction);
        }
        catch (err) {
            console.error('Error inserting transaction:', err);
        }
    });
}
addTransaction();

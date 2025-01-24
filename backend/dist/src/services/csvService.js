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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCsvFileService = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const decimal_js_1 = __importDefault(require("decimal.js"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const processCsvFileService = (file) => {
    return new Promise((resolve, reject) => {
        const filePath = file.path;
        const transactions = [];
        let isEmpty = true;
        let malformedRows = false;
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            var _a, _b, _c;
            isEmpty = false;
            const date = (_a = row.Date) === null || _a === void 0 ? void 0 : _a.trim();
            const description = (_b = row.Description) === null || _b === void 0 ? void 0 : _b.trim();
            const amount = new decimal_js_1.default((_c = row.Amount) === null || _c === void 0 ? void 0 : _c.trim());
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
            if (amount.isNaN()) {
                malformedRows = true;
            }
            if (!date || !description || amount.isNaN()) {
                malformedRows = true;
            }
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            if (isEmpty) {
                reject(new Error('Uploaded CSV file is empty.'));
                return;
            }
            if (malformedRows) {
                reject(new Error('CSV contains malformed rows. Please fix and retry.'));
                return;
            }
            try {
                yield prisma.transaction.createMany({
                    data: transactions,
                    skipDuplicates: true,
                });
                fs_1.default.unlinkSync(filePath);
                resolve({
                    message: 'File processed and transactions saved successfully!',
                    inserted: transactions.length,
                });
            }
            catch (err) {
                reject(err);
            }
        }))
            .on('error', (err) => {
            reject(err);
        });
    });
};
exports.processCsvFileService = processCsvFileService;

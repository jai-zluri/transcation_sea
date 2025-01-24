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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
const index_2 = require("../src/index");
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const fs_1 = __importDefault(require("fs"));
describe('File Upload', () => {
    const testDir = path_1.default.join(__dirname, 'test-files');
    let testFilePaths = [];
    beforeAll(() => {
        if (!fs_1.default.existsSync(testDir)) {
            fs_1.default.mkdirSync(testDir);
        }
        const files = [
            { name: 'valid.csv', content: 'Date,Description,Amount,Currency\n01-01-2024,Test Transaction,100.00,USD' },
            { name: 'invalid.txt', content: 'This is not a CSV file' },
            { name: 'malformed.csv', content: 'InvalidHeader\nInvalidData' },
            { name: 'empty.csv', content: '' },
            // Add more files if necessary to cover edge cases
        ];
        files.forEach(file => {
            const filePath = path_1.default.join(testDir, file.name);
            fs_1.default.writeFileSync(filePath, file.content);
            testFilePaths.push(filePath);
        });
        const largeCsvPath = path_1.default.join(testDir, 'large.csv');
        const largeContent = 'Date,Description,Amount,Currency\n' + '01-01-2024,Test Transaction,100.00,USD\n'.repeat(50000);
        fs_1.default.writeFileSync(largeCsvPath, largeContent);
        testFilePaths.push(largeCsvPath);
    });
    afterAll(done => {
        const deletePromises = testFilePaths.map(filePath => {
            return new Promise((resolve) => {
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlink(filePath, () => resolve());
                }
                else {
                    resolve();
                }
            });
        });
        Promise.all(deletePromises)
            .then(() => {
            fs_1.default.rm(testDir, { recursive: true, force: true }, () => {
                index_2.server.close(() => done());
            });
        })
            .catch(() => {
            done();
        });
    });
    it('should successfully upload a valid CSV file', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload')
            .attach('file', path_1.default.join(testDir, 'valid.csv'));
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'File processed and transactions saved successfully!');
        expect(response.body).toHaveProperty('inserted');
        expect(response.body.inserted).toBeGreaterThan(0);
    }));
    it('should return an error if no file is uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No file uploaded!');
    }));
    it('should handle empty CSV file', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload')
            .attach('file', path_1.default.join(testDir, 'empty.csv'));
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Uploaded CSV file is empty.');
    }));
    it('should handle CSV with invalid date format', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidDateCsvPath = path_1.default.join(testDir, 'invalid-date.csv');
        fs_1.default.writeFileSync(invalidDateCsvPath, 'Date,Description,Amount,Currency\ninvalid-date,Test Transaction,100.00,USD');
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload')
            .attach('file', invalidDateCsvPath);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('CSV contains malformed rows. Please fix and retry.');
    }));
    it('should handle CSV with invalid amount format', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidAmountCsvPath = path_1.default.join(testDir, 'invalid-amount.csv');
        fs_1.default.writeFileSync(invalidAmountCsvPath, 'Date,Description,Amount,Currency\n01-01-2024,Test Transaction,not-a-number,USD');
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload')
            .attach('file', invalidAmountCsvPath);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('CSV contains malformed rows. Please fix and retry.');
    }));
    it('should handle missing required columns', () => __awaiter(void 0, void 0, void 0, function* () {
        const missingColumnsCsvPath = path_1.default.join(testDir, 'missing-columns.csv');
        fs_1.default.writeFileSync(missingColumnsCsvPath, 'Date\n01-01-2024');
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload')
            .attach('file', missingColumnsCsvPath);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('CSV contains malformed rows. Please fix and retry.');
    }));
});

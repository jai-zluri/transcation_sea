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
const fs_1 = __importDefault(require("fs"));
const csvParserUtils_1 = require("../src/utils/csvParserUtils");
const mock_fs_1 = __importDefault(require("mock-fs")); // Default import for mock-fs
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../src/index");
jest.mock('fs'); // Mock the fs module
jest.mock('csv-parser', () => jest.fn());
jest.mock('../src/utils/database', () => ({
    saveTransactions: jest.fn(), // Mock the database function
}));
describe('CSV Parser', () => {
    const mockFilePath = '/path/to/mock-file.csv';
    const mockInvalidFilePath = '/path/to/invalid-file.csv';
    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks
        // Mock file system
        (0, mock_fs_1.default)({
            'valid.csv': 'date,description,amount,category\n2025-01-15,Test 1,100.5,Food\n2025-01-16,Test 2,200.75,Travel',
            'invalid.csv': 'date,description,amount\ninvalid-date,missing-amount,missing-category', // Invalid CSV content
            'large.csv': '', // Empty file
            'nonexistent.csv': '', // Non-existent mock file for error testing
        });
        // Mock fs.createReadStream for testing
        fs_1.default.createReadStream.mockReturnValueOnce({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === 'data') {
                    const mockData = [
                        { date: '2025-01-15', description: 'Test 1', amount: '100.5', category: 'Food' },
                        { date: '2025-01-16', description: 'Test 2', amount: '200.75', category: 'Travel' },
                    ];
                    mockData.forEach((row) => callback(row));
                }
                if (event === 'end')
                    callback();
                return this;
            }),
        });
        // Mock fs.statSync for file size
        fs_1.default.statSync.mockReturnValueOnce({ size: 5000 }); // Mock file size < 10MB
    });
    afterEach(() => {
        mock_fs_1.default.restore(); // Cleanup the mocked file system
    });
    it('should parse valid CSV data successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield (0, csvParserUtils_1.parseCSV)('valid.csv');
        expect(transactions).toEqual([
            { date: '2025-01-15', description: 'Test 1', amount: 100.5, category: 'Food' },
            { date: '2025-01-16', description: 'Test 2', amount: 200.75, category: 'Travel' },
        ]);
    }));
    it('should reject when the file does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, csvParserUtils_1.parseCSV)('nonexistent.csv')).rejects.toThrow('File not found');
    }));
    it('should reject when file size exceeds the 10MB limit', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate a file size > 10MB
        fs_1.default.statSync.mockReturnValueOnce({ size: 15 * 1024 * 1024 });
        yield expect((0, csvParserUtils_1.parseCSV)('large.csv')).rejects.toThrow('File size exceeds the 10MB limit');
    }));
    it('should reject when there are invalid or missing fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const transactions = yield (0, csvParserUtils_1.parseCSV)('invalid.csv');
        expect(transactions).toEqual([]); // This test case checks for handling invalid content
    }));
    // Test case for validating file type (only CSV should be allowed)
    it('should reject non-CSV files', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonCsvFile = Buffer.from('This is a test file content'); // Content of the non-CSV file
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/transactions/upload') // Adjust the endpoint path as needed
            .attach('file', nonCsvFile, 'invalid.txt'); // Attaching a non-CSV file
        // Assert that the status code is 400
        expect(response.status).toBe(400);
        // Assert that the error message is correct
        expect(response.body.error).toBe('Only CSV files are allowed!');
    }));
    // Test case for validating file size (file size limit of 10MB)
    it('should handle file size limit (10MB)', () => __awaiter(void 0, void 0, void 0, function* () {
        const largeFilePath = 'large.csv';
        // Simulating file size check (mock size check, since file content is empty)
        const mockFileStats = { size: 15 * 1024 * 1024 }; // 15MB, larger than 10MB
        // Mock the fs.statSync method to return the large file size
        fs_1.default.statSync.mockReturnValueOnce(mockFileStats);
        yield expect((0, csvParserUtils_1.parseCSV)(largeFilePath)).rejects.toThrow('File size exceeds the 10MB limit');
    }));
    it('should handle errors during file reading (Error instance)', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = new Error('File read error');
        fs_1.default.createReadStream.mockReturnValueOnce({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === 'error')
                    callback(mockError); // Trigger the error event
                return this;
            }),
        });
        yield expect((0, csvParserUtils_1.parseCSV)(mockFilePath)).rejects.toThrow('File read error');
    }));
    it('should handle errors during file reading (non-Error instance)', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockError = 'Non-error string';
        fs_1.default.createReadStream.mockReturnValueOnce({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === 'error')
                    callback(mockError); // Trigger non-Error event
                return this;
            }),
        });
        yield expect((0, csvParserUtils_1.parseCSV)(mockFilePath)).rejects.toThrow('Non-error string');
    }));
    it('should reject if file does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidFilePath = 'invalid.csv'; // Path that doesn’t exist in mockfs
        yield expect((0, csvParserUtils_1.parseCSV)(invalidFilePath)).rejects.toThrow('File not found');
    }));
    it('should parse rows with missing optional fields gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = [
            { date: '2025-01-15', description: 'Test 1', amount: '100.5' }, // No category
        ];
        fs_1.default.createReadStream.mockReturnValueOnce({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === 'data') {
                    mockData.forEach((row) => callback(row)); // Send mock data
                }
                if (event === 'end')
                    callback();
                return this;
            }),
        });
        const transactions = yield (0, csvParserUtils_1.parseCSV)('csv_with_missing_fields.csv');
        expect(transactions).toEqual([
            { date: '2025-01-15', description: 'Test 1', amount: 100.5, category: null }, // Handle missing category gracefully
        ]);
    }));
    // New test case for processing a valid CSV file and saving to the database
    it('should process a valid CSV file and save transactions to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = [
            { date: '2025-01-15', description: 'Test 1', amount: '100.5', category: 'Food' },
            { date: '2025-01-16', description: 'Test 2', amount: '200.75', category: 'Travel' },
        ];
        // Mock the database save function
        const { saveTransactions } = require('../src/utils/database');
        saveTransactions.mockResolvedValueOnce(mockData); // Mock the function to resolve with the mockData
        const response = yield (0, supertest_1.default)(index_1.app)
            .post('/upload')
            .attach('file', './valid.csv'); // Attach the valid CSV file
        // Assert that the file was processed and transactions were saved to the database
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File processed and transactions saved successfully!');
        expect(saveTransactions).toHaveBeenCalledWith(mockData); // Check if the database save function was called with correct data
    }));
    it('should handle empty CSV file gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        const emptyFilePath = 'large.csv'; // Simulate an empty file
        // Mock the fs.createReadStream method to simulate an empty CSV file (no data rows)
        fs_1.default.createReadStream.mockReturnValueOnce({
            pipe: jest.fn().mockReturnThis(),
            on: jest.fn((event, callback) => {
                if (event === 'data') {
                    // No data will be sent for an empty file
                }
                if (event === 'end')
                    callback(); // Trigger 'end' event
                return this;
            }),
        });
        // Call the CSV parsing function
        yield expect((0, csvParserUtils_1.parseCSV)(emptyFilePath)).rejects.toThrow('CSV file is empty');
    }));
});


import fs from 'fs';
import request from 'supertest';
import { app } from '../src/index';

import { parseCSV, Transaction } from '../src/utils/csvParserUtils';
import mockFs from 'mock-fs'; // Simulating file system for tests
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

jest.mock('../src/prisma/client', () => ({
  transaction: {
    createMany: jest.fn(),
  },
}));

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB limit

describe('processCsvFileHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app).post('/upload').send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded!');
  });

  it('should reject if the file does not exist (Line 19)', async () => {
    const filePath = '/path/to/nonexistent.csv';

    await expect(parseCSV(filePath)).rejects.toThrow('File not found');
  });
  it('should process a valid CSV file and return an array of transactions', async () => {
    // Mock CSV file content
    mockFs({
      'valid.csv': 'Date,Description,Amount,Category\n2025-01-15,Test Transaction 1,100.5,Food\n2025-01-16,Test Transaction 2,200.75,Transport\n',
    });

    const result = await parseCSV('valid.csv');

    // Assert the parsed transactions match the expected result
    expect(result).toEqual([
      { date: '2025-01-15', description: 'Test Transaction 1', amount: 100.5, category: 'Food' },
      { date: '2025-01-16', description: 'Test Transaction 2', amount: 200.75, category: 'Transport' },
    ]);
  });

  it('should reject if the file does not exist', async () => {
    const result = parseCSV('nonexistent.csv');

    await expect(result).rejects.toThrow('File not found');
  });

  
  it('should process CSV file with missing optional category field', async () => {
    mockFs({
      'valid_without_category.csv': 'Date,Description,Amount\n2025-01-15,Test Transaction 1,100.5\n2025-01-16,Test Transaction 2,200.75\n',
    });

    const result = await parseCSV('valid_without_category.csv');

    // Assert that the category is undefined when missing
    expect(result).toEqual([
      { date: '2025-01-15', description: 'Test Transaction 1', amount: 100.5 },
      { date: '2025-01-16', description: 'Test Transaction 2', amount: 200.75 },
    ]);
  });

  it('should reject if the file exceeds the 10MB limit (Line 26)', async () => {
    const filePath = '/path/to/large.csv';
    const largeFileContent = 'Date,Description,Amount\n' + '01-01-2025,Test,100\n'.repeat(1000000); // Making file large

    mockFs({ [filePath]: largeFileContent });

    await expect(parseCSV(filePath)).rejects.toThrow('File size exceeds the 10MB limit');
  });

  it('should reject if CSV contains invalid or missing fields (Lines 41-48)', async () => {
    const filePath = '/path/to/malformed.csv';
    const malformedContent = 'Date,Description,Amount\ninvalid-date,Test,'; // Invalid data

    mockFs({ [filePath]: malformedContent });

    await expect(parseCSV(filePath)).rejects.toThrow('Invalid or missing required fields');
  });

  it('should reject if there is an error reading the file (Line 53)', async () => {
    const filePath = '/path/to/error.csv';

    mockFs({
      [filePath]: 'Date,Description,Amount\n01-01-2025,Test,100\n',
    });

    // Mock the fs.createReadStream method to simulate an error
    fs.createReadStream = jest.fn().mockImplementationOnce(() => {
      throw new Error('Simulated file read error');
    });

    await expect(parseCSV(filePath)).rejects.toThrow('File read error: Simulated file read error');
  });

  it('should parse CSV and return transactions successfully', async () => {
    const filePath = '/path/to/valid.csv';
    const validCsvContent = 'Date,Description,Amount\n01-01-2025,Test,100\n02-01-2025,Test 2,200\n';

    mockFs({ [filePath]: validCsvContent });

    const result = await parseCSV(filePath);

    expect(result).toEqual([
      { date: '01-01-2025', description: 'Test', amount: 100, category: undefined },
      { date: '02-01-2025', description: 'Test 2', amount: 200, category: undefined },
    ]);
  });
  it('should reject if the file does not exist (Line 19)', async () => {
    const filePath = '/path/to/nonexistent.csv';

    await expect(parseCSV(filePath)).rejects.toThrow('File not found');
  });

  it('should reject if the file exceeds the 10MB limit (Line 26)', async () => {
    const filePath = '/path/to/large.csv';
    const largeFileContent = 'Date,Description,Amount\n' + '01-01-2025,Test,100\n'.repeat(1000000); // Making file large

    mockFs({ [filePath]: largeFileContent });

    await expect(parseCSV(filePath)).rejects.toThrow('File size exceeds the 10MB limit');
  });

  it('should reject if CSV contains invalid or missing fields (Lines 41-48)', async () => {
    const filePath = '/path/to/malformed.csv';
    
    // Simulating a malformed CSV with invalid or missing data
    const malformedCsv = [
      'Date,Description,Amount',  // valid header
      'invalid-date,Test,100',    // invalid date format
      '2025-01-01,,100',          // missing description
      '2025-01-01,Test,'          // missing amount
    ].join('\n');
    
    mockFs({ [filePath]: malformedCsv });

    await expect(parseCSV(filePath)).rejects.toThrow('Invalid or missing required fields');
  });

  it('should reject if there is an error reading the file (Line 53)', async () => {
    const filePath = '/path/to/error.csv';

    mockFs({
      [filePath]: 'Date,Description,Amount\n01-01-2025,Test,100\n',
    });

    // Mock the fs.createReadStream method to simulate an error
    fs.createReadStream = jest.fn().mockImplementationOnce(() => {
      throw new Error('Simulated file read error');
    });

    await expect(parseCSV(filePath)).rejects.toThrow('File read error: Simulated file read error');
  });

  it('should parse CSV and return transactions successfully', async () => {
    const filePath = '/path/to/valid.csv';
    const validCsvContent = 'Date,Description,Amount\n01-01-2025,Test,100\n02-01-2025,Test 2,200\n';

    mockFs({ [filePath]: validCsvContent });

    const result = await parseCSV(filePath);

    expect(result).toEqual([
      { date: '01-01-2025', description: 'Test', amount: 100, category: undefined },
      { date: '02-01-2025', description: 'Test 2', amount: 200, category: undefined },
    ]);
  });

  it('should return 400 if file is not a CSV', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('not a CSV'), { filename: 'invalid.txt', contentType: 'text/plain' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Only CSV files are allowed!');
  });

  it('should return 400 if file exceeds size limit', async () => {
    const largeFile = Buffer.alloc(MAX_FILE_SIZE + 1, 'a');

    const response = await request(app)
      .post('/upload')
      .attach('file', largeFile, { filename: 'large.csv', contentType: 'text/csv' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('File size exceeds the limit of 1MB.');
  });

  it('should return 400 for empty CSV files', async () => {
    mockFs({
      'empty.csv': '',
    });

    const response = await request(app)
      .post('/upload')
      .attach('file', fs.createReadStream('empty.csv'), { filename: 'empty.csv', contentType: 'text/csv' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Uploaded CSV file is empty.');
  });

  it('should return 400 for malformed rows in CSV', async () => {
    mockFs({
      'malformed.csv': 'Date,Description,Amount\ninvalid-date,desc,text\n',
    });

    const response = await request(app)
      .post('/upload')
      .attach('file', fs.createReadStream('malformed.csv'), { filename: 'malformed.csv', contentType: 'text/csv' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CSV contains malformed rows.');
  });

  it('should return 500 if database save fails', async () => {
    (prisma.transaction.createMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    mockFs({
      'valid.csv': 'Date,Description,Amount\n15-01-2025,Test,100\n',
    });

    const response = await request(app)
      .post('/upload')
      .attach('file', fs.createReadStream('valid.csv'), { filename: 'valid.csv', contentType: 'text/csv' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to save transactions.');
    expect(response.body.details).toBe('Database error');
  });

  it('should process valid CSV and save transactions', async () => {
    (prisma.transaction.createMany as jest.Mock).mockResolvedValueOnce({ count: 2 });

    mockFs({
      'valid.csv': 'Date,Description,Amount\n15-01-2025,Test 1,100\n16-01-2025,Test 2,200\n',
    });

    const response = await request(app)
      .post('/upload')
      .attach('file', fs.createReadStream('valid.csv'), { filename: 'valid.csv', contentType: 'text/csv' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transactions saved!');
    expect(response.body.inserted).toBe(2);
  });

  it('should clean up file after processing', async () => {
    (prisma.transaction.createMany as jest.Mock).mockResolvedValueOnce({ count: 1 });

    const filePath = '/tmp/test.csv';
    mockFs({
      [filePath]: 'Date,Description,Amount\n15-01-2025,Test,100\n',
    });

    const response = await request(app)
      .post('/upload')
      .attach('file', fs.createReadStream(filePath), { filename: 'test.csv', contentType: 'text/csv' });

    expect(response.status).toBe(200);
    expect(fs.existsSync(filePath)).toBe(false);
  });
});




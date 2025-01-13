


import request from 'supertest';
import {app} from '../src/index'; // Import only the app instance
import { server } from '../src/index'; // Import server instance for lifecycle control
import path from 'path';
import fs from 'fs';

describe('File Upload', () => {
  const testDir = path.join(__dirname, 'test-files');
  let testFilePaths: string[] = [];

  // Setup: Create test directory and files before tests
  beforeAll(() => {
    // Create test directory if it doesn't exist
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }

    // Create test files
    const files = [
      { name: 'valid.csv', content: 'Date,Description,Amount\n01-01-2024,Test Transaction,100.00' },
      { name: 'invalid.txt', content: 'This is not a CSV file' },
      { name: 'malformed.csv', content: 'InvalidHeader\nInvalidData' },
      { name: 'empty.csv', content: '' },
    ];

    files.forEach(file => {
      const filePath = path.join(testDir, file.name);
      fs.writeFileSync(filePath, file.content);
      testFilePaths.push(filePath);
    });

    // Create large CSV file (>1MB)
    const largeCsvPath = path.join(testDir, 'large.csv');
    const largeContent = 'Date,Description,Amount\n' + '01-01-2024,Test Transaction,100.00\n'.repeat(50000);
    fs.writeFileSync(largeCsvPath, largeContent);
    testFilePaths.push(largeCsvPath);
  });

  // Cleanup: Remove test files and directory after tests
  afterAll(done => {
    // Clean up test files
    testFilePaths.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  
    // Close server to avoid EADDRINUSE error
    server.close(() => done());
  });
  

    // Remove test directory
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }

  //   // Close server to avoid EADDRINUSE error
  //   server.close(done);
  // });

  it('should successfully upload a valid CSV file', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'valid.csv'));

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'File processed and transactions saved successfully!');
    expect(response.body).toHaveProperty('inserted');
    expect(response.body.inserted).toBeGreaterThan(0);
  });

  it('should return an error for non-CSV files', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'invalid.txt'));

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Only CSV files are allowed!');
  });

  it('should return an error if no file is uploaded', async () => {
    const response = await request(app)
      .post('/transactions/upload');

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded!');
  });

  it('should handle malformed CSV data', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'malformed.csv'));

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(200);
    expect(response.body.inserted).toBe(0);
  });

  it('should handle empty CSV file', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'empty.csv'));

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(200);
    expect(response.body.inserted).toBe(0);
  });

  it('should reject files over size limit', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'large.csv'));

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/file size/i);
  });

  it('should handle CSV with invalid date format', async () => {
    const invalidDateCsvPath = path.join(testDir, 'invalid-date.csv');
    fs.writeFileSync(invalidDateCsvPath, 'Date,Description,Amount\ninvalid-date,Test Transaction,100.00');
    testFilePaths.push(invalidDateCsvPath);

    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', invalidDateCsvPath);

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(200);
    expect(response.body.inserted).toBe(0);
  });

  it('should handle CSV with invalid amount format', async () => {
    const invalidAmountCsvPath = path.join(testDir, 'invalid-amount.csv');
    fs.writeFileSync(invalidAmountCsvPath, 'Date,Description,Amount\n01-01-2024,Test Transaction,not-a-number');
    testFilePaths.push(invalidAmountCsvPath);

    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', invalidAmountCsvPath);

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(200);
    expect(response.body.inserted).toBe(0);
  });

  it('should handle missing required columns', async () => {
    const missingColumnsCsvPath = path.join(testDir, 'missing-columns.csv');
    fs.writeFileSync(missingColumnsCsvPath, 'Date,Description\n01-01-2024,Test Transaction');
    testFilePaths.push(missingColumnsCsvPath);

    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', missingColumnsCsvPath);

    console.log(response.status, response.body); // Debugging
    expect(response.status).toBe(200);
    expect(response.body.inserted).toBe(0);
  });
});


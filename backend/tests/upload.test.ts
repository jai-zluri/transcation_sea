import request from 'supertest';
import { app } from '../src/index'; 
import { server } from '../src/index'; 
import path from 'path';
import fs from 'fs';

describe('File Upload', () => {
  const testDir = path.join(__dirname, 'test-files');
  let testFilePaths: string[] = [];

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }

    const files = [
      { name: 'valid.csv', content: 'Date,Description,Amount,Currency\n01-01-2024,Test Transaction,100.00,USD' },
      { name: 'invalid.txt', content: 'This is not a CSV file' },
      { name: 'malformed.csv', content: 'InvalidHeader\nInvalidData' },
      { name: 'empty.csv', content: '' },
    ];

    files.forEach(file => {
      const filePath = path.join(testDir, file.name);
      fs.writeFileSync(filePath, file.content);
      testFilePaths.push(filePath);
    });

    const largeCsvPath = path.join(testDir, 'large.csv');
    const largeContent = 'Date,Description,Amount,Currency\n' + '01-01-2024,Test Transaction,100.00,USD\n'.repeat(50000);
    fs.writeFileSync(largeCsvPath, largeContent);
    testFilePaths.push(largeCsvPath);
  });

  afterAll(done => {
    const deletePromises = testFilePaths.map(filePath => {
      return new Promise<void>((resolve) => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, () => resolve());
        } else {
          resolve();
        }
      });
    });

    Promise.all(deletePromises)
      .then(() => {
        fs.rm(testDir, { recursive: true, force: true }, () => {
          server.close(() => done());
        });
      })
      .catch(() => {
        done();
      });
  });

  it('should successfully upload a valid CSV file', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'valid.csv'));

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'File processed and transactions saved successfully!');
    expect(response.body).toHaveProperty('inserted');
    expect(response.body.inserted).toBeGreaterThan(0);
  });

  it('should return an error for non-CSV files', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'invalid.txt'));

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Only CSV files are allowed!');
  });

  it('should return an error if no file is uploaded', async () => {
    const response = await request(app)
      .post('/transactions/upload');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded!');
  });

  it('should handle malformed CSV data', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'malformed.csv'));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/malformed rows/i);
  });

  it('should handle empty CSV file', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'empty.csv'));

    expect(response.status).toBe(400); 
    expect(response.body.error).toBe('CSV file is empty or contains invalid data!');
  });

  it('should reject files over size limit', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', path.join(testDir, 'large.csv'));

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/file size/i);
  });

  it('should handle CSV with invalid date format', async () => {
    const invalidDateCsvPath = path.join(testDir, 'invalid-date.csv');
    fs.writeFileSync(invalidDateCsvPath, 'Date,Description,Amount,Currency\ninvalid-date,Test Transaction,100.00,USD');
    
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', invalidDateCsvPath);

    expect(response.status).toBe(400); 
    expect(response.body.inserted).toBe(0); 
  });

  it('should handle CSV with invalid amount format', async () => {
    const invalidAmountCsvPath = path.join(testDir, 'invalid-amount.csv');
    fs.writeFileSync(invalidAmountCsvPath, 'Date,Description,Amount,Currency\n01-01-2024,Test Transaction,not-a-number,USD');
    
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', invalidAmountCsvPath);

    expect(response.status).toBe(400); 
    expect(response.body.inserted).toBe(0); 
  });

  it('should handle missing required columns', async () => {
    const missingColumnsCsvPath = path.join(testDir, 'missing-columns.csv');
    fs.writeFileSync(missingColumnsCsvPath, 'Date\n01-01-2024'); 
    
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', missingColumnsCsvPath);

    expect(response.status).toBe(400); 
    expect(response.body.inserted).toBe(0); 
  });
});

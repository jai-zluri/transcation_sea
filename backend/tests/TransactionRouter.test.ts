import request from 'supertest';
import express from 'express';
import transactionRoutes from '../src/routes/transactionRoutes';
import * as transactionController from '../src/controllers/transactionsController';
import { upload } from '../src/helpers/fileHelper';

jest.mock('../../src/controllers/transactionsController');
jest.mock('../../src/helpers/fileHelper');

const app = express();
app.use(express.json());
app.use('/api', transactionRoutes);

describe('Transaction Routes', () => {
  it('should handle POST /upload', async () => {
    (upload.single as jest.Mock).mockImplementation((field: string) => (req: any, res: any, next: () => void) => next());
    (transactionController.processCsvFile as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('test'), 'test.csv')
      .expect(200);

    expect(transactionController.processCsvFile).toHaveBeenCalled();
  });

  it('should handle GET /transactions', async () => {
    (transactionController.getTransactions as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .get('/api/transactions')
      .expect(200);

    expect(transactionController.getTransactions).toHaveBeenCalled();
  });

  it('should handle GET /transactions/paginated', async () => {
    (transactionController.getPaginatedTransactions as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .get('/api/transactions/paginated')
      .expect(200);

    expect(transactionController.getPaginatedTransactions).toHaveBeenCalled();
  });

  it('should handle POST /transactions', async () => {
    (transactionController.addTransaction as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .post('/api/transactions')
      .send({ date: '2023-01-01', description: 'Test', amount: 100, currency: 'USD' })
      .expect(200);

    expect(transactionController.addTransaction).toHaveBeenCalled();
  });

  it('should handle PUT /transactions/:id', async () => {
    (transactionController.updateTransaction as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .put('/api/transactions/1')
      .send({ date: '2023-01-01', description: 'Updated', amount: 200, currency: 'USD' })
      .expect(200);

    expect(transactionController.updateTransaction).toHaveBeenCalled();
  });

  it('should handle DELETE /transactions/:id', async () => {
    (transactionController.deleteTransaction as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .delete('/api/transactions/1')
      .expect(200);

    expect(transactionController.deleteTransaction).toHaveBeenCalled();
  });

  it('should handle GET /download/processed_transactions.csv', async () => {
    (transactionController.downloadFile as jest.Mock).mockResolvedValue(undefined);

    await request(app)
      .get('/api/download/processed_transactions.csv')
      .expect(200);

    expect(transactionController.downloadFile).toHaveBeenCalled();
  });
});
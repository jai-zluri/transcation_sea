
import request from 'supertest';
import { app } from '../src/index';

describe('Transaction CRUD Operations', () => {
  it('should create a new transaction', async () => {
    // Ensure unique test data
    const response = await request(app)
      .post('/transactions/transactions')
      .send({
        date: '2025-01-15T12:00:00Z', // Unique date
        description: 'Unique Test Transaction', // Unique description
        amount: 150, // Unique amount
        currency: 'USD',
      });
  
    expect(response.status).toBe(201); // Ensure creation succeeded
    expect(response.body).toHaveProperty('id'); // Check if transaction ID is returned
    expect(response.body.description).toBe('Unique Test Transaction'); // Verify the description
  });

  it('should return an error for missing required fields', async () => {
    const response = await request(app)
      .post('/transactions/transactions')
      .send({
        description: 'Missing Date',
        amount: 150,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing required fields.');
  });

  it('should read all transactions', async () => {
    const response = await request(app)
      .get('/transactions/transactions');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update an existing transaction', async () => {
    // Step 1: Create a transaction to ensure it exists
    const createResponse = await request(app)
      .post('/transactions/transactions')
      .send({
        date: '2025-01-14T12:00:00Z', // Ensure the date format matches server expectations
        description: 'Transaction to Update',
        amount: 100,
        currency: 'USD', // Verify this is a supported currency on the backend
      });
  
    // Log the response body for debugging
    console.log('Create Response:', createResponse.body);
  
    // Step 2: Check if creation succeeded
    expect(createResponse.status).toBe(201);
    const transactionId = createResponse.body.id;
  
    // Step 3: Update the existing transaction
    const updateResponse = await request(app)
      .put(`/transactions/transactions/${transactionId}`)
      .send({
        date: '2025-01-14T14:00:00Z',
        description: 'Updated Transaction',
        amount: 200,
        currency: 'USD',
      });
  
    // Log the response body for debugging
    console.log('Update Response:', updateResponse.body);
  
    // Step 4: Assert the update response
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.description).toBe('Updated Transaction');
    expect(updateResponse.body.amount).toBe(200);
  });

  it('should delete a transaction', async () => {
    const createResponse = await request(app)
      .post('/transactions/transactions')
      .send({
        date: '2025-01-15T12:00:00Z',
        description: 'Transaction to Delete',
        amount: 100,
        currency: 'USD',
      });

    const transactionId = createResponse.body.id;

    const deleteResponse = await request(app)
      .delete(`/transactions/transactions/${transactionId}`)
      .send();

    expect(deleteResponse.status).toBe(204);
  });
});

describe('Transaction CRUD Operations - Additional Tests', () => {
  it('should handle duplicate transaction creation gracefully', async () => {
    const transactionData = {
      date: '2025-01-16T12:00:00Z',
      description: 'Duplicate Test Transaction',
      amount: 300,
      currency: 'USD',
    };

    // Create the first transaction
    const firstResponse = await request(app)
      .post('/transactions/transactions')
      .send(transactionData);

    expect(firstResponse.status).toBe(201);

    // Attempt to create a duplicate transaction
    const secondResponse = await request(app)
      .post('/transactions/transactions')
      .send(transactionData);

    expect(secondResponse.status).toBe(400);
    expect(secondResponse.body.error).toBe('Duplicate transaction found.');
  });

  it('should fetch paginated transactions', async () => {
    const response = await request(app)
      .get('/transactions/transactions/paginated')
      .query({ page: 1, limit: 5 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('transactions');
    expect(response.body).toHaveProperty('totalCount');
    expect(Array.isArray(response.body.transactions)).toBe(true);
  });

  it('should return an error for invalid transaction ID during update', async () => {
    const response = await request(app)
      .put('/transactions/transactions/invalid-id')
      .send({
        date: '2025-01-17T12:00:00Z',
        description: 'Invalid ID Update',
        amount: 400,
        currency: 'USD',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid transaction ID');
  });

  it('should return 404 for updating a non-existent transaction', async () => {
    const response = await request(app)
      .put('/transactions/transactions/999999')
      .send({
        date: '2025-01-18T12:00:00Z',
        description: 'Non-existent Update',
        amount: 500,
        currency: 'USD',
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Transaction not found');
  });

  it('should return an error for invalid transaction ID during deletion', async () => {
    const response = await request(app)
      .delete('/transactions/transactions/invalid-id')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid transaction ID');
  });

  it('should return 404 for deleting a non-existent transaction', async () => {
    const response = await request(app)
      .delete('/transactions/transactions/999999')
      .send();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Transaction not found');
  });

  it('should handle CSV file upload with valid transactions', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', '__tests__/testFiles/validTransactions.csv');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File processed and transactions saved successfully!');
    expect(response.body.inserted).toBeGreaterThan(0);
  });

  it('should return error for CSV file with malformed data', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', '__tests__/testFiles/malformedTransactions.csv');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CSV contains malformed rows. Please fix and retry.');
  });

  it('should return error for uploading non-CSV files', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', '__tests__/testFiles/sample.txt');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Only CSV files are allowed!');
  });

  it('should handle empty CSV file uploads gracefully', async () => {
    const response = await request(app)
      .post('/transactions/upload')
      .attach('file', '__tests__/testFiles/empty.csv');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('CSV file is empty or contains invalid data!');
  });
});

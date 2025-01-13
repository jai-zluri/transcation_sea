

import request from 'supertest';
// import './jest.setup.js';

import {app} from '../src/index'; // Adjust the path as necessary

describe('Transaction CRUD Operations', () => {
  
  it('should create a new transaction', async () => {
    const response = await request(app)
      .post('/transactions/transactions')
      .send({
        date: '2025-01-13T12:00:00Z',
        description: 'Test Transaction',
        amount: 150,
        currency: 'USD',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.description).toBe('Test Transaction');
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
    expect(Array.isArray(response.body)).toBe(true); // Check that the response is an array
  });

  it('should update an existing transaction', async () => {
    // First create a transaction to update
    const createResponse = await request(app)
      .post('/transactions/transactions')
      .send({
        date: '2025-01-14T12:00:00Z',
        description: 'Transaction to Update',
        amount: 100,
        currency: 'USD',
      });

    const transactionId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/transactions/transactions/${transactionId}`)
      .send({
        date: '2025-01-14T14:00:00Z',
        description: 'Updated Transaction',
        amount: 200,
        currency: 'USD',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.description).toBe('Updated Transaction');
  });

  it('should delete a transaction', async () => {
    // First create a transaction to delete
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

    expect(deleteResponse.status).toBe(204); // No content response
  });
});




import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { AddTransactionModal } from '../src/components/AddTransactionModal';

import { Transaction } from '../src/types/index';

const mockCurrencyUtils = {
  currencies: [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
  ],
};




describe('AddTransactionModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn().mockResolvedValue(undefined);
    const existingTransactions: Transaction[] = [];
  
    beforeAll(() => {
      jest.mock('../src/utils/currency', () => ({
        currencyUtils: mockCurrencyUtils,
      }));
  
      jest.mock('../src/utils/validation', () => ({
        validation: {
          isValidDate: jest.fn().mockReturnValue(true),
          isValidAmount: jest.fn().mockReturnValue(true),
          isValidDescription: jest.fn().mockReturnValue(true),
          isDuplicateTransaction: jest.fn().mockReturnValue(false),
        },
      }));
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('renders modal correctly', () => {
      render(
        <AddTransactionModal 
          onClose={mockOnClose} 
          onSave={mockOnSave} 
          existingTransactions={existingTransactions} 
        />
      );
  
      expect(screen.getByText('Add Transaction')).toBeInTheDocument();
      expect(screen.getByLabelText('Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    });
  
  test('renders modal correctly', () => {
    render(
      <AddTransactionModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        existingTransactions={existingTransactions} 
      />
    );

    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Currency')).toBeInTheDocument();
  });

  test('submits transaction successfully', async () => {
    render(
      <AddTransactionModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        existingTransactions={existingTransactions} 
      />
    );

    fireEvent.change(screen.getByLabelText('Description'), { 
      target: { value: 'Test Transaction' } 
    });
    fireEvent.change(screen.getByLabelText('Amount'), { 
      target: { value: '100.50' } 
    });

    fireEvent.submit(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Transaction',
        amount: 100.50,
      }));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles validation errors', async () => {
    const mockValidation = require('../utils/validation').validation;
    mockValidation.isValidDate.mockReturnValue(false);
    mockValidation.isValidDescription.mockReturnValue(false);
    mockValidation.isValidAmount.mockReturnValue(false);

    render(
      <AddTransactionModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        existingTransactions={existingTransactions} 
      />
    );

    fireEvent.submit(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('Date must be between 1980 and 2030')).toBeInTheDocument();
      expect(screen.getByText('Description must contain alphabets')).toBeInTheDocument();
      expect(screen.getByText('Amount must be greater than 0 and have up to 2 decimal places')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  test('handles save error', async () => {
    const mockOnSaveError = jest.fn().mockRejectedValue(new Error('Save failed'));

    render(
      <AddTransactionModal 
        onClose={mockOnClose} 
        onSave={mockOnSaveError} 
        existingTransactions={existingTransactions} 
      />
    );

    fireEvent.change(screen.getByLabelText('Description'), { 
      target: { value: 'Test Transaction' } 
    });
    fireEvent.change(screen.getByLabelText('Amount'), { 
      target: { value: '100.50' } 
    });

    fireEvent.submit(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to save transaction. Please try again.')).toBeInTheDocument();
    });
  });

  test('closes modal when cancel button is clicked', () => {
    render(
      <AddTransactionModal 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
        existingTransactions={existingTransactions} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
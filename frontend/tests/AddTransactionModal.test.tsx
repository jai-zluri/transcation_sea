import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { AddTransactionModal } from '../src/components/AddTransactionModal';

import { Transaction } from '../src/types/index';


import '@testing-library/jest-dom/extend-expect';


import { validation } from '../src/utils/validation';
import { currencyUtils } from '../src/utils/currency';

jest.mock('../src/utils/validation');
jest.mock('../src/utils/currency');

const mockCurrencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
];

const mockTransaction: Transaction = {
  id: 1,
  date: '2025-01-01T00:00:00Z',
  description: 'Test Transaction',
  amount: 100,
  currency: 'USD',
};

beforeEach(() => {
  (currencyUtils.currencies as unknown as jest.Mock).mockReturnValue(mockCurrencies);
  jest.clearAllMocks();
});

const renderComponent = (props = {}) =>
  render(
    <AddTransactionModal
      onClose={jest.fn()}
      onSave={jest.fn()}
      existingTransactions={[mockTransaction]}
      {...props}
    />
  );

describe('AddTransactionModal', () => {
  test('renders correctly with initial data', () => {
    renderComponent();

    expect(screen.getByLabelText(/date/i)).toHaveValue(new Date().toISOString().split('T')[0]);
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/amount/i)).toHaveValue('0');
    expect(screen.getByLabelText(/currency/i)).toHaveValue('USD');
  });

  test('calls onClose when cancel button is clicked', () => {
    const onCloseMock = jest.fn();
    renderComponent({ onClose: onCloseMock });

    fireEvent.click(screen.getByText(/cancel/i));

    expect(onCloseMock).toHaveBeenCalled();
  });

  test('displays validation errors for invalid date', async () => {
    (validation.isValidDate as jest.Mock).mockReturnValue(false);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/date must be between 1980 and 2030/i)).toBeInTheDocument();
    });
  });

  test('displays validation errors for invalid amount', async () => {
    (validation.isValidAmount as jest.Mock).mockReturnValue(false);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '-100' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/amount must be greater than 0 and have up to 2 decimal places/i)).toBeInTheDocument();
    });
  });

  test('displays validation errors for invalid description', async () => {
    (validation.isValidDescription as jest.Mock).mockReturnValue(false);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/description must contain alphabets/i)).toBeInTheDocument();
    });
  });

  test('displays validation errors for duplicate transaction', async () => {
    (validation.isDuplicateTransaction as jest.Mock).mockReturnValue(true);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/this appears to be a duplicate transaction/i)).toBeInTheDocument();
    });
  });

  test('calls onSave with valid transaction data on form submission', async () => {
    const onSaveMock = jest.fn().mockResolvedValue({});

    (validation.isValidDate as jest.Mock).mockReturnValue(true);
    (validation.isValidAmount as jest.Mock).mockReturnValue(true);
    (validation.isValidDescription as jest.Mock).mockReturnValue(true);
    (validation.isDuplicateTransaction as jest.Mock).mockReturnValue(false);

    renderComponent({ onSave: onSaveMock });

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-02' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'EUR' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        date: '2025-01-02',
        description: 'New Transaction',
        amount: 200,
        currency: 'EUR',
      });
    });
  });

  test('handles field changes correctly', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });
    expect(screen.getByLabelText(/description/i)).toHaveValue('New Description');

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '150' } });
    expect(screen.getByLabelText(/amount/i)).toHaveValue('150');

    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'EUR' } });
    expect(screen.getByLabelText(/currency/i)).toHaveValue('EUR');
  });

  test('displays error message on save failure', async () => {
    const onSaveMock = jest.fn().mockRejectedValue(new Error('Failed to save transaction. Please try again.'));

    (validation.isValidDate as jest.Mock).mockReturnValue(true);
    (validation.isValidAmount as jest.Mock).mockReturnValue(true);
    (validation.isValidDescription as jest.Mock).mockReturnValue(true);
    (validation.isDuplicateTransaction as jest.Mock).mockReturnValue(false);

    renderComponent({ onSave: onSaveMock });

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-02' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'EUR' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/failed to save transaction. please try again./i)).toBeInTheDocument();
    });
  });
});
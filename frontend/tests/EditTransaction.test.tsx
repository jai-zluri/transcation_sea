import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EditTransactionModal } from '../src/components/EditTransactionModal';
import { Transaction } from '../src/types/index';
import { validation } from '../src/utils/validation';
import { currencyUtils } from '../src/utils/currency';

jest.mock('../src/utils/validation');
jest.mock('../src/utils/currency');


const mockTransaction: Transaction = {
  id: 1,
  date: '2025-01-01T00:00:00Z',
  description: 'Test Transaction',
  amount: 100,
  currency: 'USD',
};

const mockCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

beforeEach(() => {
  (currencyUtils.currencies as unknown as jest.Mock).mockReturnValue(mockCurrencies);
  jest.clearAllMocks();
});

const renderComponent = (props = {}) =>
  render(
    <EditTransactionModal
      transaction={mockTransaction}
      onClose={jest.fn()}
      onSave={jest.fn()}
      {...props}
    />
  );

describe('EditTransactionModal', () => {
  test('renders correctly with initial data', () => {
    renderComponent();

    expect(screen.getByLabelText(/date/i)).toHaveValue('2025-01-01');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test Transaction');
    expect(screen.getByLabelText(/amount/i)).toHaveValue('100');
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
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
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
      expect(screen.getByText(/description must contain characters/i)).toBeInTheDocument();
    });
  });

  test('calls onSave with updated transaction data on valid form submission', async () => {
    const onSaveMock = jest.fn();

    (validation.isValidDate as jest.Mock).mockReturnValue(true);
    (validation.isValidAmount as jest.Mock).mockReturnValue(true);
    (validation.isValidDescription as jest.Mock).mockReturnValue(true);

    renderComponent({ onSave: onSaveMock });

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-02' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Updated Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'EUR' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith({
        id: 1,
        date: '2025-01-02T00:00:00.000Z',
        description: 'Updated Transaction',
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

  test('renders validation errors correctly', async () => {
    (validation.isValidDate as jest.Mock).mockReturnValue(false);
    (validation.isValidAmount as jest.Mock).mockReturnValue(false);
    (validation.isValidDescription as jest.Mock).mockReturnValue(false);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '-100' } });

    fireEvent.submit(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/date must be between 1980 and 2030/i)).toBeInTheDocument();
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
      expect(screen.getByText(/description must contain characters/i)).toBeInTheDocument();
    });
  });
});
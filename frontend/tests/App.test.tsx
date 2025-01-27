




import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../src/App';
import { transactionService } from '../src/services/api';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { csvHandler } from '../src/utils/csvHandler';
import { act } from 'react-dom/test-utils';



jest.mock('../src/services/api');
jest.mock('../src/context/AuthContext');
jest.mock('../src/utils/csvHandler');

const mockTransactions = [
  { id: 1, date: '2025-01-01', description: 'Test Transaction 1', amount: 100, currency: 'USD' },
  { id: 2, date: '2025-01-02', description: 'Test Transaction 2', amount: 200, currency: 'USD' },
];

const mockUser = {
  photoURL: 'https://example.com/photo.jpg',
  displayName: 'Test User',
  email: 'test@example.com',
};

const mockAuthContext = {
  user: mockUser,
  logout: jest.fn(),
};

const mockCsvHandler = {
  parseCSV: jest.fn(),
};

beforeEach(() => {
  (useAuth as jest.Mock).mockReturnValue(mockAuthContext);
  (transactionService.getAllTransactions as jest.Mock).mockResolvedValue(mockTransactions);
  (transactionService.deleteTransaction as jest.Mock).mockResolvedValue({});
  (transactionService.updateTransaction as jest.Mock).mockResolvedValue({});
  (transactionService.addTransaction as jest.Mock).mockResolvedValue({});
  (csvHandler.parseCSV as jest.Mock).mockReturnValue({ validTransactions: mockTransactions, errors: [] });
  jest.clearAllMocks();
});

describe('App', () => {
  test('renders login page if no user', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    render(<AuthProvider><App /></AuthProvider>);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  test('renders transactions and allows adding transaction', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText(/Test Transaction 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Transaction 2/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/add transaction/i));
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Transaction' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: 'USD' } });
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(transactionService.addTransaction).toHaveBeenCalled();
    });
  });

  test('handles file upload and parses CSV', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    const file = new File(['Date,Description,Amount\n2025-01-01,Test,100\n'], 'transactions.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload csv/i);
    Object.defineProperty(input, 'files', { value: [file] });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
    });

    expect(csvHandler.parseCSV).toHaveBeenCalledWith('Date,Description,Amount\n2025-01-01,Test,100\n');
  });

  test('handles CSV upload errors', async () => {
    (csvHandler.parseCSV as jest.Mock).mockReturnValue({ validTransactions: [], errors: ['Invalid data'] });

    render(<AuthProvider><App /></AuthProvider>);

    const file = new File(['Date,Description,Amount\n'], 'transactions.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload csv/i);
    Object.defineProperty(input, 'files', { value: [file] });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  test('handles empty CSV file upload', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    const file = new File([''], 'transactions.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/upload csv/i);
    Object.defineProperty(input, 'files', { value: [file] });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  test('handles non-CSV file upload', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    const file = new File(['some content'], 'transactions.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload csv/i);
    Object.defineProperty(input, 'files', { value: [file] });

    fireEvent.change(input);

    expect(window.alert).toHaveBeenCalledWith('Please upload a CSV file');
  });

  test('handles restore toggle', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    fireEvent.click(screen.getByText(/restore/i));

    await waitFor(() => {
      expect(screen.getByText(/restore all/i)).toBeInTheDocument();
    });
  });

  test('handles transactions view', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    fireEvent.click(screen.getByText(/transactions valley/i));

    await waitFor(() => {
      expect(screen.getByText(/add transaction/i)).toBeInTheDocument();
    });
  });

  test('allows deleting and restoring transactions', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText(/Test Transaction 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Transaction 2/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/delete/i, { selector: 'button' }));

    await waitFor(() => {
      expect(screen.queryByText(/Test Transaction 1/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/restore/i));
    fireEvent.click(screen.getByText(/restore all/i));

    await waitFor(() => {
      expect(screen.getByText(/Test Transaction 1/i)).toBeInTheDocument();
    });
  });

  test('signs out user', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    fireEvent.click(screen.getByText(/sign out/i));

    await waitFor(() => {
      expect(mockAuthContext.logout).toHaveBeenCalled();
    });
  });

  test('handles bulk delete and undo transaction', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    await waitFor(() => {
      expect(screen.getByText(/Test Transaction 1/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(/select/i));
    fireEvent.click(screen.getByText(/bulk delete/i));

    await waitFor(() => {
      expect(screen.queryByText(/Test Transaction 1/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/undo/i, { selector: 'button' }));

    await waitFor(() => {
      expect(screen.getByText(/Test Transaction 1/i)).toBeInTheDocument();
    });
  });

  test('handles page size change', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    const pageSizeSelect = screen.getByLabelText(/page size/i);
    fireEvent.change(pageSizeSelect, { target: { value: '50' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });
  });

  test('handles restoring a single transaction', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    fireEvent.click(screen.getByText(/delete/i, { selector: 'button' }));

    await waitFor(() => {
      expect(screen.queryByText(/Test Transaction 1/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/restore/i, { selector: 'button' }));

    await waitFor(() => {
      expect(screen.getByText(/Test Transaction 1/i)).toBeInTheDocument();
    });
  });

  test('handles error on transaction update', async () => {
    (transactionService.updateTransaction as jest.Mock).mockRejectedValue(new Error('Update error'));

    render(<AuthProvider><App /></AuthProvider>);

    fireEvent.click(screen.getByText(/edit/i, { selector: 'button' }));
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Updated Transaction' } });
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/failed to update transaction/i)).toBeInTheDocument();
    });
  });

  test('handles adding empty transaction', async () => {
    render(<AuthProvider><App /></AuthProvider>);

    fireEvent.click(screen.getByText(/add transaction/i));
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/missing required fields/i)).toBeInTheDocument();
    });
  });
});
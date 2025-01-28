
// import React from 'react';
// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// import { EditTransactionModal } from '../src/components/EditTransactionModal'

// const mockCurrencyUtils = {
//   currencies: [
//     { code: 'USD', symbol: '$' },
//     { code: 'EUR', symbol: '€' },
//   ],
// };

// jest.mock('../utils/currency', () => ({
//   currencyUtils: mockCurrencyUtils,
// }));

// jest.mock('../utils/validation', () => ({
//   validation: {
//     isValidDate: jest.fn().mockReturnValue(true),
//     isValidAmount: jest.fn().mockReturnValue(true),
//     isValidDescription: jest.fn().mockReturnValue(true),
//   },
// }));

// describe('EditTransactionModal', () => {
//   const mockTransaction = {
//     id: 1,
//     date: '2023-05-15T10:00:00Z',
//     description: 'Original Description',
//     amount: 100,
//     currency: 'USD',
//   };

//   const mockOnClose = jest.fn();
//   const mockOnSave = jest.fn();

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders modal with existing transaction data', () => {
//     render(
//       <EditTransactionModal 
//         transaction={mockTransaction} 
//         onClose={mockOnClose} 
//         onSave={mockOnSave} 
//       />
//     );

//     expect(screen.getByText('Edit Transaction')).toBeInTheDocument();
//     expect(screen.getByDisplayValue('Original Description')).toBeInTheDocument();
//     expect(screen.getByDisplayValue('100')).toBeInTheDocument();
//   });

//   test('updates transaction details', async () => {
//     render(
//       <EditTransactionModal 
//         transaction={mockTransaction} 
//         onClose={mockOnClose} 
//         onSave={mockOnSave} 
//       />
//     );

//     // Change description
//     const descriptionInput = screen.getByLabelText('Description');
//     fireEvent.change(descriptionInput, { 
//       target: { value: 'Updated Description' } 
//     });

//     // Change amount
//     const amountInput = screen.getByLabelText('Amount');
//     fireEvent.change(amountInput, { 
//       target: { value: '200.50' } 
//     });

//     // Submit form
//     fireEvent.submit(screen.getByRole('button', { name: /save/i }));

//     await waitFor(() => {
//       expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
//         description: 'Updated Description',
//         amount: 200.50,
//       }));
//     });
//   });

//   test('handles validation errors', async () => {
//     const mockValidation = require('../utils/validation').validation;
//     mockValidation.isValidDate.mockReturnValue(false);
//     mockValidation.isValidDescription.mockReturnValue(false);
//     mockValidation.isValidAmount.mockReturnValue(false);

//     render(
//       <EditTransactionModal 
//         transaction={mockTransaction} 
//         onClose={mockOnClose} 
//         onSave={mockOnSave} 
//       />
//     );

//     fireEvent.submit(screen.getByRole('button', { name: /save/i }));

//     await waitFor(() => {
//       expect(screen.getByText('Date must be between 1980 and 2030')).toBeInTheDocument();
//       expect(screen.getByText('Description must contain alphabets')).toBeInTheDocument();
//       expect(screen.getByText('Amount must be greater than 0 and have up to 2 decimal places')).toBeInTheDocument();
//       expect(mockOnSave).not.toHaveBeenCalled();
//     });
//   });

//   test('closes modal when cancel button is clicked', () => {
//     render(
//       <EditTransactionModal 
//         transaction={mockTransaction} 
//         onClose={mockOnClose} 
//         onSave={mockOnSave} 
//       />
//     );

//     fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

//     expect(mockOnClose).toHaveBeenCalled();
//   });

//   test('handles currency selection', () => {
//     render(
//       <EditTransactionModal 
//         transaction={mockTransaction} 
//         onClose={mockOnClose} 
//         onSave={mockOnSave} 
//       />
//     );

//     const currencySelect = screen.getByLabelText('Currency');
//     fireEvent.change(currencySelect, { target: { value: 'EUR' } });

//     fireEvent.submit(screen.getByRole('button', { name: /save/i }));

//     expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
//       currency: 'EUR',
//     }));
//   });
// });
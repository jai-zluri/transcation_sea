// import { csvHandler } from '../src/utils/csvHandler';
// import { validation } from '../src/utils/validation'
// import { currencyUtils } from '../src/utils/currency' ;

// jest.mock('./validation', () => ({
//   validation: {
//     validateTransaction: jest.fn(),
//   },
// }));

// jest.mock('./currency', () => ({
//   currencyUtils: {
//     convertToINR: jest.fn(),
//   },
// }));

// describe('csvHandler', () => {
//   const mockValidTransaction = {
//     date: '2023-05-15',
//     description: 'Test Transaction',
//     amount: 100,
//     currency: 'USD'
//   };

//   beforeEach(() => {
//     (validation.validateTransaction as jest.Mock).mockReturnValue({ 
//       isValid: true, 
//       errors: [] 
//     });
//     (currencyUtils.convertToINR as jest.Mock).mockReturnValue(8350);
//   });

//   test('parseCSV handles valid transactions', () => {
//     const csvContent = `date,description,amount,currency
// 2023-05-15,Test Transaction,100,USD`;

//     const result = csvHandler.parseCSV(csvContent);

//     expect(result.validTransactions).toHaveLength(1);
//     expect(result.duplicates).toHaveLength(0);
//     expect(result.errors).toHaveLength(0);
//   });

//   test('parseCSV handles duplicate transactions', () => {
//     const csvContent = `date,description,amount,currency
// 2023-05-15,Test Transaction,100,USD
// 2023-05-15,Test Transaction,100,USD`;

//     const result = csvHandler.parseCSV(csvContent);

//     expect(result.validTransactions).toHaveLength(1);
//     expect(result.duplicates).toHaveLength(1);
//   });

//   test('parseCSV handles invalid transactions', () => {
//     (validation.validateTransaction as jest.Mock).mockReturnValue({ 
//       isValid: false, 
//       errors: ['Invalid transaction'] 
//     });

//     const csvContent = `date,description,amount,currency
// 2023-05-15,Test Transaction,100,USD`;

//     const result = csvHandler.parseCSV(csvContent);

//     expect(result.validTransactions).toHaveLength(0);
//     expect(result.errors).toHaveLength(1);
//   });

//   test('generateCSV creates correct CSV string', () => {
//     const transactions = [{
//       id: 1,
//       date: '2023-05-15',
//       description: 'Test Transaction',
//       amount: 100,
//       currency: 'USD',
//       amountInINR: 8350
//     }];

//     const csvContent = csvHandler.generateCSV(transactions);

//     expect(csvContent).toContain('Date,Description,Amount,Currency,Amount (INR)');
//     expect(csvContent).toContain('2023-05-15,Test Transaction,100,USD,8350');
//   });

//   test('downloadCSV creates blob and triggers download', () => {
//     const mockCreateObjectURL = jest.fn().mockReturnValue('mockUrl');
//     const mockRevokeObjectURL = jest.fn();
//     const mockClick = jest.fn();

//     window.URL.createObjectURL = mockCreateObjectURL;
//     window.URL.revokeObjectURL = mockRevokeObjectURL;

//     const csvContent = 'test,csv,content';
//     const mockLink = {
//       href: '',
//       download: '',
//       click: mockClick
//     } as unknown as HTMLAnchorElement;

//     jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
//     jest.spyOn(document.body, 'appendChild');
//     jest.spyOn(document.body, 'removeChild');

//     csvHandler.downloadCSV(csvContent, 'test.csv');

//     expect(mockCreateObjectURL).toHaveBeenCalled();
//     expect(mockLink.href).toBe('mockUrl');
//     expect(mockLink.download).toBe('test.csv');
//     expect(mockClick).toHaveBeenCalled();
//   });
// });
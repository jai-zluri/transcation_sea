// import { generateTransactionsPDF } from '../src/utils/pdfGenerator';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

// // Mock jsPDF and its methods
// jest.mock('jspdf', () => {
//     return {
//       jsPDF: jest.fn().mockImplementation(() => ({
//         setFontSize: jest.fn(),
//         text: jest.fn(),
//         autoTable: jest.fn(),
//         save: jest.fn(),
//         addPage: jest.fn(),
//         internal: {
//           pageSize: {
//             height: 500,
//           },
//         },
//       })),
//     };
//   });
// describe('generateTransactionsPDF', () => {
//   const mockTransactions = [
//     {
//       id: 1,
//       date: '2023-05-15T00:00:00Z',
//       description: 'Test Transaction 1',
//       amount: 100,
//       currency: 'USD'
//     },
//     {
//       id: 2,
//       date: '2023-05-16T00:00:00Z',
//       description: 'Test Transaction 2',
//       amount: 200,
//       currency: 'EUR'
//     }
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('generates PDF with correct details', () => {
//     generateTransactionsPDF(mockTransactions);

//     const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
//     const mockInstance = mockJsPDF.mock.instances[0];

//     expect(mockInstance.setFontSize).toHaveBeenCalledWith(expect.any(Number));
//     expect(mockInstance.text).toHaveBeenCalledWith(
//       expect.stringContaining('Transactions Report'), 
//       expect.any(Number), 
//       expect.any(Number)
//     );
//     expect(mockInstance.save).toHaveBeenCalledWith('transactions-report.pdf');
//   });

//   test('calculates total amount correctly', () => {
//     generateTransactionsPDF(mockTransactions);

//     const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
//     const mockInstance = mockJsPDF.mock.instances[0];

//     expect(mockInstance.text).toHaveBeenCalledWith(
//       expect.stringContaining('Total Amount (INR)'), 
//       expect.any(Number), 
//       expect.any(Number)
//     );
//   });
// });



// import { generateTransactionsPDF } from '../src/utils/pdfGenerator';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';

// // Mock jsPDF and its methods
// jest.mock('jspdf', () => {
//   return {
//     jsPDF: jest.fn().mockImplementation(() => ({
//       setFontSize: jest.fn(),
//       text: jest.fn(),
//       autoTable: jest.fn(),
//       save: jest.fn(),
//       addPage: jest.fn(),
//       internal: {
//         pageSize: {
//           height: 500,
//         },
//       },
//     })),
//   };
// });

// describe('generateTransactionsPDF', () => {
//   const mockTransactions = [
//     {
//       id: 1,
//       date: '2023-05-15T00:00:00Z',
//       description: 'Test Transaction 1',
//       amount: 100,
//       currency: 'USD',
//     },
//     {
//       id: 2,
//       date: '2023-05-16T00:00:00Z',
//       description: 'Test Transaction 2',
//       amount: 200,
//       currency: 'EUR',
//     },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should create a PDF with correct details', () => {
//     generateTransactionsPDF(mockTransactions);

//     const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
//     const mockInstance = mockJsPDF.mock.instances[0];

//     expect(mockInstance.setFontSize).toHaveBeenCalledTimes(4);
//     expect(mockInstance.text).toHaveBeenCalledWith(
//       expect.stringContaining('Transactions Report'),
//       14,
//       15
//     );
//     expect(mockInstance.autoTable).toHaveBeenCalledWith(
//       expect.objectContaining({
//         startY: expect.any(Number),
//         body: expect.any(Array),
//         columns: expect.any(Array),
//       })
//     );
//     expect(mockInstance.save).toHaveBeenCalledWith('transactions-report.pdf');
//   });

//   test('should add totals summary at the bottom of the last page', () => {
//     generateTransactionsPDF(mockTransactions);

//     const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
//     const mockInstance = mockJsPDF.mock.instances[0];

//     expect(mockInstance.text).toHaveBeenCalledWith(
//       expect.stringContaining('Total Transactions: 2'),
//       expect.any(Number),
//       expect.any(Number)
//     );
//     expect(mockInstance.text).toHaveBeenCalledWith(
//       expect.stringContaining('Total Amount (INR):'),
//       expect.any(Number),
//       expect.any(Number)
//     );
//   });

//   test('should handle an empty transaction list', () => {
//     generateTransactionsPDF([]);

//     const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
//     const mockInstance = mockJsPDF.mock.instances[0];

//     expect(mockInstance.autoTable).toHaveBeenCalledWith(
//       expect.objectContaining({
//         body: [],
//       })
//     );
//     expect(mockInstance.text).toHaveBeenCalledWith(
//       'Total Transactions: 0',
//       expect.any(Number),
//       expect.any(Number)
//     );
//     expect(mockInstance.text).toHaveBeenCalledWith(
//       'Total Amount (INR): 0.00',
//       expect.any(Number),
//       expect.any(Number)
//     );
//   });

//   test('should add a new page if content overflows', () => {
//     const largeTransactions = Array(100).fill(mockTransactions[0]);
//     generateTransactionsPDF(largeTransactions);

//     const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
//     const mockInstance = mockJsPDF.mock.instances[0];

//     expect(mockInstance.addPage).toHaveBeenCalled();
//   });
// });



import { generateTransactionsPDF } from '../src/utils/pdfGenerator';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure this import is included

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFontSize: jest.fn(),
      text: jest.fn(),
      autoTable: jest.fn(),
      save: jest.fn(),
      addPage: jest.fn(),
      internal: {
        pageSize: {
          height: 500,
        },
      },
    })),
  };
});

describe('generateTransactionsPDF', () => {
  const mockTransactions = [
    {
      id: 1,
      date: '2023-05-15T00:00:00Z',
      description: 'Test Transaction 1',
      amount: 100,
      currency: 'USD',
    },
    {
      id: 2,
      date: '2023-05-16T00:00:00Z',
      description: 'Test Transaction 2',
      amount: 200,
      currency: 'EUR',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generates PDF with correct details for non-empty transactions', () => {
    generateTransactionsPDF(mockTransactions);

    const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
    const mockInstance = mockJsPDF.mock.instances[0];

    expect(mockInstance.setFontSize).toHaveBeenCalledWith(16);
    expect(mockInstance.text).toHaveBeenCalledWith('Transactions Report', 14, 15);
    expect(mockInstance.autoTable).toHaveBeenCalled();
    expect(mockInstance.save).toHaveBeenCalledWith('transactions-report.pdf');
  });

  test('handles empty transactions gracefully', () => {
    generateTransactionsPDF([]);

    const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
    const mockInstance = mockJsPDF.mock.instances[0];

    expect(mockInstance.autoTable).toHaveBeenCalledWith(
      expect.objectContaining({
        body: [],
      })
    );
    expect(mockInstance.text).toHaveBeenCalledWith(
      'Total Transactions: 0',
      14,
      expect.any(Number)
    );
    expect(mockInstance.text).toHaveBeenCalledWith(
      'Total Amount (INR): 0.00',
      14,
      expect.any(Number)
    );
  });

  test('adds a new page when table overflows', () => {
    // Mock `autoTable` to simulate table overflow
    const mockAutoTable = jest.fn((options) => {
      if (options.didDrawPage) {
        options.didDrawPage({ cursor: { y: 600 } }); // Simulate cursor overflow
      }
    });
    const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
    mockJsPDF.mock.instances[0].autoTable = mockAutoTable;

    generateTransactionsPDF(mockTransactions);

    expect(mockJsPDF.mock.instances[0].addPage).toHaveBeenCalled();
    expect(mockJsPDF.mock.instances[0].text).toHaveBeenCalledWith(
      'Transactions Report',
      14,
      15
    );
  });

  test('calculates total amount in INR correctly', () => {
    generateTransactionsPDF(mockTransactions);

    const totalINR = mockTransactions.reduce((sum, t) => sum + t.amount * 75, 0); // Assuming a fixed conversion rate
    const mockJsPDF = jsPDF as jest.MockedClass<typeof jsPDF>;
    const mockInstance = mockJsPDF.mock.instances[0];

    expect(mockInstance.text).toHaveBeenCalledWith(
      `Total Amount (INR): ${totalINR.toFixed(2)}`,
      14,
      expect.any(Number)
    );
  });
});

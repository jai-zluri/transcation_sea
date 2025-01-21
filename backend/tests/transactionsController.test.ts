// import {
//   processCsvFile,
//   getTransactions,
//   getPaginatedTransactions,
//   addTransaction,
//   updateTransaction,
//   deleteTransaction,
// } from "../src/controllers/transactionsController";

// import { parseCSV } from "../src/utils/csvParserUtils";
// import {
//   addTransactionService,
//   deleteTransactionService,
//   getPaginatedTransactionsService,
//   getTransactionsService,
//   updateTransactionService,
// } from "../src/services/transactionService";

// jest.mock("../src/utils/csvParserUtils", () => ({
//   processCsvFileHandler: jest.fn(),
// }));

// jest.mock("../src/services/transactionService", () => ({
//   addTransactionService: jest.fn(),
//   deleteTransactionService: jest.fn(),
//   getPaginatedTransactionsService: jest.fn(),
//   getTransactionsService: jest.fn(),
//   updateTransactionService: jest.fn(),
// }));

// describe("Transaction Controller", () => {
//   const mockRequest: any = { body: {}, query: {}, params: {} };
//   const mockResponse: any = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   // Test for processCsvFile
//   describe("processCsvFile", () => {
//     it("should call processCsvFileHandler and return success", async () => {
//       (parseCSV as jest.Mock).mockResolvedValueOnce(undefined);

//       await processCsvFile(mockRequest, mockResponse);

//       expect(parseCSV).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during CSV processing", async () => {
//       const error = new Error("CSV Error");
//       (parseCSV as jest.Mock).mockRejectedValueOnce(error);

//       await processCsvFile(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error processing CSV file",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors during CSV processing", async () => {
//       (parseCSV as jest.Mock).mockRejectedValueOnce("Unknown Error");

//       await processCsvFile(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while processing CSV file",
//       });
//     });
//   });

//   // Test for getTransactions
//   describe("getTransactions", () => {
//     it("should call getTransactionsService and return success", async () => {
//       await getTransactions(mockRequest, mockResponse);

//       expect(getTransactionsService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during fetching transactions", async () => {
//       const error = new Error("Transaction Error");
//       (getTransactionsService as jest.Mock).mockRejectedValueOnce(error);

//       await getTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error fetching transactions",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (getTransactionsService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await getTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while fetching transactions",
//       });
//     });
//   });

//   // Test for getPaginatedTransactions
//   describe("getPaginatedTransactions", () => {
//     it("should call getPaginatedTransactionsService and return success", async () => {
//       await getPaginatedTransactions(mockRequest, mockResponse);

//       expect(getPaginatedTransactionsService).toHaveBeenCalledWith(
//         mockRequest,
//         mockResponse
//       );
//     });

//     it("should handle errors during fetching paginated transactions", async () => {
//       const error = new Error("Pagination Error");
//       (getPaginatedTransactionsService as jest.Mock).mockRejectedValueOnce(error);

//       await getPaginatedTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error fetching paginated transactions",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (getPaginatedTransactionsService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await getPaginatedTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while fetching paginated transactions",
//       });
//     });
//   });

//   // Test for addTransaction
//   describe("addTransaction", () => {
//     it("should call addTransactionService and return success", async () => {
//       await addTransaction(mockRequest, mockResponse);

//       expect(addTransactionService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during adding transaction", async () => {
//       const error = new Error("Add Transaction Error");
//       (addTransactionService as jest.Mock).mockRejectedValueOnce(error);

//       await addTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error adding transaction",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (addTransactionService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await addTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while adding transaction",
//       });
//     });
//   });

//   // Test for updateTransaction
//   describe("updateTransaction", () => {
//     it("should call updateTransactionService and return success", async () => {
//       await updateTransaction(mockRequest, mockResponse);

//       expect(updateTransactionService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during updating transaction", async () => {
//       const error = new Error("Update Transaction Error");
//       (updateTransactionService as jest.Mock).mockRejectedValueOnce(error);

//       await updateTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error updating transaction",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (updateTransactionService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await updateTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while updating transaction",
//       });
//     });
//   });

//   // Test for deleteTransaction
//   describe("deleteTransaction", () => {
//     it("should call deleteTransactionService and return success", async () => {
//       await deleteTransaction(mockRequest, mockResponse);

//       expect(deleteTransactionService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during deleting transaction", async () => {
//       const error = new Error("Delete Transaction Error");
//       (deleteTransactionService as jest.Mock).mockRejectedValueOnce(error);

//       await deleteTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error deleting transaction",
//         details: error.message,
//       });
//     });
 
  
//     it("should handle unknown errors", async () => {
//       (deleteTransactionService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await deleteTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while deleting transaction",
//       });
//     });
//   });
// });


// import {
//   processCsvFile,
//   getTransactions,
//   getPaginatedTransactions,
//   addTransaction,
//   updateTransaction,
//   deleteTransaction,
// } from "../src/controllers/transactionsController";

// import { parseCSV } from "../src/utils/csvParserUtils";
// import {
//   addTransactionService,
//   deleteTransactionService,
//   getPaginatedTransactionsService,
//   getTransactionsService,
//   updateTransactionService,
// } from "../src/services/transactionService";

// jest.mock("../src/utils/csvParserUtils", () => ({
//   parseCSV: jest.fn(),
// }));

// jest.mock("../src/services/transactionService", () => ({
//   addTransactionService: jest.fn(),
//   deleteTransactionService: jest.fn(),
//   getPaginatedTransactionsService: jest.fn(),
//   getTransactionsService: jest.fn(),
//   updateTransactionService: jest.fn(),
// }));

// describe("Transaction Controller", () => {
//   const mockRequest: any = { body: {}, query: {}, params: {} };
//   const mockResponse: any = {
//     status: jest.fn().mockReturnThis(),
//     json: jest.fn(),
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   // Test for processCsvFile
//   describe("processCsvFile", () => {
//     it("should call parseCSV and return success", async () => {
//       mockRequest.file = { path: "test.csv" }; // Mock a file path
//       (parseCSV as jest.Mock).mockResolvedValueOnce([]);

//       await processCsvFile(mockRequest, mockResponse);

//       expect(parseCSV).toHaveBeenCalledWith("test.csv");
//       expect(mockResponse.status).toHaveBeenCalledWith(200);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         message: "CSV processed successfully",
//         transactions: [],
//       });
//     });

//     it("should handle errors during CSV processing", async () => {
//       const error = new Error("CSV Error");
//       mockRequest.file = { path: "test.csv" };
//       (parseCSV as jest.Mock).mockRejectedValueOnce(error);

//       await processCsvFile(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error processing CSV file",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors during CSV processing", async () => {
//       mockRequest.file = { path: "test.csv" };
//       (parseCSV as jest.Mock).mockRejectedValueOnce("Unknown Error");

//       await processCsvFile(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while processing CSV file",
//       });
//     });

//     it("should return 400 if no file is uploaded", async () => {
//       mockRequest.file = undefined;

//       await processCsvFile(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(400);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "No file uploaded",
//       });
//     });
//   });

//   // Test for getTransactions
//   describe("getTransactions", () => {
//     it("should call getTransactionsService and return success", async () => {
//       await getTransactions(mockRequest, mockResponse);

//       expect(getTransactionsService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during fetching transactions", async () => {
//       const error = new Error("Transaction Error");
//       (getTransactionsService as jest.Mock).mockRejectedValueOnce(error);

//       await getTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error fetching transactions",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (getTransactionsService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await getTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while fetching transactions",
//       });
//     });
//   });

//   // Test for getPaginatedTransactions
//   describe("getPaginatedTransactions", () => {
//     it("should call getPaginatedTransactionsService and return success", async () => {
//       await getPaginatedTransactions(mockRequest, mockResponse);

//       expect(getPaginatedTransactionsService).toHaveBeenCalledWith(
//         mockRequest,
//         mockResponse
//       );
//     });

//     it("should handle errors during fetching paginated transactions", async () => {
//       const error = new Error("Pagination Error");
//       (getPaginatedTransactionsService as jest.Mock).mockRejectedValueOnce(error);

//       await getPaginatedTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error fetching paginated transactions",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (getPaginatedTransactionsService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await getPaginatedTransactions(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while fetching paginated transactions",
//       });
//     });
//   });

//   // Test for addTransaction
//   describe("addTransaction", () => {
//     it("should call addTransactionService and return success", async () => {
//       await addTransaction(mockRequest, mockResponse);

//       expect(addTransactionService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during adding transaction", async () => {
//       const error = new Error("Add Transaction Error");
//       (addTransactionService as jest.Mock).mockRejectedValueOnce(error);

//       await addTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error adding transaction",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (addTransactionService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await addTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while adding transaction",
//       });
//     });
//   });

//   // Test for updateTransaction
//   describe("updateTransaction", () => {
//     it("should call updateTransactionService and return success", async () => {
//       await updateTransaction(mockRequest, mockResponse);

//       expect(updateTransactionService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during updating transaction", async () => {
//       const error = new Error("Update Transaction Error");
//       (updateTransactionService as jest.Mock).mockRejectedValueOnce(error);

//       await updateTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error updating transaction",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (updateTransactionService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await updateTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while updating transaction",
//       });
//     });
//   });

//   // Test for deleteTransaction
//   describe("deleteTransaction", () => {
//     it("should call deleteTransactionService and return success", async () => {
//       await deleteTransaction(mockRequest, mockResponse);

//       expect(deleteTransactionService).toHaveBeenCalledWith(mockRequest, mockResponse);
//     });

//     it("should handle errors during deleting transaction", async () => {
//       const error = new Error("Delete Transaction Error");
//       (deleteTransactionService as jest.Mock).mockRejectedValueOnce(error);

//       await deleteTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Error deleting transaction",
//         details: error.message,
//       });
//     });

//     it("should handle unknown errors", async () => {
//       (deleteTransactionService as jest.Mock).mockRejectedValueOnce("Unexpected error");

//       await deleteTransaction(mockRequest, mockResponse);

//       expect(mockResponse.status).toHaveBeenCalledWith(500);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         error: "Unknown error occurred while deleting transaction",
//       });
//     });
//   });
// });

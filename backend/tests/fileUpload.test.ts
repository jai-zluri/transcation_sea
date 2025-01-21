//  // Adjust path as needed
// import { fileFilter } from '../src/helpers/fileHelper'; // Adjust path as needed

// describe('Multer fileFilter', () => {
//   const mockRequest = {} as any; // Mocked request object
//   const mockCallback = jest.fn(); // Mock callback function

//   it('should accept CSV files', () => {
//     const mockFile = { mimetype: 'text/csv' } as Express.Multer.File;

//     fileFilter(mockRequest, mockFile, mockCallback);

//     // Expect the callback to be called with no error
//     expect(mockCallback).toHaveBeenCalledWith(null, true);
//   });

//   it('should reject non-CSV files', () => {
//     const mockFile = { mimetype: 'application/pdf' } as Express.Multer.File;

//     fileFilter(mockRequest, mockFile, mockCallback);

//     // Expect the callback to be called with an error
//     expect(mockCallback).toHaveBeenCalledWith(new Error('Only CSV files are allowed!'));
//   });
// });

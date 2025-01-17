import multer, { Options } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { upload } from '../src/helpers/fileHelper';  // Assuming the correct import

// Correctly mocking multer as a function
jest.mock('multer', () => {
  return jest.fn().mockReturnValue({
    fileFilter: jest.fn(),  // Mock the fileFilter method to use it as function as jest work for that but fileFilter is module exporting function

  });
});

describe('Multer File Upload Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should allow CSV file uploads', () => {
    const mockFile = {
      mimetype: 'text/csv',
      size: 500000, // 500 KB
    };

    // Access the mocked fileFilter
    const fileFilter = (upload as any).fileFilter as jest.Mock;
    fileFilter(null, mockFile, (err: any) => {
      expect(err).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  it('should reject non-CSV file uploads', () => {
    const mockFile = {
      mimetype: 'application/pdf',
      size: 500000,
    };

    // Access the mocked fileFilter
    const fileFilter = (upload as any).fileFilter as jest.Mock;
    fileFilter(null, mockFile, (err: any) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Only CSV files are allowed!');
      expect(next).not.toHaveBeenCalled();
    });
  });

  it('should reject files larger than 1 MB', () => {
    const mockFile = {
      mimetype: 'text/csv',
      size: 2 * 1024 * 1024, // 2 MB
    };

    // Access the mocked fileFilter
    const fileFilter = (upload as any).fileFilter as jest.Mock;
    fileFilter(null, mockFile, (err: any) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('File too large');
      expect(next).not.toHaveBeenCalled();
    });
  });

  it('should accept valid CSV file within size limits', () => {
    const mockFile = {
      mimetype: 'text/csv',
      size: 500000, // 500 KB
    };

    // Access the mocked fileFilter
    const fileFilter = (upload as any).fileFilter as jest.Mock;
    fileFilter(null, mockFile, (err: any) => {
      expect(err).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  
});

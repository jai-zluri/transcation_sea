import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
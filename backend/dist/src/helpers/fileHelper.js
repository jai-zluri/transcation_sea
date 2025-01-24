"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Set up multer for file upload
exports.upload = (0, multer_1.default)({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed!'), false);
        }
    },
    limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1 MB
});

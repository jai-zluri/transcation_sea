
// import fs from 'fs';
// import csvParser from 'csv-parser';
// import Decimal from 'decimal.js';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const processCsvFileService = (file: Express.Multer.File): Promise<{ message: string; inserted: number }> => {
//   return new Promise((resolve, reject) => {
//     const filePath = file.path;
//     const transactions: any[] = [];
//     let isEmpty = true;
//     let malformedRows = false;

//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on('data', (row) => {
//         isEmpty = false;
//         const date = row.Date?.trim();
//         const description = row.Description?.trim();
//         const amount = new Decimal(row.Amount?.trim());

//         if (date) {
//           const [day, month, year] = date.split('-');
//           if (day && month && year) {
//             const formattedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
//             if (isNaN(formattedDate.getTime())) {
//               malformedRows = true;
//             } else {
//               transactions.push({
//                 date: formattedDate,
//                 description,
//                 amount,
//                 currency: row.Currency || null,
//               });
//             }
//           } else {
//             malformedRows = true;
//           }
//         }

//         if (amount.isNaN()) {
//           malformedRows = true;
//         }

//         if (!date || !description || amount.isNaN()) {
//           malformedRows = true;
//         }
//       })
//       .on('end', async () => {
//         if (isEmpty) {
//           reject(new Error('Uploaded CSV file is empty.'));
//           return;
//         }

//         if (malformedRows) {
//           reject(new Error('CSV contains malformed rows. Please fix and retry.'));
//           return;
//         }

//         try {
//           await prisma.transaction.createMany({
//             data: transactions,
//             skipDuplicates: true,
//           });

//           fs.unlinkSync(filePath);

//           resolve({
//             message: 'File processed and transactions saved successfully!',
//             inserted: transactions.length,
//           });
//         } catch (err) {
//           reject(err);
//         }
//       })
//       .on('error', (err) => {
//         reject(err);
//       });
//   });
// };
import moment from 'moment';

export function validateCsvData(rows: any[]): string | null {
  const dataRows = rows.slice(1); // Ignore header row
  for (let i = 0; i < dataRows.length; i++) {
    const rowError = validateCsvRow(dataRows[i]);
    if (rowError) {
      return `${rowError} on row ${i + 2}`; // +2 because we skip header and array is 0-indexed
    }
  }
  return null; // No errors
}

export function validateCsvRow(row: any[]): string | null {
  const [date, description, amount, currency] = row;

  if (!description) {
    return "Invalid description"; // Check if description exists
  }
  
  if (!amount || isNaN(amount)) {
    return "Invalid amount"; // Check if amount is a number
  }

  if (!moment(date, "DD-MM-YYYY", true).isValid()) {
    return "Invalid date format"; // Validate date format
  }

  if (!currency) {
    return "Invalid currency"; // Check if currency exists
  }

  return null; // Row is valid
}

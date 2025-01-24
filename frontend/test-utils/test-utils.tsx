// // src/test-utils/test-utils.tsx
// import React from 'react';
// import { render as rtlRender } from '@testing-library/react';
// import { AuthProvider } from '../src/context/AuthContext';

// // Custom render function that includes providers
// function render(ui: React.ReactElement, { ...renderOptions } = {}) {
//   function Wrapper({ children }: { children: React.ReactNode }) {
//     return <AuthProvider>{children}</AuthProvider>;
//   }
//   return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
// }

// // re-export everything
// export * from '@testing-library/react';
// export { render };

// // Mock Data
// export const mockTransactions = [
//   {
//     id: 1,
//     date: '2024-01-01',
//     description: 'Test Transaction 1',
//     amount: 100,
//     currency: 'USD',
//   },
//   {
//     id: 2,
//     date: '2024-01-02',
//     description: 'Test Transaction 2',
//     amount: 200,
//     currency: 'INR',
//   },
// ];

// export const mockUser = {
//   uid: '123',
//   email: 'test@example.com',
//   displayName: 'Test User',
//   photoURL: 'https://example.com/photo.jpg',
// };


// // src/test-utils/test-utils.tsx
// import React from 'react';
// import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
// import { AuthProvider } from '../src/context/AuthContext';

// // Custom render function that includes providers
// function render(ui: React.ReactElement, { ...renderOptions } = {}) {
//   function Wrapper({ children }: { children: React.ReactNode }) {
//     return <AuthProvider>{children}</AuthProvider>;
//   }
//   return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
// }

// // Re-export everything from @testing-library/react
// export * from '@testing-library/react';

// // Re-export screen, fireEvent, waitFor
// export { screen, fireEvent, waitFor };

// // Mock Data
// export const mockTransactions = [
//   {
//     id: 1,
//     date: '2024-01-01',
//     description: 'Test Transaction 1',
//     amount: 100,
//     currency: 'USD',
//   },
//   {
//     id: 2,
//     date: '2024-01-02',
//     description: 'Test Transaction 2',
//     amount: 200,
//     currency: 'INR',
//   },
// ];

// export const mockUser = {
//   uid: '123',
//   email: 'test@example.com',
//   displayName: 'Test User',
//   photoURL: 'https://example.com/photo.jpg',
// };


// src/test-utils/test-utils.tsx
import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../src/context/AuthContext';

// Custom render function that includes providers
function render(ui: React.ReactElement, { ...renderOptions } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Re-export screen, fireEvent, waitFor
export { screen, fireEvent, waitFor };

// Mock Data
export const mockTransactions = [
  {
    id: 1,
    date: '2024-01-01',
    description: 'Test Transaction 1',
    amount: 100,
    currency: 'USD',
  },
  {
    id: 2,
    date: '2024-01-02',
    description: 'Test Transaction 2',
    amount: 200,
    currency: 'INR',
  },
];

export const mockUser = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
};

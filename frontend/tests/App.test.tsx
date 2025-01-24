// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import App from "../src/App";
// import { AuthProvider } from "../src/context/AuthContext";

// global.fetch = jest.fn();

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe("App Component - Comprehensive Tests", () => {
//   const mockFetch = (response , ok = true) => {
//    (fetch as jest.Mock).mockResolvedValueOnce({
//       ok: true,
//       json: async (): Promise<{ transactions: any[]; totalPages: number }> => ({
//         transactions: [],
//         totalPages: 1,
//       }),
//     });
    
//   };

//   test("renders Transactions Valley and login state", () => {
//     render(
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     );

//     expect(screen.getByText(/Transactions Valley/i)).toBeInTheDocument();
//     expect(screen.getByText(/Login/i)).toBeInTheDocument();
//   });

//   test("fetches and displays transactions on page load", async () => {
//     mockFetch({
//       transactions: [
//         { id: 1, date: "2023-01-01", description: "Transaction 1", amount: 100 },
//         { id: 2, date: "2023-01-02", description: "Transaction 2", amount: 200 },
//       ],
//       totalPages: 1,
//     });

//     render(<App />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//       expect(screen.getByText("Transaction 2")).toBeInTheDocument();
//     });
//   });

//   test("handles fetch error gracefully", async () => {
//     mockFetch(null, false);

//     render(<App />);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalled();
//       const errorElement = screen.queryByText(/Error fetching transactions/i);
//       expect(errorElement).not.toBeInTheDocument();
//     });
//   });

//   test("uploads valid CSV file successfully", async () => {
//     mockFetch({ duplicates: [] });

//     render(<App />);

//     const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
//     const file = new File(["id,date,description,amount"], "test.csv", { type: "text/csv" });

//     fireEvent.change(fileInput, { target: { files: [file] } });

//     await waitFor(() => {
//       expect(screen.getByText(/Upload Successful!/i)).toBeInTheDocument();
//     });
//   });

//   test("warns on duplicate transactions during upload", async () => {
//     mockFetch({ duplicates: [1, 2] });

//     render(<App />);

//     const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
//     const file = new File(["test"], "test.csv", { type: "text/csv" });

//     fireEvent.change(fileInput, { target: { files: [file] } });

//     await waitFor(() => {
//       expect(screen.getByText(/Found 2 duplicate transactions/i)).toBeInTheDocument();
//     });
//   });

//   test("handles file upload failure", async () => {
//     (fetch as jest.Mock).mockRejectedValueOnce(new Error("Upload failed"));

//     render(<App />);

//     const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
//     const file = new File(["test"], "test.csv", { type: "text/csv" });

//     fireEvent.change(fileInput, { target: { files: [file] } });

//     await waitFor(() => {
//       expect(screen.getByText(/Upload Failed!/i)).toBeInTheDocument();
//     });
//   });

//   test("toggles restore table visibility", async () => {
//     render(<App />);

//     const restoreButton = screen.getByText("Restore");
//     fireEvent.click(restoreButton);

//     await waitFor(() => {
//       expect(screen.getByText(/restoreTable/i)).toBeInTheDocument();
//     });

//     fireEvent.click(restoreButton);

//     await waitFor(() => {
//       expect(screen.queryByText(/restoreTable/i)).not.toBeInTheDocument();
//     });
//   });

//   test("adds a new transaction", async () => {
//     mockFetch({});

//     render(<App />);

//     const addButton = screen.getByText(/Add Transaction/i);
//     fireEvent.click(addButton);

//     const saveButton = screen.getByText(/Save/i);
//     fireEvent.click(saveButton);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         expect.any(String),
//         expect.objectContaining({
//           method: "POST",
//         })
//       );
//     });
//   });

//   test("deletes a transaction", async () => {
//     mockFetch({});

//     render(<App />);

//     const deleteButton = screen.getByText(/Delete/i);
//     fireEvent.click(deleteButton);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         expect.any(String),
//         expect.objectContaining({
//           method: "DELETE",
//         })
//       );
//     });
//   });

//   test("logs out user", async () => {
//     render(<App />);

//     const logoutButton = screen.getByText(/Sign Out/i);
//     fireEvent.click(logoutButton);

//     await waitFor(() => {
//       expect(screen.getByText(/Login/i)).toBeInTheDocument();
//     });
//   });
// });


// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import App from "../src/App";
// import { AuthProvider } from "../src/context/AuthContext";

// global.fetch = jest.fn();

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe("App Component - Comprehensive Tests", () => {
//   const mockFetch = (
//     response: { transactions?: any[]; totalPages?: number; duplicates?: number[] } | null,
//     ok: boolean = true
//   ) => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       ok,
//       json: async (): Promise<any> => response,
//     });
//   };

//   test("renders Transactions Valley and login state", () => {
//     render(
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     );

//     expect(screen.getByText(/Transactions Valley/i)).toBeInTheDocument();
//     expect(screen.getByText(/Login/i)).toBeInTheDocument();
//   });

//   test("fetches and displays transactions on page load", async () => {
//     mockFetch({
//       transactions: [
//         { id: 1, date: "2023-01-01", description: "Transaction 1", amount: 100 },
//         { id: 2, date: "2023-01-02", description: "Transaction 2", amount: 200 },
//       ],
//       totalPages: 1,
//     });

//     render(<App />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//       expect(screen.getByText("Transaction 2")).toBeInTheDocument();
//     });
//   });

//   test("handles fetch error gracefully", async () => {
//     mockFetch(null, false);

//     render(<App />);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalled();
//       const errorElement = screen.queryByText(/Error fetching transactions/i);
//       expect(errorElement).not.toBeInTheDocument();
//     });
//   });

//   test("uploads valid CSV file successfully", async () => {
//     mockFetch({ duplicates: [] });

//     render(<App />);

//     const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
//     const file = new File(["id,date,description,amount"], "test.csv", { type: "text/csv" });

//     fireEvent.change(fileInput, { target: { files: [file] } });

//     await waitFor(() => {
//       expect(screen.getByText(/Upload Successful!/i)).toBeInTheDocument();
//     });
//   });

//   test("warns on duplicate transactions during upload", async () => {
//     mockFetch({ duplicates: [1, 2] });

//     render(<App />);

//     const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
//     const file = new File(["test"], "test.csv", { type: "text/csv" });

//     fireEvent.change(fileInput, { target: { files: [file] } });

//     await waitFor(() => {
//       expect(screen.getByText(/Found 2 duplicate transactions/i)).toBeInTheDocument();
//     });
//   });

//   test("handles file upload failure", async () => {
//     (fetch as jest.Mock).mockRejectedValueOnce(new Error("Upload failed"));

//     render(<App />);

//     const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
//     const file = new File(["test"], "test.csv", { type: "text/csv" });

//     fireEvent.change(fileInput, { target: { files: [file] } });

//     await waitFor(() => {
//       expect(screen.getByText(/Upload Failed!/i)).toBeInTheDocument();
//     });
//   });

//   test("toggles restore table visibility", async () => {
//     render(<App />);

//     const restoreButton = screen.getByText("Restore");
//     fireEvent.click(restoreButton);

//     await waitFor(() => {
//       expect(screen.getByText(/restoreTable/i)).toBeInTheDocument();
//     });

//     fireEvent.click(restoreButton);

//     await waitFor(() => {
//       expect(screen.queryByText(/restoreTable/i)).not.toBeInTheDocument();
//     });
//   });

//   test("adds a new transaction", async () => {
//     mockFetch({});

//     render(<App />);

//     const addButton = screen.getByText(/Add Transaction/i);
//     fireEvent.click(addButton);

//     const saveButton = screen.getByText(/Save/i);
//     fireEvent.click(saveButton);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         expect.any(String),
//         expect.objectContaining({
//           method: "POST",
//         })
//       );
//     });
//   });

//   test("deletes a transaction", async () => {
//     mockFetch({});

//     render(<App />);

//     const deleteButton = screen.getByText(/Delete/i);
//     fireEvent.click(deleteButton);

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         expect.any(String),
//         expect.objectContaining({
//           method: "DELETE",
//         })
//       );
//     });
//   });

//   test("logs out user", async () => {
//     render(<App />);

//     const logoutButton = screen.getByText(/Sign Out/i);
//     fireEvent.click(logoutButton);

//     await waitFor(() => {
//       expect(screen.getByText(/Login/i)).toBeInTheDocument();
//     });
//   });
// });



// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import App from "../src/App";
// import { AuthProvider } from "../src/context/AuthContext";

// global.fetch = jest.fn();

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe("App Component - Comprehensive Tests", () => {
//   const mockFetch = (
//     response,
//     ok = true
//   ) => {
//     (fetch as jest.Mock).mockResolvedValueOnce({
//       ok,
//       json: async () => response,
//     });
//   };

//   test("renders Transactions Valley and login state", () => {
//     render(
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     );
//     expect(screen.getByText(/Transactions Valley/i)).toBeInTheDocument();
//     expect(screen.getByText(/Login/i)).toBeInTheDocument();
//   });


import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";
import { AuthProvider } from "../src/context/AuthContext";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("App Component - Comprehensive Tests", () => {
  const mockFetch = (
    response: {
      transactions?: { id: number; date: string; description: string; amount: number }[];
      totalPages?: number;
      duplicates?: number[];
    } | null,
    ok: boolean = true
  ) => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok,
      json: async () => response,
    });
  };

  test("renders Transactions Valley and login state", () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    expect(screen.getByText(/Transactions Valley/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });


  test("fetches and displays transactions on page load", async () => {
    mockFetch({
      transactions: [
        { id: 1, date: "2023-01-01", description: "Transaction 1", amount: 100 },
        { id: 2, date: "2023-01-02", description: "Transaction 2", amount: 200 },
      ],
      totalPages: 1,
    });

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeInTheDocument();
      expect(screen.getByText("Transaction 2")).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    mockFetch(null, false);

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test("uploads valid CSV file successfully", async () => {
    mockFetch({ duplicates: [] });

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
    const file = new File(["id,date,description,amount"], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Upload Successful!/i)).toBeInTheDocument();
    });
  });

  test("warns on duplicate transactions during upload", async () => {
    mockFetch({ duplicates: [1, 2] });

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Found 2 duplicate transactions/i)).toBeInTheDocument();
    });
  });

  test("handles file upload failure", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Upload failed"));

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const fileInput = screen.getByLabelText(/UPLOAD CSV/i);
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Upload Failed!/i)).toBeInTheDocument();
    });
  });

  test("toggles restore table visibility", async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const restoreButton = screen.getByText("Restore");
    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(screen.getByText(/restoreTable/i)).toBeInTheDocument();
    });

    fireEvent.click(restoreButton);

    await waitFor(() => {
      expect(screen.queryByText(/restoreTable/i)).not.toBeInTheDocument();
    });
  });

  test("adds a new transaction", async () => {
    mockFetch({});

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const addButton = screen.getByText(/Add Transaction/i);
    fireEvent.click(addButton);

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
        })
      );
    });
  });

  test("deletes a transaction", async () => {
    mockFetch({});

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  test("logs out user", async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const logoutButton = screen.getByText(/Sign Out/i);
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });

  test("handles bulk delete of transactions", async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const bulkDeleteButton = screen.getByText(/Bulk Delete/i);
    fireEvent.click(bulkDeleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  test("restores a deleted transaction", async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    const restoreButton = screen.getByText(/Restore/i);
    fireEvent.click(restoreButton);

    const undoButton = screen.getByText(/Undo/i);
    fireEvent.click(undoButton);

    await waitFor(() => {
      expect(screen.getByText(/Transaction Restored/i)).toBeInTheDocument();
    });
  });
});

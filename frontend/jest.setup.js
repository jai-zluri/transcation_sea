// import '@testing-library/jest-dom';

// // Mock IntersectionObserver if it's not available in test environment
// if (typeof window !== 'undefined') {
//   window.IntersectionObserver = class IntersectionObserver {
//     constructor() {}
//     observe() { return null; }
//     unobserve() { return null; }
//     disconnect() { return null; }
//   };
// }

// // Mock ResizeObserver if needed
// window.ResizeObserver = class ResizeObserver {
//   constructor() {}
//   observe() { return null; }
//   unobserve() { return null; }
//   disconnect() { return null; }
// };

// // Setup other global mocks if needed
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => jest.fn(),
// }));


import '@testing-library/jest-dom';

// Mock IntersectionObserver
if (typeof window !== 'undefined') {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
  };
}

// Mock ResizeObserver
window.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup other global mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock `HTMLCanvasElement.getContext` for jsPDF compatibility
HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (x, y, w, h) => {
      return { data: new Uint8ClampedArray(w * h * 4) };
    },
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({
      width: 0,
    }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  };
};

// module.exports = {
  
//     "presets": [ '@babel/preset-env',     // For modern JavaScript
//       '@babel/preset-react',   // For JSX
//       '@babel/preset-typescript',
//       { targets: { node: 'current' } }

//     ]
  
//   ,

// };


module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Ensures compatibility with your Node.js version
        },
      },
    ],
    '@babel/preset-react', // For React JSX
    '@babel/preset-typescript', // For TypeScript
  ],
};

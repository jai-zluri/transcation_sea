// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const vite_1 = require("vite");
// const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
// // https://vitejs.dev/config/
// exports.default = (0, vite_1.defineConfig)({
//     plugins: [(0, plugin_react_1.default)()],
// });
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({

  plugins: [react()],
  
  server: {
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': 'http://localhost:5000',
    }
  },
  css: {
  postcss: './postcss.config.js',
  },
  
});
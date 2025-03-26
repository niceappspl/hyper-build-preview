// Polyfills dla modułów Node.js używanych przez snack-sdk

import 'assert';
import { Buffer } from 'buffer';
import 'util';

// Dodajemy window.process, jeśli go nie ma
if (!window.process) {
  window.process = { env: {} } as any;
}

// Inne potrzebne polyfills
const global = window as any;
global.process = global.process || { env: {} };
global.Buffer = global.Buffer || Buffer; 
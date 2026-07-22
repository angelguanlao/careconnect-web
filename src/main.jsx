import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import IconSprite from './components/IconSprite.jsx';
import { registerServiceWorker } from './registerSW.js';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IconSprite />
    <App />
  </StrictMode>
);

registerServiceWorker();

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Template from './components/templates/thumbnail/Template.tsx';

const params = new URLSearchParams(window.location.search);
const renderThumbnail = params.get('thumbnail') === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {renderThumbnail ? <Template /> : <App />}
  </StrictMode>
);

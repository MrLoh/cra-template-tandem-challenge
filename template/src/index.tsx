import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import createMockServer from './mockServer';
import App from './App';

createMockServer('development');

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

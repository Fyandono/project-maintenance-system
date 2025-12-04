import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // Redux Provider
import App from './App.jsx';
import { store } from './store'; // Your configured Redux store
import './App.css'; // Import global styles
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Redux Provider: Makes the Redux store available to all components */}
    <Provider store={store}>
      {/* 2. Router Provider: Enables navigation via useLocation, useNavigate, etc. */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
/**
 * Application Entry Point
 * 
 * Initializes React root and renders the main App component
 * This is the first file executed when the application loads
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create root React element from the DOM element with id 'root'
// This corresponds to the <div id="root"></div> in public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the entire application starting with the App component
root.render(
    <App />
);


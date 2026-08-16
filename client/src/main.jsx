import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthProvider";
createRoot(document.getElementById('root')).render(
<StrictMode>
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
</StrictMode>
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './Components/Context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserTypeProvider } from './Components/Context/UserTypeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserTypeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </UserTypeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);


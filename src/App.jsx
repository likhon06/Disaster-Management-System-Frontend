import React from 'react';
import Home from './pages/Home';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Outlet } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import Footers from './shared/Footer';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Toaster 
          richColors 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
        <Outlet />
      </main>
      <Footers />
    </div>
  );
};

export default App;
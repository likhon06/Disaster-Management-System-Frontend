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
    <div className="w-3/4 mx-auto">
      <Navbar />
      <Toaster richColors />
      <Outlet />
      <Footers />
    </div>
  );
};

export default App;

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Navigate } from 'react-router-dom';

const Home = () => {
  return <Navigate to="/marketplace" replace />;
};

export default Home;

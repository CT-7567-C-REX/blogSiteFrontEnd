import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import MainLayout from '../layouts/MainLayout';
import CreatePost from '../pages/CreatePost';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/createPost" element={<CreatePost />} />
        {/* Add more pages below */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

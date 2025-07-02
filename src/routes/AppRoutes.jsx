import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import MainLayout from '../layouts/MainLayout';
import CreatePost from '../pages/CreatePost';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { Box } from '@mui/material';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add more pages below */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

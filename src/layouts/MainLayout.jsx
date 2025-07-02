import React from 'react';
import { Outlet } from 'react-router-dom';
import AppAppBar from '../components/AppBar';
import CreatePost from '../pages/CreatePost';
import { Box } from '@mui/material';
import BackgroundBox from '../components/BackgroundBox';
import MainOutlet from '../components/MainOutlet';

const MainLayout = () => {
    return (
        <BackgroundBox>
            <AppAppBar />
            <MainOutlet />
        </BackgroundBox>
    );
};

export default MainLayout;

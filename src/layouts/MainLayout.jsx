import React from 'react';
import { Outlet } from 'react-router-dom';
import AppAppBar from '../components/AppBar';

const MainLayout = () => {
    return (
        <>
            <AppAppBar />
            <Outlet />
        </>
    );
};

export default MainLayout;

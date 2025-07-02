import React from 'react';
import AppAppBar from '../components/AppBar';;
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

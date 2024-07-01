import React from 'react';
import NavBar from './NavBar';
// import FooterBar from '../components/FooterBar';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      {/* <FooterBar /> */}
    </>
  );
}

export default RootLayout;
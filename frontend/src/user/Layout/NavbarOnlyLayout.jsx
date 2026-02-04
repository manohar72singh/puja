import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar'; // Apne Navbar ka sahi path de dena

const NavbarOnlyLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Yahan Profile ya Help page render hoga */}
      </main>
    </>
  );
};

export default NavbarOnlyLayout;
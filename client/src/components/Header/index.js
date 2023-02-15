import React from 'react';
import Nav from '../Nav';
import { Link } from 'react-router-dom';



const Header = () => {
  return (
    <header className="bg-tertiary py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        {/* <h1><Link style={{padding: '0', color: '#15b9e0'}} to="/"> Sis Swipe</Link></h1> */}
        <Nav></Nav>
      </div>
    </header>
  );
};

export default Header;
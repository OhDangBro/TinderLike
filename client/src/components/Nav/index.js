import React from "react";
import { Link } from "react-router-dom";
import '../../css/nav.css';
 

import auth from "../../utils/auth";

// Nav Function Start ///
function Nav() {
  const logout = (e) => {
    e.preventDefault();
    auth.logout();
  };
  return (
    // <header>
    //   <nav>
    //     <ul className="flex-row">
    //       {/* ----------- Homenavbar section start --------------- */}
    //       <li className="mx-2"><a href="../../">Home</a></li>
    //       {/* ----------Profile navbar section start------------------ */}
    //       <li className="mx-2 "><a href="../../Profile">Profile</a></li>
    //       {/* ----------Login navbar section start------------------ */}
    //       <li className="mx-2 "><a href="../../Login">Login</a></li>
    //     </ul>
    //   </nav>
    // </header>
    <nav className="flex-row">
      {auth.loggedIn() ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/inbox">Inbox</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/" onClick={logout}>Log out</Link>
        </>
      ) : (
        <>
          <Link to="/">Home</Link>
          <Link to="/Signup">Sign Up</Link>
          <Link to="/Login">Log in</Link>
          
          
        </>
      )}
    </nav>
  );
}

// ---Exports Nav--- //
export default Nav;

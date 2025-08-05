import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Hamburger from "./Hamburger";
import './NavBarStylesheet.css';
import logo from '../../assets/Images/logo/logo.png';



const Navbar = () => {
    // useState to manage hamburger menu toggle
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

        // to open/close the hamburger menu
    const toggleHamburger = () => {
        setHamburgerOpen(!hamburgerOpen);
    };

        // to set menue to close on click
    const closeMenu = () => {
        setHamburgerOpen(false); // Close menu when a link is clicked
    };

    return (
        <header>
            <nav>
               <div
            //  for Logo Container with Home Link
                    className="logo-container">
                        <img src={logo} className='App-logo' alt="Logo" />
                        <NavLink to="/" className="home">Home</NavLink>
                </div>
                {/* to display hamburger menu */}
                <ul className={hamburgerOpen ? "nav-menu open" : "nav-menu"}>
                    <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMenu}>About</NavLink></li>
                    <li><NavLink to="/photographer" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMenu}>Photographer</NavLink></li>
                    <li><NavLink to="/prints" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMenu}>Prints</NavLink></li>
                    {/* <li><NavLink to="/gear" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMenu}>Gear</NavLink></li> */}
                    <li><NavLink to="/booking" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMenu}>Get Snapped</NavLink></li>
                    <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""} onClick={closeMenu}>Contact Me</NavLink></li>
                </ul>
                {/* hamburger menu toggle */}
                <div className="hamburger" onClick={toggleHamburger}>
                    <Hamburger isOpen={hamburgerOpen} />
                </div>
            </nav>
        </header>
    );
};


export default Navbar;

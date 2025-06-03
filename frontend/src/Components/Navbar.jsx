import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChartBar } from "react-icons/fa"; // icons
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Aerostat</div>
      <div className="navbar-links">
        <Link to="/">
          <FaHome className="icon" />
          Home
        </Link>
        <Link to="/reports">
          <FaChartBar className="icon" />
          Reports
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

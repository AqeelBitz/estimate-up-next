import React from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`} onClick={toggle}>
      <div className="sidebar-icon" onClick={toggle}>
        <FaTimes className="sidebar-close-icon" />
      </div>
      <div className="sidebar-wrapper">
        <ul className="sidebar-menu">
          <li>
            <a href="#about" className="sidebar-link" onClick={toggle}>About</a>
          </li>
          <li>
            <a href="#discover" className="sidebar-link" onClick={toggle}>Discover</a>
          </li>
          <li>
            <a href="#services" className="sidebar-link" onClick={toggle}>Services</a>
          </li>
          <li>
            <a href="#signup" className="sidebar-link" onClick={toggle}>Sign Up</a>
          </li>
        </ul>
        <div className="sidebar-btn-wrap">
          <Link href="/signin" className="sidebar-route">Sign In</Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
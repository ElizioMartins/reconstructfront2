import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
  <>
    {isMobile && (
      <button className="menu-toggle" onClick={toggleSidebar}>
        <span className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    )}
    <aside className={`sidebar ${isMobile ? 'mobile' : ''} ${isOpen ? 'open' : ''}`}>
      <h2>Menu</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard" onClick={() => isMobile && setIsOpen(false)}>Dashboard</Link></li>
          <li><Link to="/job-search" onClick={() => isMobile && setIsOpen(false)}>Trabalhos</Link></li>
          <li><Link to="/event-search" onClick={() => isMobile && setIsOpen(false)}>Eventos</Link></li>
          <li><Link to="/volunteer" onClick={() => isMobile && setIsOpen(false)}>Voluntariado</Link></li>
          <li><Link to="/post-selection" onClick={() => isMobile && setIsOpen(false)}>Seleção de Postos</Link></li>
        </ul>
      </nav>
    </aside>
    {isMobile && isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
  </>
);
};

export default Sidebar;

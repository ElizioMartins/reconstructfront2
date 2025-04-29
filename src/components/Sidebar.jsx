import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Menu</h2>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dynamic_form/1/2/abc">Formulário</Link></li>
        <li><Link to="/test-page">Teste</Link></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;

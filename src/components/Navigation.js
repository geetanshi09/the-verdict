import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link to="/" className="nav-logo">
        <Shield size={32} />
        <span>Orbital Guardian</span>
      </Link>
      
      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/detection" 
          className={`nav-link ${location.pathname === '/detection' ? 'active' : ''}`}
        >
          Live Detection
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books'
];

const Header = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="flex items-center">
          <Link to="/" className="logo mr-6">ShopEase</Link>
        </div>
        
        {isAuthenticated && (
          <>
            <div className="hidden md:flex items-center space-x-4 category-buttons">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? 'home-button active' 
                    : 'home-button'
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </NavLink>
              
              {categories.map(category => (
                <NavLink 
                  key={category}
                  to={`/category/${category}`} 
                  className={({ isActive }) => 
                    isActive 
                      ? 'category-button active' 
                      : 'category-button'
                  }
                >
                  {category}
                </NavLink>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="cart-icon-container">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
              
              <div className="hidden md:flex items-center space-x-4">
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Profile
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Admin
                  </NavLink>
                )}
                <button onClick={handleLogout} className="nav-link">Logout</button>
              </div>
              
              <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {mobileMenuOpen && (
              <div className="mobile-menu">
                <div className="mobile-menu-header">
                  <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>ShopEase</Link>
                  <button className="mobile-menu-close" onClick={toggleMobileMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="mobile-nav-links">
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Home
                  </NavLink>
                  <div className="mobile-category-header">Categories</div>
                  {categories.map(category => (
                    <NavLink 
                      key={category}
                      to={`/category/${category}`} 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category}
                    </NavLink>
                  ))}
                  <div className="border-t border-gray-200 my-2"></div>
                  <NavLink to="/cart" className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={() => setMobileMenuOpen(false)}>
                    Cart
                  </NavLink>
                  <NavLink to="/profile" className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </NavLink>
                  {isAdmin && (
                    <NavLink to="/admin" className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'} onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </NavLink>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="mobile-nav-link">
                    Logout
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 
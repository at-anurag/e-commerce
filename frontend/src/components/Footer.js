import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">ShopEase</h3>
          </div>
          
          <div className="flex space-x-8 mb-4 md:mb-0">
            <Link to="/category/Electronics" className="text-gray-300 hover:text-white transition-colors">
              Electronics
            </Link>
            <Link to="/category/Clothing" className="text-gray-300 hover:text-white transition-colors">
              Clothing
            </Link>
            <Link to="/category/Home & Kitchen" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/category/Books" className="text-gray-300 hover:text-white transition-colors">
              Books
            </Link>
          </div>
          
         
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
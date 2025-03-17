import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-gray-500 mb-6">
            If you have any questions about your order, please contact our customer support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
            >
              Continue Shopping
            </Link>
            
            <Link 
              to="/profile" 
              className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-2 px-4 rounded-md transition-colors duration-300"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 
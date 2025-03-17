import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
          <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Product+Image';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                    <p className="text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link 
              to="/checkout"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              to="/"
              className="block w-full text-center mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 
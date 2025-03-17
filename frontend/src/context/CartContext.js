import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const CART_STORAGE_KEY = 'shopease_cart'; // Use a more specific key

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [initialized, setInitialized] = useState(false);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      console.log('Loading cart from storage:', savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        setCartCount(parsedCart.reduce((total, item) => total + (item.quantity || 1), 0));
        console.log('Cart loaded successfully:', parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setInitialized(true);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!initialized) return; // Skip saving during initialization
    
    try {
      const cartString = JSON.stringify(cartItems);
      localStorage.setItem(CART_STORAGE_KEY, cartString);
      console.log('Cart saved to storage:', cartString);
      
      const newCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(newCount);
      console.log('Updated cart count:', newCount);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, initialized]);
  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return;
    }
    
    console.log('Adding to cart:', product, 'quantity:', quantity);
    
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item._id === product._id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + quantity
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    console.log('Removing from cart, productId:', productId);
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    console.log('Updating quantity, productId:', productId, 'quantity:', quantity);
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };
  
  // Calculate total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };
  
  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 
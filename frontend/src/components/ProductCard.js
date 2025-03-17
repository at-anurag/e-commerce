import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/300x200?text=Product+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Memoize product price to avoid recalculation on re-renders
  const formattedPrice = product.price ? `$${product.price.toFixed(2)}` : 'Price unavailable';

  return (
    <div className="product-card">
      <img 
        src={imageError ? placeholderImage : product.image} 
        alt={product.name} 
        className="product-image"
        loading="lazy" // Add lazy loading
        onError={handleImageError}
      />
      <div className="product-content">
        <h3 className="product-title">{product.name || 'Unnamed Product'}</h3>
        <p className="product-price">{formattedPrice}</p>
        <div className="product-buttons">
          <Link to={`/product/${product._id}`} className="product-view-btn">
            View Details
          </Link>
          <button 
            onClick={handleAddToCart} 
            className={`product-cart-btn ${added ? 'added' : ''}`}
            disabled={added}
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(ProductCard); 
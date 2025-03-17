import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch product');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add the product with the selected quantity in a single call
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error || 'Product not found'}</p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover object-center"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 4)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-600 ml-2">
                  {product.rating || 4.0} ({product.numReviews || 0} reviews)
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button
                  onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`${
                  added ? 'bg-green-600 border-green-600' : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600'
                } text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex-1`}
              >
                {added ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <Link to="/cart" className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-2 px-4 rounded-md transition-colors duration-300 flex-1 text-center">
                View Cart
              </Link>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Product Details</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>In stock: {product.countInStock > 0 ? 'Yes' : 'No'}</li>
                <li>SKU: {product._id.substring(product._id.length - 8)}</li>
                <li>Category: {product.category}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
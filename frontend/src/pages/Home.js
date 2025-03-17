import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const categories = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Latest gadgets and electronic devices',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 2,
    name: 'Clothing',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Trendy fashion for all seasons',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Everything you need for your home',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 4,
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Bestsellers and classics for all readers',
    color: 'from-emerald-500 to-teal-600'
  }
];

// Create API service with caching
const api = {
  cache: new Map(),
  async get(url, options = {}) {
    const cacheKey = url + JSON.stringify(options);
    
    // Check if we have a cached response and it's not expired (5 minutes)
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      const fiveMinutes = 5 * 60 * 1000;
      if (Date.now() - timestamp < fiveMinutes) {
        return { data };
      }
    }
    
    // If no cache or expired, make the API call
    const response = await axios.get(url, {options,
                                withCredentials: true, // ✅ Include credentials
});
    
    // Cache the response
    this.cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response;
  }
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allProducts, setAllProducts] = useState([]);

  // Use useCallback to prevent recreation of function on each render
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`${process.env.REACT_APP_API_URL}/products`);
      
      if (data.products && data.products.length > 0) {
        // Save all products for the carousel
        setAllProducts(data.products);
        
        // Shuffle the products array for featured products
        const shuffledProducts = [...data.products].sort(() => 0.5 - Math.random());
        // Get the first 8 products or fewer if there aren't enough
        const randomProducts = shuffledProducts.slice(0, Math.min(8, shuffledProducts.length));
        setFeaturedProducts(randomProducts);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    
    // Clean up function to abort any pending requests when component unmounts
    return () => {
      // If you're using AbortController, you would cancel it here
    };
  }, [fetchProducts]);

  // Use memoization for derived data
  const shuffledProducts = useMemo(() => {
    if (!allProducts.length) return [];
    
    // Create a copy to avoid mutating the original array
    const shuffled = [...allProducts];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 8); // Return only 8 products
  }, [allProducts]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % allProducts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [allProducts]);

  // Optimize handleAddToCart with useCallback
  const handleAddToCart = useCallback((product) => {
    addToCart(product);
    setAddedToCart(prev => ({
      ...prev,
      [product._id]: true
    }));
    
    // Clear the "Added" status after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => ({
        ...prev,
        [product._id]: false
      }));
    }, 2000);
  }, [addToCart]);

  const nextSlide = () => {
    if (allProducts.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % allProducts.length);
  };

  const prevSlide = () => {
    if (allProducts.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + allProducts.length) % allProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative container mx-auto px-4 py-28 flex flex-col items-center text-center z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-white to-blue-300">
              Discover Amazing Products
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed">
            Your one-stop destination for quality products at unbeatable prices
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/category/Electronics" className="bg-white text-indigo-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Shop Now
            </Link>
            <Link to="/cart" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 hover:bg-white/10">
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Product Image Carousel */}
      {!loading && allProducts.length > 0 && (
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">Our Products</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our wide range of amazing products</p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <div className="relative h-96 md:h-[500px]">
                  {allProducts.map((product, index) => (
                    <div 
                      key={product._id}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        index === currentSlide 
                          ? 'opacity-100 z-10' 
                          : index === (currentSlide - 1 + allProducts.length) % allProducts.length
                            ? 'opacity-0 z-0 animate-slideOutLeft' 
                            : index === (currentSlide + 1) % allProducts.length
                              ? 'opacity-0 z-0 animate-slideOutRight'
                              : 'opacity-0 z-0'
                      }`}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x500?text=Product+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h3>
                        <p className="text-lg mb-2">${product.price.toFixed(2)}</p>
                        <p className="text-sm md:text-base mb-4 opacity-90">{product.description}</p>
                        <div className="flex space-x-3">
                          <Link 
                            to={`/product/${product._id}`}
                            className="bg-white text-indigo-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition duration-300"
                          >
                            View Details
                          </Link>
                          <button 
                            onClick={() => handleAddToCart(product)}
                            disabled={addedToCart[product._id]}
                            className={`${
                              addedToCart[product._id] 
                                ? 'bg-green-500 text-white' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            } px-4 py-2 rounded-lg transition duration-300`}
                          >
                            {addedToCart[product._id] ? 'Added ✓' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 z-20 backdrop-blur-sm transition-all duration-300"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 z-20 backdrop-blur-sm transition-all duration-300"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center mt-4">
                {allProducts.slice(0, 10).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-indigo-600 w-6' : 'bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Products Section with real data */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">Featured Products</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our selection of amazing products</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No products found. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 group">
                  <div className="relative h-64">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white m-3 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-800 truncate">{product.name}</h3>
                      <span className="text-indigo-600 font-bold">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">(5.0)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/product/${product._id}`}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-lg transition duration-300 shadow-md"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart[product._id]}
                        className={`flex-1 ${
                          addedToCart[product._id] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-800 hover:bg-black text-white'
                        } text-center py-2 px-4 rounded-lg transition duration-300 shadow-md`}
                      >
                        {addedToCart[product._id] ? 'Added ✓' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section with improved design */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Join thousands of satisfied customers and experience the best online shopping experience.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/category/Electronics" className="bg-white text-indigo-900 hover:bg-gray-100 font-bold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
              Shop Now
            </Link>
            <Link to="/cart" className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full transition duration-300 transform hover:scale-105 hover:bg-white/10">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home); 

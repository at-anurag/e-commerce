import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    seller: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      setProducts(data.products);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openModal = (product = null) => {
    if (product) {
      // Edit mode
      setEditMode(true);
      setCurrentProduct(product);
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        seller: product.seller,
        image: product.image
      });
    } else {
      // Add mode
      setEditMode(false);
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        seller: '',
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create product data object
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        seller: formData.seller,
        image: formData.image
      };
      
      if (editMode) {
        // Update product - Updated endpoint
        await axios.put(`${process.env.REACT_APP_API_URL}/products/${currentProduct._id}`, productData);
        toast.success('Product updated successfully');
      } else {
        // Create product - Updated endpoint
        await axios.post(`${process.env.REACT_APP_API_URL}/products`, productData);
        toast.success('Product created successfully');
      }
      
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      image: product.image
    });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
        console.error('Error deleting product:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Electronics',
      stock: '1',
      image: '',
      seller: ''
    });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Product Management</h1>
        {!showForm && (
          <button 
            className="admin-add-btn"
            onClick={() => setShowForm(true)}
          >
            Add New Product
          </button>
        )}
      </div>
      
      <div className="admin-tabs">
        <Link to="/admin" className="admin-tab">Dashboard</Link>
        <Link to="/admin/products" className="admin-tab active">Products</Link>
        <Link to="/admin/orders" className="admin-tab">Orders</Link>
        <Link to="/admin/users" className="admin-tab">Users</Link>
      </div>
      
      <div className="admin-content">
        {showForm ? (
          <div>
            <h2 className="admin-section-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <div className="admin-form-field">
                  <label className="admin-form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="admin-form-input"
                    required
                  />
                </div>
                
                <div className="admin-form-field">
                  <label className="admin-form-label">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="admin-form-input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="admin-form-field">
                  <label className="admin-form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="admin-form-select"
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
              </div>
              
              <div className="admin-form-field mt-4">
                <label className="admin-form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="admin-form-textarea"
                  required
                ></textarea>
              </div>
              
              <div className="admin-form-group mt-4">
                <div className="admin-form-field">
                  <label className="admin-form-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="admin-form-input"
                    min="0"
                    required
                  />
                </div>
                
                <div className="admin-form-field">
                  <label className="admin-form-label">Seller</label>
                  <input
                    type="text"
                    name="seller"
                    value={formData.seller}
                    onChange={handleChange}
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="admin-form-group mt-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              
                {/* Image preview */}
                {formData.image && (
                  <div className="mb-4 md:col-span-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="h-40 w-auto object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex">
                <button
                  type="submit"
                  className="admin-form-submit"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  className="admin-form-cancel"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="admin-section-title">All Products</h2>
            
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No products found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead className="admin-table-header">
                    <tr>
                      <th className="admin-table-header-cell">Image</th>
                      <th className="admin-table-header-cell">Name</th>
                      <th className="admin-table-header-cell">Category</th>
                      <th className="admin-table-header-cell">Price</th>
                      <th className="admin-table-header-cell">Stock</th>
                      <th className="admin-table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="admin-table-body">
                    {products.map((product) => (
                      <tr key={product._id} className="admin-table-row">
                        <td className="admin-table-cell">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No img</span>
                            </div>
                          )}
                        </td>
                        <td className="admin-table-cell font-medium">{product.name}</td>
                        <td className="admin-table-cell">{product.category}</td>
                        <td className="admin-table-cell">${product.price.toFixed(2)}</td>
                        <td className="admin-table-cell">{product.stock}</td>
                        <td className="admin-table-cell">
                          <button 
                            className="admin-action-btn admin-edit-btn"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button 
                            className="admin-action-btn admin-delete-btn"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 
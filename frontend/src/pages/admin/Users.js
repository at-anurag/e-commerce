import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Admin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`,  {
        withCredentials: true, // ✅ Include credentials
      });
      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`${API_URL}/users/${editingId}`, formData);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === editingId ? { ...user, ...formData } : user
      ));
      
      toast.success('User updated successfully!');
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setEditingId(user._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`);
        
        // Update local state
        setUsers(users.filter(user => user._id !== id));
        
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user'
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <h1 className="admin-title">User Management</h1>
      </div>
      
      <div className="admin-tabs">
        <Link to="/admin" className="admin-tab">Dashboard</Link>
        <Link to="/admin/products" className="admin-tab">Products</Link>
        <Link to="/admin/orders" className="admin-tab">Orders</Link>
        <Link to="/admin/users" className="admin-tab active">Users</Link>
      </div>
      
      <div className="admin-content">
        {showForm ? (
          <div>
            <h2 className="admin-section-title">Edit User</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <div className="admin-form-field">
                  <label className="admin-form-label">Name</label>
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
                  <label className="admin-form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="admin-form-input"
                    required
                    readOnly
                  />
                </div>
                
                <div className="admin-form-field">
                  <label className="admin-form-label">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="admin-form-select"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex">
                <button
                  type="submit"
                  className="admin-form-submit"
                >
                  Update User
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
            <h2 className="admin-section-title">All Users</h2>
            
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead className="admin-table-header">
                    <tr>
                      <th className="admin-table-header-cell">ID</th>
                      <th className="admin-table-header-cell">Name</th>
                      <th className="admin-table-header-cell">Email</th>
                      <th className="admin-table-header-cell">Role</th>
                      <th className="admin-table-header-cell">Joined</th>
                      <th className="admin-table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="admin-table-body">
                    {users.map((user) => (
                      <tr key={user._id} className="admin-table-row">
                        <td className="admin-table-cell">{user._id.substring(0, 8)}...</td>
                        <td className="admin-table-cell font-medium">{user.name}</td>
                        <td className="admin-table-cell">{user.email}</td>
                        <td className="admin-table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="admin-table-cell">{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
                        <td className="admin-table-cell">
                          <button 
                            className="admin-action-btn admin-edit-btn"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button 
                            className="admin-action-btn admin-delete-btn"
                            onClick={() => handleDelete(user._id)}
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

export default Users; 

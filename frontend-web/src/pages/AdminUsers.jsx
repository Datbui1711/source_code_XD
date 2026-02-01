import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminUsers({ onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CANDIDATE'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort users by ID descending (newest first)
      const sortedUsers = (response.data || []).sort((a, b) => b.id - a.id);
      setUsers(sortedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`/api/auth/users/${userId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User deactivated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to DELETE this user? This action cannot be undone!')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`/api/auth/users/${editingUser.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

 const handleCreateUser = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('accessToken');

    // Validate password length
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    await axios.post('/api/auth/admin/users', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    alert('User created successfully');
    setShowCreateModal(false);
    setFormData({ email: '', password: '', role: 'CANDIDATE' });
    fetchUsers();

  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error.response?.data?.message || 'Failed to create user';
    alert(errorMessage);
  }
};

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navigation */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
            CareerMate Admin
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-desktop" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Dashboard</a>
            <a href="/admin/users" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Users</a>
            <a href="/admin/jobs" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem' }}>Jobs</a>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1.25rem', background: 'white', border: '1px solid #cbd5e1', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <button 
            className="nav-mobile"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              display: 'none',
              flexDirection: 'column', 
              gap: '4px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <div style={{ width: '24px', height: '2px', background: '#dc2626', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#dc2626', transition: 'all 0.3s' }}></div>
            <div style={{ width: '24px', height: '2px', background: '#dc2626', transition: 'all 0.3s' }}></div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="nav-mobile" style={{ 
            display: 'none',
            flexDirection: 'column', 
            gap: '0.5rem', 
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            background: 'white'
          }}>
            <a href="/admin/dashboard" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem', borderRadius: '6px' }}>Dashboard</a>
            <a href="/admin/users" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600', padding: '0.75rem', borderRadius: '6px', background: '#fef2f2' }}>Users</a>
            <a href="/admin/jobs" style={{ color: '#64748b', textDecoration: 'none', padding: '0.75rem', borderRadius: '6px' }}>Jobs</a>
            <button onClick={handleLogout} style={{ padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', textAlign: 'left' }}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              User Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Manage all users in the system
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '0.75rem 1.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}
          >
            + Create User
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, minWidth: '250px', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem' }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer' }}
            >
              <option value="ALL">All Roles</option>
              <option value="CANDIDATE">Candidates</option>
              <option value="RECRUITER">Recruiters</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Total Users</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{users.length}</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Candidates</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3b82f6' }}>{users.filter(u => u.role === 'CANDIDATE').length}</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Recruiters</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#8b5cf6' }}>{users.filter(u => u.role === 'RECRUITER').length}</div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Active Users</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#10b981' }}>{users.filter(u => u.isActive).length}</div>
          </div>
        </div>

        {/* Users Table */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0f172a', fontWeight: '600' }}>{user.id}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0f172a' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.375rem 0.875rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'RECRUITER' ? '#ede9fe' : '#dbeafe',
                        color: user.role === 'ADMIN' ? '#dc2626' : user.role === 'RECRUITER' ? '#7c3aed' : '#2563eb'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.375rem 0.875rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: user.isActive ? '#d1fae5' : '#fee2e2',
                        color: user.isActive ? '#059669' : '#dc2626'
                      }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditUser(user)}
                          style={{ padding: '0.5rem 0.875rem', background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                        >
                          Edit
                        </button>
                        {user.role !== 'ADMIN' && user.isActive && (
                          <button
                            onClick={() => handleDeactivateUser(user.id)}
                            style={{ padding: '0.5rem 0.875rem', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                          >
                            Deactivate
                          </button>
                        )}
                        {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{ padding: '0.5rem 0.875rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              No users found
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '2rem', width: '90%', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Edit User</h2>
              <form onSubmit={handleUpdateUser}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  >
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span style={{ fontWeight: '600' }}>Active</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                    Update
                  </button>
                  <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '8px', padding: '2rem', width: '90%', maxWidth: '500px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Create New User</h2>
              <form onSubmit={handleCreateUser}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  >
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" style={{ flex: 1, padding: '0.75rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                    Create
                  </button>
                  <button type="button" onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .nav-desktop {
          display: flex !important;
        }
        
        .nav-mobile {
          display: none !important;
        }
        
        @media (max-width: 767px) {
          .nav-desktop {
            display: none !important;
          }
          
          .nav-mobile {
            display: flex !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
          
          h2 {
            font-size: 1.25rem !important;
          }
          
          h3 {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminUsers;

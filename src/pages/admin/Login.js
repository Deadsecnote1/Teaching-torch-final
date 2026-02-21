import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError('Failed to log in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Admin Login</h1>
          <p className="lead">Access the Teaching Torch administration panel</p>
        </div>
      </header>

      {/* Login Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-body p-4">
                  <h3 className="card-title text-center mb-4">
                    <i className="bi bi-shield-lock me-2"></i>
                    Admin Access
                  </h3>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter admin email"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter admin password"
                          required
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <button disabled={loading} type="submit" className="btn btn-primary w-100">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <Link to="/" className="text-muted">
                      <i className="bi bi-arrow-left me-1"></i>
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
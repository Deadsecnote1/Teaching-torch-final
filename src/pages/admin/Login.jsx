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
  const { login, setManageMode } = useAuth();

  const [loginAttempts, setLoginAttempts] = useState(parseInt(localStorage.getItem('login_attempts') || '0'));
  const [lockoutTime, setLockoutTime] = useState(parseInt(localStorage.getItem('lockout_time') || '0'));

  const handleLogin = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (lockoutTime && now < lockoutTime) {
      const remainingSeconds = Math.ceil((lockoutTime - now) / 1000);
      setError(`Too many failed attempts. Please try again in ${remainingSeconds} seconds.`);
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      
      // Clear attempts on success
      setLoginAttempts(0);
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('lockout_time');
      
      setManageMode(true);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());
      
      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 60000; // 1 minute lockout
        setLockoutTime(lockUntil);
        localStorage.setItem('lockout_time', lockUntil.toString());
        setError('Too many failed attempts. You are locked out for 1 minute.');
      } else {
        setError(`Failed to log in. Please check your email and password. (${5 - newAttempts} attempts remaining)`);
      }
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
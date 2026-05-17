import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertTriangle, LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Container, Section } from '../../components/ui/Layout';
import { Card, CardContent } from '../../components/ui/Card';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsAdmin } = useAuth();

  useEffect(() => {
    if (location.state?.reason === 'not_authorized') {
      setError('This account is not authorized for admin access.');
    }
  }, [location.state?.reason]);

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
      await loginAsAdmin(email, password);

      setLoginAttempts(0);
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('lockout_time');

      navigate('/admin');
    } catch (err) {
      console.error(err);

      if (err.code === 'NOT_AUTHORIZED') {
        setError('This account is not on the admin allowlist. Contact the site owner.');
        setLoading(false);
        return;
      }

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
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Page Header */}
      <header className="bg-slate-900 text-center py-16 text-white border-b border-slate-800">
        <Container>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Admin Login</h1>
          <p className="text-lg mt-3 text-slate-300 max-w-2xl mx-auto">Access the Teaching Torch administration panel</p>
        </Container>
      </header>

      {/* Login Form */}
      <Section className="py-12 flex-1 flex flex-col justify-center">
        <Container className="max-w-md mx-auto">
          <Card className="border-border shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-text-primary flex items-center justify-center">
                <Shield className="w-6 h-6 mr-2 text-primary" />
                Admin Access
              </h3>

              {error && (
                <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg mb-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-2.5 pr-12 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-text-muted hover:text-primary transition-colors focus:outline-none"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading} 
                  type="submit" 
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all shadow-sm flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <LogIn className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="text-center mt-6">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </div>
  );
};

export default AdminLogin;
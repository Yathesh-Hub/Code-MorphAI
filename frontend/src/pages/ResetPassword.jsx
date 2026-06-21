import { ArrowLeft, ArrowRight, Code2, Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Auth.module.css';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');

  useState(() => {
    if (!email || !otp) navigate('/forgot-password', { replace: true });
  });

  const evaluateStrength = (val) => {
    if (!val) { setPasswordStrength(''); setPasswordFeedback(''); return; }
    if (val.length < 6) {
      setPasswordStrength('weak');
      setPasswordFeedback('Too short (min 6 characters)');
    } else if (val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val) && /[^A-Za-z0-9]/.test(val)) {
      setPasswordStrength('strong');
      setPasswordFeedback('Strong password');
    } else if (val.length >= 6 && /[A-Z]/.test(val) && /\d/.test(val)) {
      setPasswordStrength('medium');
      setPasswordFeedback('Medium strength');
    } else {
      setPasswordStrength('weak');
      setPasswordFeedback('Add uppercase, numbers, or symbols for a stronger password');
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'password') evaluateStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email,
        otp,
        password: form.password,
      });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = { weak: '#ef4444', medium: '#f59e0b', strong: '#22c55e' };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Code2 size={22} /></div>
            <span className={styles.brandName}>CodeMorph AI</span>
          </div>
          <h2 className={styles.brandHeadline}>Choose a new <span>password</span></h2>
          <p className={styles.brandSub}>
            Make sure your new password is strong and unique. Use at least 6 characters with a mix of letters, numbers, and symbols.
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Reset password</h1>
            <p className={styles.sub}>Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="password">New password</label>
              <div className={styles.inputWrapper}>
                <Lock size={15} className={styles.inputIcon} />
                <input id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required minLength={6} autoComplete="new-password" />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    padding: 0, display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordStrength && (
                <div style={{ marginTop: '0.3rem' }}>
                  <div style={{
                    height: 3, borderRadius: 2,
                    background: 'var(--border)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                      background: strengthColors[passwordStrength],
                      transition: 'all 0.3s',
                    }} />
                  </div>
                  <span style={{
                    fontSize: '0.7rem', color: strengthColors[passwordStrength],
                    marginTop: '0.15rem', display: 'block',
                  }}>
                    {passwordFeedback}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className={styles.inputWrapper}>
                <Lock size={15} className={styles.inputIcon} />
                <input id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required minLength={6} autoComplete="new-password" />
                <button type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute', right: '0.75rem',
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    padding: 0, display: 'flex',
                  }}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <span style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.15rem' }}>
                  Passwords do not match
                </span>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : <ArrowRight size={16} />}
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className={styles.switch}>
            <Link to="/login"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight, CheckCircle, Code2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}><Code2 size={22} /></div>
            <span className={styles.brandName}>CodeMorph AI</span>
          </div>
          <h2 className={styles.brandHeadline}>
            Transform your code with <span>AI precision</span>
          </h2>
          <p className={styles.brandSub}>
            Translate between 22 programming languages, analyze complexity, detect bugs, and understand code — all powered by Google Gemini.
          </p>
          <div className={styles.features}>
            {['22 programming languages supported', 'AI-powered code analysis', 'Bug detection & security scan', 'Instant code explanations'].map(f => (
              <div key={f} className={styles.feature}>
                <div className={styles.featureIcon}><CheckCircle size={12} /></div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.sub}>Sign in to your CodeMorph account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <div className={styles.inputWrapper}>
                <Mail size={15} className={styles.inputIcon} />
                <input id="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  required autoComplete="email" />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={15} className={styles.inputIcon} />
                <input id="password" type="password" placeholder="Enter your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required autoComplete="current-password" />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : <ArrowRight size={16} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.switch}>
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { ArrowRight, CheckCircle, Code2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
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
            Start coding smarter <span>today</span>
          </h2>
          <p className={styles.brandSub}>
            Join thousands of developers using CodeMorph AI to translate, analyze, and understand code faster than ever.
          </p>
          <div className={styles.features}>
            {['Free to get started', 'No credit card required', 'Powered by Gemini 2.5', 'Unlimited translations'].map(f => (
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
            <h1 className={styles.title}>Create account</h1>
            <p className={styles.sub}>Join CodeMorph AI for free</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Full name</label>
              <div className={styles.inputWrapper}>
                <User size={15} className={styles.inputIcon} />
                <input id="name" type="text" placeholder="Your name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  required autoComplete="name" />
              </div>
            </div>

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
                <input id="password" type="password" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required minLength={6} autoComplete="new-password" />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : <ArrowRight size={16} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.switch}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

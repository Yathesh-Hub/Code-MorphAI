import { ArrowLeft, ArrowRight, Code2, Mail } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
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
          <h2 className={styles.brandHeadline}>Reset your <span>password</span></h2>
          <p className={styles.brandSub}>
            Enter your email address and we&apos;ll send you a one-time password to reset your account.
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Forgot password</h1>
            <p className={styles.sub}>Enter your email to receive an OTP</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <div className={styles.inputWrapper}>
                <Mail size={15} className={styles.inputIcon} />
                <input id="email" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email" />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : <ArrowRight size={16} />}
              {loading ? 'Sending OTP...' : 'Send OTP'}
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

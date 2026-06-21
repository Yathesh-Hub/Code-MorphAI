import { ArrowLeft, ArrowRight, Code2, KeyRound } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Auth.module.css';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const inputsRef = useRef([]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) navigate('/forgot-password', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    setOtp((prev) => prev.map((_, i) => pasted[i] || ''));
    if (pasted.length) inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Please enter the full 6-digit OTP');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp: code });
      toast.success('OTP verified');
      navigate('/reset-password', { state: { email, otp: code } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP resent');
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
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
          <h2 className={styles.brandHeadline}>Check your <span>email</span></h2>
          <p className={styles.brandSub}>
            We&apos;ve sent a 6-digit OTP to <strong>{email}</strong>. Enter it below to proceed.
          </p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.card}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Verify OTP</h1>
            <p className={styles.sub}>Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={handleVerify} className={styles.form}>
            <div className={styles.field}>
              <label>One-time password</label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    style={{
                      width: 48,
                      height: 52,
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.select()}
                    autoFocus={i === 0}
                    required
                  />
                ))}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.btnSpinner} /> : <ArrowRight size={16} />}
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <p className={styles.switch}>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  cursor: resendLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {resendLoading ? 'Resending...' : 'Resend OTP'}
              </button>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Resend in <strong>{countdown}s</strong>
              </span>
            )}
          </p>

          <p className={styles.switch}>
            <Link to="/forgot-password"><KeyRound size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Use a different email</Link>
          </p>

          <p className={styles.switch}>
            <Link to="/login"><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

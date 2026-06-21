const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { sendOtpEmail } = require('../services/emailService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from('users')
      .insert({ name, email, password: hashedPassword })
      .select('id, name, email, created_at')
      .single();

    if (error) throw error;

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.json({ message: 'If an account with that email exists, an OTP has been sent.' });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ reset_otp: otp, reset_otp_expiry: expiry })
      .eq('id', user.id);

    if (updateError) throw updateError;

    await sendOtpEmail(email, otp);

    res.json({ message: 'If an account with that email exists, an OTP has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, reset_otp, reset_otp_expiry')
      .eq('email', email)
      .single();

    if (error || !user || !user.reset_otp || !user.reset_otp_expiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (new Date(user.reset_otp_expiry) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (user.reset_otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, reset_otp, reset_otp_expiry')
      .eq('email', email)
      .single();

    if (error || !user || !user.reset_otp || !user.reset_otp_expiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (new Date(user.reset_otp_expiry) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (user.reset_otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_otp: null,
        reset_otp_expiry: null,
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    res.json({ message: 'Password reset successful. You can now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
};

module.exports = { register, login, getMe, forgotPassword, verifyOtp, resetPassword };

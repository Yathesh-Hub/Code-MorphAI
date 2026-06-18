require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(cors({origin: ['http://localhost:5173','https://code-morphai-mu.vercel.app'],credentials: true,}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/translationRoutes'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

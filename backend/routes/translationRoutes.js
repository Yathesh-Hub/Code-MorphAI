const express = require('express');
const { body } = require('express-validator');
const {
  translate,
  explain,
  analyze,
  findIssues,
  getHistory,
  deleteHistory,
  getDashboardStats,
} = require('../controllers/translationController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const LANGUAGES = [
  'Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#',
  'Go', 'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'R', 'Scala',
  'Dart', 'Lua', 'Perl', 'Haskell', 'Bash', 'SQL', 'MATLAB',
];

const codeBody = body('code').trim().notEmpty().withMessage('Code is required');

router.use(protect);

router.get('/dashboard', getDashboardStats);

router.post(
  '/translate',
  aiLimiter,
  [
    codeBody,
    body('sourceLanguage').isIn(LANGUAGES).withMessage('Invalid source language'),
    body('targetLanguage').isIn(LANGUAGES).withMessage('Invalid target language'),
  ],
  validate,
  translate
);

router.post('/explain', aiLimiter, [codeBody], validate, explain);

router.post('/analyze', aiLimiter, [codeBody], validate, analyze);

router.post('/issues', aiLimiter, [codeBody], validate, findIssues);

router.get('/history', getHistory);

router.delete('/history/:id', deleteHistory);

module.exports = router;

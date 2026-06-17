const supabase = require('../config/supabase');
const gemini = require('../services/geminiService');

const translate = async (req, res) => {
  const { sourceLanguage, targetLanguage, code } = req.body;
  const userId = req.user.id;

  try {
    const translatedCode = await gemini.translateCode(code, sourceLanguage, targetLanguage);

    if (translatedCode.startsWith('SYNTAX_ERROR:')) {
      const syntaxError = translatedCode.replace('SYNTAX_ERROR:', '').trim();
      return res.status(400).json({ error: syntaxError });
    }

    const { data: translation, error } = await supabase
      .from('translations')
      .insert({
        user_id: userId,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        source_code: code,
        translated_code: translatedCode,
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ translatedCode, translationId: translation.id });
  } catch (err) {
    console.error('Translate error:', err);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
};

const explain = async (req, res) => {
  const { code, translationId } = req.body;

  try {
    const explanation = await gemini.explainCode(code);

    if (translationId) {
      await supabase
        .from('translations')
        .update({ explanation })
        .eq('id', translationId)
        .eq('user_id', req.user.id);
    }

    res.json({ explanation });
  } catch (err) {
    console.error('Explain error:', err);
    res.status(500).json({ error: 'Explanation failed. Please try again.' });
  }
};

const analyze = async (req, res) => {
  const { code, translationId } = req.body;

  try {
    const analysis = await gemini.analyzeCode(code);

    if (translationId) {
      await supabase.from('analyses').upsert({
        translation_id: translationId,
        summary: analysis.summary,
        time_complexity: analysis.timeComplexity,
        space_complexity: analysis.spaceComplexity,
        readability_score: analysis.readabilityScore,
        maintainability_score: analysis.maintainabilityScore,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
      });
    }

    res.json({ analysis });
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
};

const findIssues = async (req, res) => {
  const { code } = req.body;

  try {
    const issues = await gemini.findIssues(code);
    res.json({ issues });
  } catch (err) {
    console.error('Issues error:', err);
    res.status(500).json({ error: 'Bug detection failed. Please try again.' });
  }
};

const getHistory = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('translations')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `source_language.ilike.%${search}%,target_language.ilike.%${search}%,source_code.ilike.%${search}%`
      );
    }

    const { data, count, error } = await query;
    if (error) throw error;

    res.json({ translations: data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

const deleteHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
};

const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: translations, error } = await supabase
      .from('translations')
      .select('id, source_language, target_language, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { count: analysesCount } = await supabase
      .from('analyses')
      .select('id', { count: 'exact' })
      .in('translation_id', translations.map((t) => t.id));

    // Most used language pair
    const pairCount = {};
    translations.forEach((t) => {
      const key = `${t.source_language} → ${t.target_language}`;
      pairCount[key] = (pairCount[key] || 0) + 1;
    });
    const mostUsedPair = Object.entries(pairCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    res.json({
      totalTranslations: translations.length,
      totalAnalyses: analysesCount || 0,
      recentTranslations: translations.slice(0, 5),
      mostUsedPair,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { translate, explain, analyze, findIssues, getHistory, deleteHistory, getDashboardStats };

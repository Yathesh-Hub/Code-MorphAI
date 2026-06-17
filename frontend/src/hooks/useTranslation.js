import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export const useTranslation = () => {
  const [translating, setTranslating] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [findingIssues, setFindingIssues] = useState(false);

  const [translatedCode, setTranslatedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [issues, setIssues] = useState(null);
  const [translationId, setTranslationId] = useState(null);
  const [translationError, setTranslationError] = useState(null);

  const translate = async (code, sourceLanguage, targetLanguage) => {
    setTranslating(true);
    setTranslationError(null);
    try {
      const { data } = await api.post('/translate', { code, sourceLanguage, targetLanguage });
      setTranslatedCode(data.translatedCode);
      setTranslationId(data.translationId);
      toast.success('Code translated successfully');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Translation failed';
      setTranslationError(errMsg);
      toast.error(errMsg);
    } finally {
      setTranslating(false);
    }
  };

  const explain = async (code) => {
    setExplaining(true);
    try {
      const { data } = await api.post('/explain', { code, translationId });
      setExplanation(data.explanation);
      toast.success('Explanation ready');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Explanation failed');
    } finally {
      setExplaining(false);
    }
  };

  const analyze = async (code) => {
    setAnalyzing(true);
    try {
      const { data } = await api.post('/analyze', { code, translationId });
      setAnalysis(data.analysis);
      toast.success('Analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const detectIssues = async (code) => {
    setFindingIssues(true);
    try {
      const { data } = await api.post('/issues', { code });
      setIssues(data.issues);
      toast.success('Issue scan complete');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Issue detection failed');
    } finally {
      setFindingIssues(false);
    }
  };

  const reset = () => {
    setTranslatedCode('');
    setExplanation('');
    setAnalysis(null);
    setIssues(null);
    setTranslationId(null);
    setTranslationError(null);
  };

  return {
    translating, explaining, analyzing, findingIssues,
    translatedCode, explanation, analysis, issues, translationId, translationError,
    translate, explain, analyze, detectIssues, reset,
  };
};

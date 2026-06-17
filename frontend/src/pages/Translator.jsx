import {
    AlertTriangle,
    ArrowLeftRight,
    BarChart2, Bug,
    CheckCheck,
    CheckCircle2,
    ChevronDown,
    Clock,
    Code2,
    Copy,
    Lightbulb,
    RotateCcw,
    Shield,
    Sparkles,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import { useTranslation } from '../hooks/useTranslation';
import styles from './Translator.module.css';

export const LANGUAGES = [
  { value: 'Python', label: 'Python', color: '#3b82f6' },
  { value: 'JavaScript', label: 'JavaScript', color: '#f59e0b' },
  { value: 'TypeScript', label: 'TypeScript', color: '#06b6d4' },
  { value: 'Java', label: 'Java', color: '#ef4444' },
  { value: 'C', label: 'C', color: '#6366f1' },
  { value: 'C++', label: 'C++', color: '#8b5cf6' },
  { value: 'C#', label: 'C#', color: '#10b981' },
  { value: 'Go', label: 'Go', color: '#06b6d4' },
  { value: 'Rust', label: 'Rust', color: '#f97316' },
  { value: 'Swift', label: 'Swift', color: '#ef4444' },
  { value: 'Kotlin', label: 'Kotlin', color: '#7c6cf8' },
  { value: 'PHP', label: 'PHP', color: '#6366f1' },
  { value: 'Ruby', label: 'Ruby', color: '#f43f5e' },
  { value: 'R', label: 'R', color: '#2563eb' },
  { value: 'Scala', label: 'Scala', color: '#dc2626' },
  { value: 'Dart', label: 'Dart', color: '#06b6d4' },
  { value: 'Lua', label: 'Lua', color: '#1d4ed8' },
  { value: 'Perl', label: 'Perl', color: '#7c3aed' },
  { value: 'Haskell', label: 'Haskell', color: '#5b21b6' },
  { value: 'Bash', label: 'Bash/Shell', color: '#065f46' },
  { value: 'SQL', label: 'SQL', color: '#0369a1' },
  { value: 'MATLAB', label: 'MATLAB', color: '#b45309' },
];

const TABS = [
  { id: 'explain', label: 'Explanation', icon: Lightbulb },
  { id: 'analyze', label: 'Analysis', icon: BarChart2 },
  { id: 'issues', label: 'Bug Report', icon: Bug },
];

export default function Translator() {
  const [code, setCode] = useState('');
  const [sourceLang, setSourceLang] = useState('Python');
  const [targetLang, setTargetLang] = useState('JavaScript');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const {
    translating, explaining, analyzing, findingIssues,
    translatedCode, explanation, analysis, issues, translationError,
    translate, explain, analyze, detectIssues, reset,
  } = useTranslation();

  const handleTranslate = () => {
    if (!code.trim()) return;
    reset(); setActiveTab(null);
    translate(code, sourceLang, targetLang);
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleExplain = () => { if (!code.trim()) return; explain(code); setActiveTab('explain'); };
  const handleAnalyze = () => { if (!code.trim()) return; analyze(code); setActiveTab('analyze'); };
  const handleIssues = () => { if (!code.trim()) return; detectIssues(code); setActiveTab('issues'); };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => { setCode(''); reset(); setActiveTab(null); };

  const isLoading = translating || explaining || analyzing || findingIssues;
  const sourceLangColor = LANGUAGES.find(l => l.value === sourceLang)?.color || '#7c6cf8';
  const targetLangColor = LANGUAGES.find(l => l.value === targetLang)?.color || '#06b6d4';

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageIcon}><Code2 size={18} /></div>
          <div>
            <h1>Code Workspace</h1>
            <p>AI-assisted compiler & translator for developer projects</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.resetBtn} onClick={handleReset} disabled={isLoading} title="Clear all">
            <RotateCcw size={14} /> Clear Workspace
          </button>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className={styles.langBar}>
        <div className={styles.langSelectorGroup}>
          <span className={styles.langLabel}>Source</span>
          <div className={styles.selectWrapper}>
            <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} aria-label="Source language">
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <ChevronDown size={13} className={styles.chevron} />
          </div>
        </div>

        <button className={styles.swapBtn} onClick={handleSwapLangs} disabled={isLoading} title="Swap languages">
          <ArrowLeftRight size={14} />
        </button>

        <div className={styles.langSelectorGroup}>
          <span className={styles.langLabel}>Target</span>
          <div className={styles.selectWrapper}>
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)} aria-label="Target language">
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <ChevronDown size={13} className={styles.chevron} />
          </div>
        </div>

        <button
          className={styles.translateBtn}
          onClick={handleTranslate}
          disabled={!code.trim() || isLoading}
        >
          {translating ? (
            <><span className={styles.btnSpinner} /> Compiling...</>
          ) : (
            <>Translate Code</>
          )}
        </button>

        <div className={styles.aiToolbar}>
          <button
            className={`${styles.aiBtn} ${activeTab === 'explain' ? styles.aiBtnActive : ''}`}
            onClick={handleExplain} disabled={!code.trim() || isLoading}
          >
            {explaining ? <span className={styles.btnSpinnerSm} /> : <Lightbulb size={13} />}
            Explain
          </button>
          <button
            className={`${styles.aiBtn} ${activeTab === 'analyze' ? styles.aiBtnActive : ''}`}
            onClick={handleAnalyze} disabled={!code.trim() || isLoading}
          >
            {analyzing ? <span className={styles.btnSpinnerSm} /> : <BarChart2 size={13} />}
            Analyze Quality
          </button>
          <button
            className={`${styles.aiBtn} ${activeTab === 'issues' ? styles.aiBtnActive : ''}`}
            onClick={handleIssues} disabled={!code.trim() || isLoading}
          >
            {findingIssues ? <span className={styles.btnSpinnerSm} /> : <Bug size={13} />}
            Lint / Bug Audit
          </button>
        </div>
      </div>

      {/* Editors */}
      <div className={styles.editors}>
        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
            <div className={styles.editorTitle}>
              <span className={styles.langBadge}>
                {sourceLang}
              </span>
              <span className={styles.editorSubtitle}>Input Source</span>
            </div>
            <div className={styles.editorMeta}>
              {code && <span className={styles.lineCount}>{code.split('\n').length} lines</span>}
            </div>
          </div>
          <CodeEditor
            value={code}
            onChange={setCode}
            placeholder={`// Paste your ${sourceLang} code here...`}
          />
        </div>

        <div className={styles.editorDivider}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerIcon}>
            {translating ? <span className={styles.spinnerLarge} /> : <ArrowLeftRight size={14} />}
          </div>
          <div className={styles.dividerLine} />
        </div>

        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
            <div className={styles.editorTitle}>
              <span className={styles.langBadge}>
                {targetLang}
              </span>
              <span className={styles.editorSubtitle}>Compiled Output</span>
            </div>
            <div className={styles.editorMeta}>
              {translatedCode && (
                <button className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? <><CheckCheck size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              )}
            </div>
          </div>
          {translationError ? (
            <div className={styles.errorPanel}>
              <AlertTriangle size={18} className={styles.errorIcon} />
              <div className={styles.errorTextWrap}>
                <span className={styles.errorTitle}>Syntax Error Detected</span>
                <span className={styles.errorDesc}>{translationError}</span>
              </div>
            </div>
          ) : (
            <CodeEditor
              value={translatedCode}
              readOnly
              placeholder={`// Translated ${targetLang} code will appear here...`}
              language={targetLang}
            />
          )}
          {translating && (
            <div className={styles.translatingOverlay}>
              <span className={styles.spinnerLarge} />
              <span>Translating with AI...</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Results */}
      {(explanation || analysis || issues) && (
        <div className={styles.results}>
          <div className={styles.resultTabs}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const hasData = id === 'explain' ? !!explanation : id === 'analyze' ? !!analysis : !!issues;
              if (!hasData) return null;
              return (
                <button
                  key={id}
                  className={`${styles.resultTab} ${activeTab === id ? styles.resultTabActive : ''}`}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={14} />
                  {label}
                  <span className={styles.tabDot} />
                </button>
              );
            })}
          </div>

          <div className={styles.resultContent}>
            {activeTab === 'explain' && explanation && <ExplanationPanel text={explanation} />}
            {activeTab === 'analyze' && analysis && <AnalysisPanel data={analysis} />}
            {activeTab === 'issues' && issues && <IssuesPanel data={issues} />}
          </div>
        </div>
      )}
    </div>
  );
}

function ExplanationPanel({ text }) {
  const sections = text.split('\n').filter(Boolean);
  return (
    <div className={styles.explainPanel}>
      <div className={styles.explainHeader}>
        <Lightbulb size={18} />
        <span>Code Explanation</span>
      </div>
      <div className={styles.explainBody}>
        {sections.map((line, i) => {
          const isHeading = /^\d+\.|^#{1,3}\s|^[A-Z][^a-z]+:/.test(line.trim());
          return isHeading
            ? <h4 key={i} className={styles.explainHeading}>{line.replace(/^#+\s/, '').replace(/^\d+\.\s/, '')}</h4>
            : <p key={i} className={styles.explainText}>{line}</p>;
        })}
      </div>
    </div>
  );
}

function AnalysisPanel({ data }) {
  return (
    <div className={styles.analysisPanel}>
      <div className={styles.analysisHeader}>
        <BarChart2 size={18} /><span>Code Analysis</span>
      </div>
      {data.summary && <p className={styles.analysisSummary}>{data.summary}</p>}

      <div className={styles.complexityRow}>
        <ComplexityBadge icon={<Clock size={14} />} label="Time" value={data.timeComplexity} />
        <ComplexityBadge icon={<Zap size={14} />} label="Space" value={data.spaceComplexity} />
      </div>

      <div className={styles.scoresRow}>
        <ScoreCard label="Readability" score={data.readabilityScore} icon={<TrendingUp size={14} />} />
        <ScoreCard label="Maintainability" score={data.maintainabilityScore} icon={<Shield size={14} />} />
      </div>

      {data.suggestions?.length > 0 && (
        <div className={styles.suggestionsList}>
          <h4><CheckCircle2 size={14} /> Suggestions</h4>
          <ul>
            {data.suggestions.map((s, i) => (
              <li key={i}>{typeof s === 'object' ? JSON.stringify(s) : s}</li>
            ))}
          </ul>
        </div>
      )}
      {data.issues?.length > 0 && (
        <div className={styles.issuesList}>
          <h4><AlertTriangle size={14} /> Issues</h4>
          <ul>
            {data.issues.map((s, i) => (
              <li key={i}>{typeof s === 'object' ? JSON.stringify(s) : s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function IssuesPanel({ data }) {
  const CATEGORIES = [
    { key: 'bugs', label: 'Bugs', icon: <Bug size={13} />, color: 'var(--error)' },
    { key: 'runtimeErrors', label: 'Runtime Errors', icon: <AlertTriangle size={13} />, color: 'var(--warning)' },
    { key: 'logicIssues', label: 'Logic Issues', icon: <Zap size={13} />, color: '#a855f7' },
    { key: 'securityVulnerabilities', label: 'Security', icon: <Shield size={13} />, color: '#f43f5e' },
    { key: 'performanceIssues', label: 'Performance', icon: <TrendingUp size={13} />, color: 'var(--info)' },
  ];

  const hasAny = CATEGORIES.some(c => data[c.key]?.length > 0);

  return (
    <div className={styles.issuesPanel}>
      <div className={styles.issuesPanelHeader}>
        <Bug size={18} /><span>Bug Detection Report</span>
      </div>
      {!hasAny ? (
        <div className={styles.noIssues}>
          <CheckCircle2 size={32} />
          <span>No issues detected — code looks clean!</span>
        </div>
      ) : (
        <div className={styles.issueCategories}>
          {CATEGORIES.map(({ key, label, icon, color }) =>
            data[key]?.length > 0 ? (
              <div key={key} className={styles.issueCategory} style={{ '--cat-color': color }}>
                <div className={styles.issueCategoryHeader}>
                  {icon}<span>{label}</span>
                  <span className={styles.issueBadge}>{data[key].length}</span>
                </div>
                <ul>
                  {data[key].map((item, i) => (
                    <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

function ComplexityBadge({ icon, label, value }) {
  return (
    <div className={styles.complexityBadge}>
      <span className={styles.complexityIcon}>{icon}</span>
      <div>
        <span className={styles.complexityLabel}>{label} Complexity</span>
        <span className={styles.complexityValue}>{value || 'N/A'}</span>
      </div>
    </div>
  );
}

function ScoreCard({ label, score, icon }) {
  const pct = Math.min(100, Math.max(0, Number(score) || 0));
  const color = pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--error)';
  const grade = pct >= 90 ? 'A' : pct >= 75 ? 'B' : pct >= 60 ? 'C' : pct >= 40 ? 'D' : 'F';
  return (
    <div className={styles.scoreCard}>
      <div className={styles.scoreCardTop}>
        <span className={styles.scoreIcon}>{icon}</span>
        <span className={styles.scoreLabel}>{label}</span>
        <span className={styles.scoreGrade} style={{ color }}>{grade}</span>
      </div>
      <div className={styles.scoreBarTrack}>
        <div className={styles.scoreBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.scoreValue} style={{ color }}>{pct}/100</span>
    </div>
  );
}

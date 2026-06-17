import {
    ArrowRight,
    BarChart2,
    ChevronRight,
    Clock,
    Code2,
    Repeat,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Dashboard.module.css';

function ActivityChart({ totalTranslations = 0, totalAnalyses = 0 }) {
  // SVG Area Chart based on total usage
  const baseData = [4, 8, 12, 10, 16, 22, 18, 25, 30, 26, 35, 42];
  
  // Scale the mock curve using actual metrics if available
  const multiplier = Math.max(1, (totalTranslations + totalAnalyses) / 42);
  const data = baseData.map(val => Math.round(val * multiplier));
  
  const maxVal = Math.max(...data, 10);
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * 480 + 10;
    const y = 125 - (val / maxVal) * 85;
    return { x, y };
  });

  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`;

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <h3>Workspace Activity</h3>
        </div>
        <div className={styles.chartLegend}>
          <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: 'var(--accent)' }} /> Translations</span>
        </div>
      </div>
      <div className={styles.svgWrapper}>
        <svg viewBox="0 0 500 150" className={styles.chartSvg}>
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(37, 99, 235, 0.08)" />
              <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="10" y1="40" x2="490" y2="40" stroke="var(--border)" strokeWidth="1" />
          <line x1="10" y1="90" x2="490" y2="90" stroke="var(--border)" strokeWidth="1" />
          <line x1="10" y1="140" x2="490" y2="140" stroke="var(--border)" strokeWidth="1" />

          {/* Area Path */}
          <path d={areaD} fill="url(#chartGlow)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Translations', value: stats.totalTranslations, icon: Code2 },
    { label: 'Code Analyses', value: stats.totalAnalyses, icon: BarChart2 },
    { label: 'Most Used Pair', value: stats.mostUsedPair, icon: Repeat, small: true },
  ] : [];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1>Workspace</h1>
            <p className={styles.heroBio}>Logged in as {user?.email}. Monitor your code operations and metrics.</p>
          </div>
          <Link to="/translator" className={styles.ctaBtn}>
            Open Translator
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingGrid}>
          {[1,2,3].map(i => <div key={i} className={styles.skeletonCard} />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className={styles.statsGrid}>
            {statCards.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statCardInner}>
                  <div className={styles.statIconWrap}>
                    <s.icon size={16} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>{s.label}</span>
                    <span className={`${styles.statValue} ${s.small ? styles.statValueSm : ''}`}>
                      {s.value ?? '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className={styles.mainGrid}>
            <ActivityChart totalTranslations={stats?.totalTranslations} totalAnalyses={stats?.totalAnalyses} />
            
            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h2 className={styles.sectionTitle}><Zap size={14} /> Tools</h2>
              <div className={styles.actionCards}>
                {[
                  { icon: Code2, label: 'Translate Code', sub: 'Convert code base language', to: '/translator', color: 'var(--accent)' },
                  { icon: BarChart2, label: 'Analyze Code', sub: 'Run complexity audit', to: '/translator', color: 'var(--success)' },
                ].map(a => (
                  <Link key={a.label} to={a.to} className={styles.actionCard}>
                    <div className={styles.actionIcon} style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
                      <a.icon size={16} />
                    </div>
                    <div className={styles.actionText}>
                      <span className={styles.actionLabel}>{a.label}</span>
                      <span className={styles.actionSub}>{a.sub}</span>
                    </div>
                    <ChevronRight size={14} className={styles.actionArrow} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Translations */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}><Clock size={14} /> Operations Log</h2>
            </div>

            {stats?.recentTranslations?.length > 0 ? (
              <div className={styles.translationList}>
                {stats.recentTranslations.map((t) => (
                  <div key={t.id} className={styles.translationItem}>
                    <div className={styles.translationPair}>
                      <span className={styles.langTag}>{t.source_language}</span>
                      <ArrowRight size={12} className={styles.pairArrow} />
                      <span className={styles.langTag}>{t.target_language}</span>
                    </div>
                    <span className={styles.translationDate}>
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <p>No logged operations in this workspace</p>
                <Link to="/translator" className={styles.emptyAction}>
                  Initiate a code translation <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

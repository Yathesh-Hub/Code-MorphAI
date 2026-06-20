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

import { Code2, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/translator', label: 'Translator', icon: Code2 },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <Code2 size={22} />
          <span>CodeMorph AI</span>
        </Link>

        <div className={styles.links}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={`${styles.link} ${location.pathname === to ? styles.active : ''}`}>
              <Icon size={15} />{label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          <div className={styles.userBadge}>
            <div className={styles.avatar}>{initials}</div>
            <span className={styles.username}>{user?.name}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
            <LogOut size={17} />
          </button>
        </div>

        <button className={styles.menuBtn} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={styles.mobile}>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`${styles.mobileLink} ${location.pathname === to ? styles.active : ''}`}
              onClick={() => setOpen(false)}>
              <Icon size={16} />{label}
            </Link>
          ))}
          <button onClick={handleLogout} className={styles.mobileLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}

import { Calendar, LogOut, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Profile</h1>

      <Card className={styles.card}>
        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.name}>{user?.name}</div>
        <div className={styles.email}>{user?.email}</div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <User size={16} />
            <div>
              <span className={styles.fieldLabel}>Full Name</span>
              <span className={styles.fieldValue}>{user?.name}</span>
            </div>
          </div>
          <div className={styles.field}>
            <Mail size={16} />
            <div>
              <span className={styles.fieldLabel}>Email Address</span>
              <span className={styles.fieldValue}>{user?.email}</span>
            </div>
          </div>
          <div className={styles.field}>
            <Calendar size={16} />
            <div>
              <span className={styles.fieldLabel}>Member Since</span>
              <span className={styles.fieldValue}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <Button variant="danger" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16} /> Sign Out
        </Button>
      </Card>
    </div>
  );
}

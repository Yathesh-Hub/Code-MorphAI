import styles from './Card.module.css';

export default function Card({ children, className = '', title, icon }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || icon) && (
        <div className={styles.header}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
}

import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', loading = false, icon, ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function SuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🎉</div>
        <h1 className={styles.title}>Welcome to Pro!</h1>
        <p className={styles.message}>
          Your payment was successful and your account has been upgraded. You now have access to all Pro features!
        </p>

        <div className={styles.steps}>
          <h2 className={styles.stepsTitle}>What's Next?</h2>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <span>Download the Tymli desktop app if you haven't already</span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <span>Log in with the same account you used to upgrade</span>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <span>All Pro features are now unlocked and ready to use!</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/download" className={`${styles.button} ${styles.buttonPrimary}`}>
            Download Desktop App
          </Link>
          <Link href="/account" className={`${styles.button} ${styles.buttonSecondary}`}>
            Go to Account
          </Link>
        </div>
      </div>
    </div>
  );
}

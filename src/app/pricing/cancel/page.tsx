'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function CancelPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>💭</div>
        <h1 className={styles.title}>Payment Canceled</h1>
        <p className={styles.message}>
          No worries! Your payment was canceled and you haven't been charged. 
          You can try again anytime or continue using Tymli's free features.
        </p>

        <div className={styles.actions}>
          <Link href="/pricing" className={`${styles.button} ${styles.buttonPrimary}`}>
            Back to Pricing
          </Link>
          <Link href="/" className={`${styles.button} ${styles.buttonSecondary}`}>
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { openCheckout, getPrices } from '@/lib/paddle';
import styles from './page.module.css';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [prices, setPrices] = useState<{ monthly: string; annual: string } | null>(null);

  useEffect(() => {
    // Fetch price IDs
    const token = localStorage.getItem('auth_token');
    if (token) {
      getPrices(token).then(setPrices).catch(console.error);
    }
  }, []);

  const handleUpgrade = async (priceType: 'monthly' | 'annual') => {
    try {
      setLoading(priceType);

      // Check if user has token (is logged in)
      const token = localStorage.getItem('auth_token');

      if (!token) {
        // Redirect to auth flow
        alert('Please log in first. You\'ll be redirected to authentication.');
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
        return;
      }

      // Get user info
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      const user = userData.data;

      if (!prices) {
        throw new Error('Price IDs not loaded');
      }

      // Open Paddle checkout
      const priceId = priceType === 'monthly' ? prices.monthly : prices.annual;
      await openCheckout(priceId, user.id.toString(), user.email);
      
      setLoading(null);
    } catch (error: any) {
      console.error('Upgrade error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Choose Your Plan</h1>
          <p className={styles.subtitle}>
            Start free, upgrade anytime. No credit card required to start.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className={styles.pricingCards}>
          {/* Free Plan */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.planName}>Free</h2>
              <p className={styles.planDescription}>Perfect for trying out Tymli</p>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span>0</span>
                <span className={styles.period}>/forever</span>
              </div>
            </div>

            <ul className={styles.features}>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>7-day activity history</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Basic time tracking</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Basic analytics</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>App categorization</span>
              </li>
            </ul>

            <button
              className={styles.ctaButton}
              onClick={() => router.push('/download')}
            >
              Get Started Free
            </button>
          </div>

          {/* Monthly Plan */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.planName}>Pro Monthly</h2>
              <p className={styles.planDescription}>Full access, billed monthly</p>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span>9.99</span>
                <span className={styles.period}>/month</span>
              </div>
            </div>

            <ul className={styles.features}>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Unlimited history</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Full app blocking</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Advanced focus mode</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Distraction detection</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>In-app feature blocking</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Priority support</span>
              </li>
            </ul>

            <button
              className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
              onClick={() => handleUpgrade('monthly')}
              disabled={loading === 'monthly'}
            >
              {loading === 'monthly' ? 'Loading...' : 'Upgrade to Monthly'}
            </button>
          </div>

          {/* Annual Plan */}
          <div className={`${styles.card} ${styles.cardPopular}`}>
            <span className={styles.popularBadge}>Best Value</span>

            <div className={styles.cardHeader}>
              <h2 className={styles.planName}>Pro Annual</h2>
              <p className={styles.planDescription}>Full access, billed yearly</p>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span>99</span>
                <span className={styles.period}>/year</span>
              </div>
              <div className={styles.savings}>Save $20/year (17% off)</div>
            </div>

            <ul className={styles.features}>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Unlimited history</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Full app blocking</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Advanced focus mode</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Distraction detection</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>In-app feature blocking</span>
              </li>
              <li className={styles.feature}>
                <span className={styles.checkIcon}>✓</span>
                <span>Priority support</span>
              </li>
            </ul>

            <button
              className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
              onClick={() => handleUpgrade('annual')}
              disabled={loading === 'annual'}
            >
              {loading === 'annual' ? 'Loading...' : 'Upgrade to Annual'}
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className={styles.comparison}>
          <h2 className={styles.comparisonTitle}>Feature Comparison</h2>

          <div className={styles.comparisonTable}>
            <div className={`${styles.tableRow} ${styles.tableHeader}`}>
              <div className={styles.tableCell}>Feature</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>Free</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>Pro</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Activity History</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>7 days</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>Unlimited</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Time Tracking</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>App Categorization</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Basic Analytics</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>App Blocking</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>—</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Focus Mode</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>—</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Distraction Detection</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>—</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>In-App Blocking (Instagram/YouTube)</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>—</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.tableCell}>Priority Support</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>—</div>
              <div className={`${styles.tableCell} ${styles.tableCellCenter}`}>✓</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Can I try Pro features before paying?</h3>
            <p className={styles.faqAnswer}>
              Yes! Start with the free plan and upgrade anytime. You'll only be charged when you choose to upgrade to Pro.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>What payment methods do you accept?</h3>
            <p className={styles.faqAnswer}>
              We accept all major credit/debit cards (Visa, Mastercard, Amex) worldwide. For users in India, we also support UPI payments.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Can I cancel anytime?</h3>
            <p className={styles.faqAnswer}>
              Absolutely. You can cancel your subscription at any time from your account settings. You'll keep Pro access until the end of your billing period, then automatically switch to the Free plan.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>What happens to my data if I downgrade?</h3>
            <p className={styles.faqAnswer}>
              Your data is never deleted. If you downgrade to Free, you'll only be able to view the last 7 days of history, but all your data remains stored. Upgrade again anytime to access your full history.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Do you offer refunds?</h3>
            <p className={styles.faqAnswer}>
              Yes, we offer a 14-day money-back guarantee. If you're not satisfied, contact us within 14 days of purchase for a full refund.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Is my payment information secure?</h3>
            <p className={styles.faqAnswer}>
              Yes. All payments are processed by Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide. We never store your payment information on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cancelSubscription, getUpdatePaymentUrl } from '@/lib/paddle';
import styles from './page.module.css';

interface UserData {
  name: string;
  email: string;
  plan_type: string;
  plan_status: string;
  is_pro: boolean;
  cancel_at_period_end: boolean;
  plan_expires_at: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Not authenticated');
      }

      // For Paddle, we can either:
      // 1. Build custom management UI
      // 2. Open update payment URL
      // For now, let's provide cancel option
      const confirmCancel = confirm('Do you want to cancel your subscription? You\'ll keep access until the end of your billing period.');
      
      if (confirmCancel) {
        await cancelSubscription(token);
        alert('Subscription will be canceled at the end of your billing period.');
        await fetchUserData(); // Refresh data
      }
      
      setPortalLoading(false);
    } catch (err: any) {
      alert(err.message || 'Failed to manage subscription');
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading account data...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.error}>
            {error || 'Failed to load account data'}
          </div>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => router.push('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const planName = user.plan_type === 'free' 
    ? 'Free' 
    : user.plan_type === 'pro_monthly' 
    ? 'Pro Monthly' 
    : 'Pro Annual';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.subtitle}>Manage your subscription and account settings</p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
          
          <div className={styles.planDetails}>
            <div className={styles.planDetail}>
              <span className={styles.planLabel}>Name</span>
              <span className={styles.planValue}>{user.name}</span>
            </div>
            <div className={styles.planDetail}>
              <span className={styles.planLabel}>Email</span>
              <span className={styles.planValue}>{user.email}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription</h2>

          <div
            className={`${styles.planBadge} ${
              user.is_pro ? styles.planBadgePro : styles.planBadgeFree
            }`}
          >
            {planName}
          </div>

          <div className={styles.planDetails}>
            <div className={styles.planDetail}>
              <span className={styles.planLabel}>Status</span>
              <span className={styles.planValue}>
                {user.plan_status === 'active' ? 'Active' : user.plan_status}
              </span>
            </div>

            {user.is_pro && user.plan_expires_at && (
              <div className={styles.planDetail}>
                <span className={styles.planLabel}>
                  {user.cancel_at_period_end ? 'Expires' : 'Renews'}
                </span>
                <span className={styles.planValue}>
                  {new Date(user.plan_expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {user.cancel_at_period_end && (
              <div className={styles.planDetail}>
                <span className={styles.planLabel}>Note</span>
                <span className={styles.planValue} style={{ color: '#ef4444' }}>
                  Subscription will cancel at period end
                </span>
              </div>
            )}
          </div>

          {user.is_pro ? (
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? 'Loading...' : 'Manage Subscription'}
            </button>
          ) : (
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => router.push('/pricing')}
            >
              Upgrade to Pro
            </button>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Downloads</h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>
            Download the Tymli desktop app to start tracking your productivity
          </p>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={() => router.push('/download')}
          >
            Download Desktop App
          </button>
        </div>
      </div>
    </div>
  );
}

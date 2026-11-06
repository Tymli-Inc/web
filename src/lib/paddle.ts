import { initializePaddle, type Paddle } from '@paddle/paddle-js';

let paddleInstance: Paddle | null = null;

export async function initPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance;
  }

  const token = process.env.NEXT_PUBLIC_PADDLE_TOKEN;
  const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production' || 'sandbox';

  if (!token) {
    console.error('NEXT_PUBLIC_PADDLE_TOKEN is not set');
    return null;
  }

  try {
    paddleInstance = await initializePaddle({
      environment,
      token,
    });

    return paddleInstance;
  } catch (error) {
    console.error('Failed to initialize Paddle:', error);
    return null;
  }
}

export async function openCheckout(priceId: string, userId: string, userEmail: string) {
  const paddle = await initPaddle();
  
  if (!paddle) {
    throw new Error('Failed to initialize Paddle');
  }

  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: {
      email: userEmail,
    },
    customData: {
      userId,
    },
    settings: {
      displayMode: 'overlay',
      theme: 'dark',
      locale: 'en',
    },
    successCallback: (data) => {
      // Redirect to success page
      window.location.href = '/pricing/success';
    },
  });
}

export async function getPrices(token: string): Promise<{ monthly: string; annual: string }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const response = await fetch(`${apiUrl}/api/v1/paddle/get-prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get prices');
  }

  const data = await response.json();
  return data.data;
}

export async function getSubscriptionStatus(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const response = await fetch(`${apiUrl}/api/v1/paddle/subscription-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get subscription status');
  }

  const data = await response.json();
  return data.data;
}

export async function cancelSubscription(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const response = await fetch(`${apiUrl}/api/v1/paddle/cancel-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel subscription');
  }

  const data = await response.json();
  return data.data;
}

export async function getUpdatePaymentUrl(token: string): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const response = await fetch(`${apiUrl}/api/v1/paddle/update-payment-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get payment update URL');
  }

  const data = await response.json();
  return data.data.url;
}

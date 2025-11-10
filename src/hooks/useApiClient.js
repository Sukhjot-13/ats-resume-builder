
"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const setCookie = (name, value, options = {}) => {
  if (typeof document === 'undefined') return;
  let cookieString = `${name}=${value}`;
  for (const key in options) {
    cookieString += `; ${key}=${options[key]}`;
  }
  document.cookie = cookieString;
};

export function useApiClient() {
  const router = useRouter();

  const refreshTokenFn = useCallback(async () => {
    logger.info({ file: 'src/hooks/useApiClient.js', function: 'refreshToken' }, 'Attempting to refresh token');

    const response = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      logger.error({ file: 'src/hooks/useApiClient.js', function: 'refreshToken', status: response.status }, 'Failed to refresh token');
      throw new Error('Failed to refresh token');
    }

    const { newAccessToken } = await response.json();
    setCookie('accessToken', newAccessToken, { path: '/', maxAge: 300 }); // 5 minutes
    logger.info({ file: 'src/hooks/useApiClient.js', function: 'refreshToken' }, 'Token refreshed successfully');
    return newAccessToken;
  }, []);

  const apiClient = useCallback(async (url, options = {}) => {
    logger.info({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url, options }, 'Making API call');
    let accessToken = getCookie('accessToken');

    const headers = {
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logger.warn({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url }, 'Access token expired, attempting to refresh');
      try {
        const newAccessToken = await refreshTokenFn();
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, { ...options, headers }); // Retry the request
        logger.info({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url }, 'Retried request with new access token');
      } catch (error) {
        logger.error({ file: 'src/hooks/useApiClient.js', function: 'apiClient', error: error.message }, 'Refresh token failed, logging out');
        // Redirect to login if refresh fails
        router.push('/login');
        // Return the original failed response to avoid processing it further
        return response;
      }
    }

    return response;
  }, [refreshTokenFn, router]);

  return apiClient;
}

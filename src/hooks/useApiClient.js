
"use client";

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

const getCookie = (name) => {
  if (typeof document === 'undefined') {
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'getCookie' }, 'Cannot get cookie in non-browser environment');
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop().split(';').shift();
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'getCookie', name, value: cookieValue }, 'Got cookie');
    return cookieValue;
  }
  logger.debug({ file: 'src/hooks/useApiClient.js', function: 'getCookie', name }, 'Cookie not found');
  return null;
};

const setCookie = (name, value, options = {}) => {
  if (typeof document === 'undefined') {
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'setCookie' }, 'Cannot set cookie in non-browser environment');
    return;
  }
  let cookieString = `${name}=${value}`;
  for (const key in options) {
    cookieString += `; ${key}=${options[key]}`;
  }
  document.cookie = cookieString;
  logger.debug({ file: 'src/hooks/useApiClient.js', function: 'setCookie', name, value, options }, 'Set cookie');
};

export function useApiClient() {
  const router = useRouter();

  const refreshTokenFn = useCallback(async () => {
    logger.info({ file: 'src/hooks/useApiClient.js', function: 'refreshTokenFn' }, 'Attempting to refresh token');

    const response = await fetch('/api/auth/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'refreshTokenFn', status: response.status }, 'Refresh token response received');

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error({ file: 'src/hooks/useApiClient.js', function: 'refreshTokenFn', status: response.status, body: errorBody }, 'Failed to refresh token');
      throw new Error('Failed to refresh token');
    }

    const { newAccessToken } = await response.json();
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'refreshTokenFn', newAccessToken: newAccessToken ? 'present' : 'missing' }, 'Parsed new access token');
    setCookie('accessToken', newAccessToken, { path: '/', maxAge: 300 }); // 5 minutes
    logger.info({ file: 'src/hooks/useApiClient.js', function: 'refreshTokenFn' }, 'Token refreshed successfully');
    return newAccessToken;
  }, []);

  const apiClient = useCallback(async (url, options = {}) => {
    logger.info({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url, options }, 'Making API call');
    let accessToken = getCookie('accessToken');
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'apiClient', accessToken: accessToken ? 'present' : 'missing' }, 'Initial access token');

    const headers = {
      ...options.headers,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });
    logger.debug({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url, status: response.status }, 'Initial API call response');

    if (response.status === 401) {
      logger.warn({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url }, 'Access token expired or invalid, attempting to refresh');
      try {
        const newAccessToken = await refreshTokenFn();
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        logger.debug({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url }, 'Retrying request with new access token');
        response = await fetch(url, { ...options, headers }); // Retry the request
        logger.info({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url, status: response.status }, 'Retried request response');
      } catch (error) {
        logger.error({ file: 'src/hooks/useApiClient.js', function: 'apiClient', error: error }, 'Refresh token failed, logging out');
        // Redirect to login if refresh fails
        router.push('/login');
        // Return the original failed response to avoid processing it further
        return response;
      }
    }

    logger.info({ file: 'src/hooks/useApiClient.js', function: 'apiClient', url }, 'API call finished');
    return response;
  }, [refreshTokenFn, router]);

  return apiClient;
}

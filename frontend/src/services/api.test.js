import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';

const MOCK_BASE = '/api';

// Need to mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getLinkToken', () => {
    it('returns a link token on success', async () => {
      const mockToken = 'link-sandbox-123';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ link_token: mockToken }),
      });

      const token = await api.getLinkToken();
      expect(token).toBe(mockToken);
      expect(global.fetch).toHaveBeenCalledWith(`${MOCK_BASE}/plaid/link-token`, { method: 'POST' });
    });

    it('throws an error with detail message on failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Invalid request' }),
      });

      await expect(api.getLinkToken()).rejects.toThrow('Invalid request');
    });

    it('throws a default error message when no detail is provided', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(api.getLinkToken()).rejects.toThrow('failed to get link token');
    });
  });

  describe('exchangePublicToken', () => {
    const mockPublicToken = 'public-sandbox-123';

    it('returns data on success', async () => {
      const mockData = { success: true };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await api.exchangePublicToken(mockPublicToken);
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(`${MOCK_BASE}/plaid/exchange-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: mockPublicToken }),
      });
    });

    it('throws an error on failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Token exchange failed' }),
      });

      await expect(api.exchangePublicToken(mockPublicToken)).rejects.toThrow('Token exchange failed');
    });
  });

  describe('getTransactions', () => {
    it('returns transactions on success', async () => {
      const mockTransactions = [{ id: 1, amount: 100 }, { id: 2, amount: -50 }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactions: mockTransactions }),
      });

      const transactions = await api.getTransactions();
      expect(transactions).toEqual(mockTransactions);
      expect(global.fetch).toHaveBeenCalledWith(`${MOCK_BASE}/plaid/transactions`);
    });

    it('throws an error on failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(api.getTransactions()).rejects.toThrow('failed to fetch transactions');
    });
  });

  describe('getInsights', () => {
    it('returns insights data on success', async () => {
      const mockInsights = { insights: ['You spend a lot on food.'] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockInsights,
      });

      const insights = await api.getInsights();
      expect(insights).toEqual(mockInsights);
      expect(global.fetch).toHaveBeenCalledWith(`${MOCK_BASE}/insights`);
    });

    it('throws an error on failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Analysis failed' }),
      });

      await expect(api.getInsights()).rejects.toThrow('Analysis failed');
    });
  });

  describe('disconnect', () => {
    it('resolves without error on success', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
      });

      await expect(api.disconnect()).resolves.toBeUndefined();
      expect(global.fetch).toHaveBeenCalledWith(`${MOCK_BASE}/plaid/disconnect`, { method: 'POST' });
    });

    it('throws an error on failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.disconnect()).rejects.toThrow('failed to disconnect');
    });
  });

  describe('askQuestion', () => {
    const mockQuestion = 'How much did I spend on food?';

    it('returns a response on success', async () => {
      const mockResponse = 'You spent $200 on food.';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ response: mockResponse }),
      });

      const response = await api.askQuestion(mockQuestion);
      expect(response).toBe(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(`${MOCK_BASE}/insights/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: mockQuestion }),
      });
    });

    it('throws an error on failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ detail: 'Chat error' }),
      });

      await expect(api.askQuestion(mockQuestion)).rejects.toThrow('Chat error');
    });
  });
});

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

type MockOptions<TRes> = {
  mock?: boolean;
  delayMs?: number;
  resolver?: () => TRes;
};

const simulateMock = async <TRes>(opts?: MockOptions<TRes>): Promise<TRes> => {
  const delay = opts?.delayMs ?? 1000;
  await new Promise((r) => setTimeout(r, delay));
  return opts?.resolver ? opts.resolver() : ({} as TRes);
};

export const api = {
  client,
  get: async <TRes>(url: string, config?: AxiosRequestConfig, mock?: MockOptions<TRes>): Promise<TRes> => {
    if (mock?.mock) return simulateMock<TRes>(mock);
    const res: AxiosResponse<TRes> = await client.get(url, config);
    return res.data;
  },
  post: async <TReq, TRes>(url: string, data: TReq, config?: AxiosRequestConfig, mock?: MockOptions<TRes>): Promise<TRes> => {
    if (mock?.mock) return simulateMock<TRes>(mock);
    const res: AxiosResponse<TRes> = await client.post(url, data, config);
    return res.data;
  }
};
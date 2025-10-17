import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
  if (newToken) localStorage.setItem('auth_token', newToken);
  else localStorage.removeItem('auth_token');
};

export const getAuthToken = () => {
  if (token) return token;
  token = localStorage.getItem('auth_token');
  return token;
};

export const clearAuthToken = () => {
  token = null;
  localStorage.removeItem('auth_token');
};

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// client.interceptors.request.use((config) => {
//   const auth = getAuthToken();
//   if (auth && config.headers) {
//     config.headers['Authorization'] = `Bearer ${auth}`;
//   }
//   return config;
// });

// client.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error?.response?.status === 401) {
//       clearAuthToken();
//       // Optional: trigger app-level signout or redirect here
//     }
//     return Promise.reject(error);
//   }
// );

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
  },
  put: async <TReq, TRes>(url: string, data: TReq, config?: AxiosRequestConfig, mock?: MockOptions<TRes>): Promise<TRes> => {
    if (mock?.mock) return simulateMock<TRes>(mock);
    const res: AxiosResponse<TRes> = await client.put(url, data, config);
    return res.data;
  },
  patch: async <TReq, TRes>(url: string, data: TReq, config?: AxiosRequestConfig, mock?: MockOptions<TRes>): Promise<TRes> => {
    if (mock?.mock) return simulateMock<TRes>(mock);
    const res: AxiosResponse<TRes> = await client.patch(url, data, config);
    return res.data;
  },
  delete: async <TRes>(url: string, config?: AxiosRequestConfig, mock?: MockOptions<TRes>): Promise<TRes> => {
    if (mock?.mock) return simulateMock<TRes>(mock);
    const res: AxiosResponse<TRes> = await client.delete(url, config);
    return res.data;
  },
};
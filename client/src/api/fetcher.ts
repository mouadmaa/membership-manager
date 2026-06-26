const API_URL = import.meta.env.VITE_API_URL;

export const TOKEN_KEY = 'auth_token';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.message || 'Request failed',
      res.status,
      data.errors,
    );
  }

  return data;
}

function apiUrl(path: string): string {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export const getFetcher = (path: string) =>
  fetch(apiUrl(path), { headers: authHeaders() }).then(handleResponse);

export const postFetcher = (path: string, body: unknown) =>
  fetch(apiUrl(path), {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const putFetcher = (path: string, body: unknown) =>
  fetch(apiUrl(path), {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const deleteFetcher = (path: string) =>
  fetch(apiUrl(path), {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse);

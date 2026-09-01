export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export const BACKEND_ORIGIN = "";

const API_URL = API_BASE_URL;

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  profile: {
    get: () => fetchAPI<any>("/profile"),
    update: (data: any) =>
      fetchAPI<any>("/profile", { method: "PUT", body: JSON.stringify(data) }),
  },

  projects: {
    getAll: () => fetchAPI<any[]>("/projects"),
    getOne: (id: string) => fetchAPI<any>(`/projects/${id}`),
    create: (data: any) =>
      fetchAPI<any>("/projects", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<any>(`/projects/${id}`, { method: "DELETE" }),
  },

  certificates: {
    getAll: () => fetchAPI<any[]>("/certificates"),
    create: (data: any) =>
      fetchAPI<any>("/certificates", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/certificates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<any>(`/certificates/${id}`, { method: "DELETE" }),
  },

  skills: {
    getAll: () => fetchAPI<any[]>("/skills"),
    create: (data: any) =>
      fetchAPI<any>("/skills", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      fetchAPI<any>(`/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      fetchAPI<any>(`/skills/${id}`, { method: "DELETE" }),
  },

  auth: {
    login: (email: string, password: string) =>
      fetchAPI<any>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => fetchAPI<any>("/auth/logout", { method: "POST" }),
    me: () => fetchAPI<any>("/auth/me"),
  },

  metrics: {
    get: () => fetchAPI<any>("/metrics"),
    track: (event: string, metadata?: any) =>
      fetchAPI<any>("/metrics/track", {
        method: "POST",
        body: JSON.stringify({ event, metadata }),
      }),
  },
};

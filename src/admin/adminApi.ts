const API = import.meta.env.VITE_API_BASE_URL || 'https://api.60frameworks.com/api/v1';

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'API error');
  return json;
}

export const adminApi = {
  // Authentication & Users
  login: (email?: string, password?: string) =>
    apiFetch<any>('/admin-users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getUsers: () => apiFetch<any>('/admin-users'),
  createUser: (data: any) =>
    apiFetch<any>('/admin-users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) =>
    apiFetch<any>(`/admin-users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string) =>
    apiFetch<any>(`/admin-users/${id}`, { method: 'DELETE' }),

  // Theme & Section Colors
  getTheme: () => apiFetch<any>('/theme'),
  updateTheme: (data: any) =>
    apiFetch<any>('/theme', { method: 'PUT', body: JSON.stringify(data) }),

  // Audit Logs
  getLogs: (limit = 100) => apiFetch<any>(`/audit-logs?limit=${limit}`),
  createLog: (data: any) =>
    apiFetch<any>('/audit-logs', { method: 'POST', body: JSON.stringify(data) }),

  // Homepage content
  getContent: () => apiFetch<any>('/content'),
  updateContent: (data: any) =>
    apiFetch<any>('/content', { method: 'PUT', body: JSON.stringify(data) }),

  // Projects
  getProjects: () => apiFetch<any>('/projects?limit=50'),
  createProject: (data: any) =>
    apiFetch<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) =>
    apiFetch<any>(`/projects/id/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    apiFetch<any>(`/projects/id/${id}`, { method: 'DELETE' }),

  // Services
  getServices: () => apiFetch<any>('/services'),
  createService: (data: any) =>
    apiFetch<any>('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) =>
    apiFetch<any>(`/services/id/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) =>
    apiFetch<any>(`/services/id/${id}`, { method: 'DELETE' }),

  // Sectors
  getSectors: () => apiFetch<any>('/sectors'),
  createSector: (data: any) =>
    apiFetch<any>('/sectors', { method: 'POST', body: JSON.stringify(data) }),
  updateSector: (id: string, data: any) =>
    apiFetch<any>(`/sectors/id/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSector: (id: string) =>
    apiFetch<any>(`/sectors/id/${id}`, { method: 'DELETE' }),

  // Clients
  getClients: () => apiFetch<any>('/clients'),
  createClient: (data: any) =>
    apiFetch<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) =>
    apiFetch<any>(`/clients/id/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id: string) =>
    apiFetch<any>(`/clients/id/${id}`, { method: 'DELETE' }),

  // Testimonials
  getTestimonials: () => apiFetch<any>('/testimonials'),
  createTestimonial: (data: any) =>
    apiFetch<any>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (id: string, data: any) =>
    apiFetch<any>(`/testimonials/id/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (id: string) =>
    apiFetch<any>(`/testimonials/id/${id}`, { method: 'DELETE' }),

  // Contact submissions
  getSubmissions: () => apiFetch<any>('/contact/submissions'),
  updateSubmissionStatus: (id: string, status: string) =>
    apiFetch<any>(`/contact/submissions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Upload media
  uploadMedia: (filename: string, fileData: string, contentType: string) =>
    apiFetch<any>('/upload', {
      method: 'POST',
      body: JSON.stringify({ filename, fileData, contentType }),
    }),
};

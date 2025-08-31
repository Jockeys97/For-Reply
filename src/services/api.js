import { useDataStore } from '../store/useDataStore.js';
import { mapClient, mapProject, mapTicket } from './map.js';

const BASE_URL = import.meta.env.VITE_API_BASE || 'https://jsonplaceholder.typicode.com';

async function safeFetch(url, { signal } = {}) {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status}`);
  }
  return res.json();
}

export async function getClients({ signal } = {}) {
  const data = await safeFetch(`${BASE_URL}/users`, { signal });
  return data.map(mapClient);
}

export async function getProjects({ signal } = {}) {
  const data = await safeFetch(`${BASE_URL}/posts`, { signal });
  return data.map(mapProject);
}

export async function getTickets({ signal } = {}) {
  const data = await safeFetch(`${BASE_URL}/comments`, { signal });
  return data.map(mapTicket);
}

export async function getClientById(id, { signal } = {}) {
  const data = await safeFetch(`${BASE_URL}/users/${id}`, { signal });
  return mapClient(data);
}

export async function getProjectsByClient(clientId, { signal } = {}) {
  const data = await safeFetch(`${BASE_URL}/posts?userId=${clientId}`, { signal });
  return data.map(mapProject);
}

export async function getTicketsByProject(projectId, { signal } = {}) {
  const data = await safeFetch(`${BASE_URL}/comments?postId=${projectId}`, { signal });
  return data.map(mapTicket);
}

// High-level helpers leveraging zustand cache
export async function ensureAllDataLoaded(controller = new AbortController()) {
  const { cache, setCache, localTickets } = useDataStore.getState();
  if (cache.clients && cache.projects && cache.tickets) {
    return { clients: cache.clients, projects: cache.projects, tickets: cache.tickets.concat(localTickets) };
  }
  try {
    const [clients, projects, tickets] = await Promise.all([
      cache.clients ? Promise.resolve(cache.clients) : getClients({ signal: controller.signal }),
      cache.projects ? Promise.resolve(cache.projects) : getProjects({ signal: controller.signal }),
      cache.tickets ? Promise.resolve(cache.tickets) : getTickets({ signal: controller.signal }),
    ]);
    setCache((prev) => ({ ...prev, clients, projects, tickets }));
    return { clients, projects, tickets: tickets.concat(localTickets) };
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw e;
  }
}



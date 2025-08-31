import { describe, it, expect, vi, afterEach } from 'vitest';
import { getClients, getProjects, getTickets } from './api.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api', () => {
  it('maps clients correctly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: 1, name: 'Foo', email: 'foo@bar', company: { name: 'ACME' }, address: { city: 'Rome' } }]) }));
    const clients = await getClients();
    expect(clients[0]).toMatchObject({ id: 1, name: 'Foo', email: 'foo@bar', company: 'ACME', city: 'Rome' });
  });

  it('maps projects correctly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: 10, userId: 1, title: 'P', body: 'Desc' }]) }));
    const projects = await getProjects();
    expect(projects[0]).toMatchObject({ id: 10, clientId: 1, title: 'P', description: 'Desc' });
  });

  it('maps tickets with status and date', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: 5, postId: 10, name: 'Subject', email: 'req@ex', body: 'Body' }]) }));
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // force 'open'
    const tickets = await getTickets();
    expect(tickets[0]).toMatchObject({ id: 5, projectId: 10, subject: 'Subject', requester: 'req@ex', status: 'open' });
    expect(tickets[0].createdAt instanceof Date).toBe(true);
  });
});



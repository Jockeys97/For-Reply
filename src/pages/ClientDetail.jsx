import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClientById, getProjectsByClient, getTicketsByProject } from '../services/api.js';
import Skeleton from '../components/Skeleton.jsx';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [ticketsCount, setTicketsCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const c = await getClientById(id, { signal: controller.signal });
        const p = await getProjectsByClient(id, { signal: controller.signal });
        const ticketCounts = await Promise.all(p.map((proj) => getTicketsByProject(proj.id, { signal: controller.signal })));
        setClient(c);
        setProjects(p);
        setTicketsCount(ticketCounts.reduce((acc, arr) => acc + arr.length, 0));
        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [id]);

  if (loading) return <Skeleton className="h-72" />;
  if (error) return <div className="text-sm text-red-600">Errore: {String(error.message || error)}</div>;
  if (!client) return <div>Nessun cliente</div>;

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-base font-semibold">{client.name}</h2>
          <button className="px-3 py-2 rounded border" onClick={() => navigate(-1)}>Indietro</button>
        </div>
        <div className="card-body grid sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Email:</span> {client.email}</div>
          <div><span className="font-medium">Azienda:</span> {client.company}</div>
          <div><span className="font-medium">Città:</span> {client.city}</div>
          <div><span className="font-medium">Progetti:</span> {projects.length}</div>
          <div><span className="font-medium">Ticket collegati:</span> {ticketsCount}</div>
        </div>
      </section>

      <section className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Progetti</h3>
          <Link className="px-3 py-2 rounded border" to="/projects">Vedi progetti</Link>
        </div>
        <div className="card-body">
          <ul className="list-disc pl-5 text-sm space-y-1">
            {projects.map((p) => (
              <li key={p.id}>
                <Link className="text-blue-600 hover:underline" to={`/projects/${p.id}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}



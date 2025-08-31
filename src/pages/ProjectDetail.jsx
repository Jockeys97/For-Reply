import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ensureAllDataLoaded, getTicketsByProject } from '../services/api.js';
import Skeleton from '../components/Skeleton.jsx';
import Badge from '../components/Badge.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const { clients, projects } = await ensureAllDataLoaded(controller);
        const proj = projects.find((p) => String(p.id) === String(id));
        const cli = clients.find((c) => c.id === proj?.clientId);
        const t = await getTicketsByProject(id, { signal: controller.signal });
        setProject(proj);
        setClient(cli);
        setTickets(t);
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

  const statusData = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'open').length;
    const closed = tickets.length - open;
    return [
      { name: 'Aperti', value: open, color: '#34d399' },
      { name: 'Chiusi', value: closed, color: '#9ca3af' },
    ];
  }, [tickets]);

  if (loading) return <Skeleton className="h-72" />;
  if (error) return <div className="text-sm text-red-600">Errore: {String(error.message || error)}</div>;
  if (!project) return <div>Progetto non trovato</div>;

  return (
    <div className="space-y-6">
      <section className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-base font-semibold">{project.title}</h2>
          <button className="px-3 py-2 rounded border" onClick={() => navigate(-1)}>Indietro</button>
        </div>
        <div className="card-body text-sm space-y-1">
          <div><span className="font-medium">Cliente:</span> {client?.name || '—'}</div>
          <p className="pt-2 whitespace-pre-line">{project.description}</p>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ticket</h3>
        </div>
        <div className="card-body space-y-4">
          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="text-sm space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-gray-500 text-xs">{t.requester}</div>
                </div>
                <Badge color={t.status === 'open' ? 'green' : 'gray'}>{t.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}



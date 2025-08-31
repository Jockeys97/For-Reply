import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import SearchInput from '../components/SearchInput.jsx';
import Select from '../components/Select.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { ensureAllDataLoaded } from '../services/api.js';
import { includesAll } from '../utils/filters.js';
import { useNavigate } from 'react-router-dom';

export default function Projects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [client, setClient] = useState('');
  const [sort, setSort] = useState({ key: 'title', direction: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    ensureAllDataLoaded(controller)
      .then((d) => {
        setClients(d.clients);
        setProjects(d.projects);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    let res = projects;
    if (query) {
      const terms = query.split(/\s+/).filter(Boolean);
      res = res.filter((p) => includesAll(`${p.title} ${p.description}`, terms));
    }
    if (client) res = res.filter((p) => String(p.clientId) === client);
    res = [...res].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      return a[sort.key].localeCompare(b[sort.key]) * dir;
    });
    return res;
  }, [projects, query, client, sort]);

  const total = filtered.length;
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  if (loading) return <Skeleton className="h-72" />;
  if (error)
    return (
      <div className="card"><div className="card-body text-sm text-red-600">Errore: {String(error.message || error)}</div></div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Cerca titolo/descrizione" />
        <Select value={client} onChange={(v) => { setClient(v); setPage(1); }} ariaLabel="Filtro cliente">
          <option value="">Tutti i clienti</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>
      <DataTable
        columns={[
          { key: 'title', header: 'Titolo', sortable: true },
          { key: 'description', header: 'Descrizione' },
          { key: 'clientId', header: 'Cliente', render: (v) => clients.find((c) => c.id === v)?.name || '—' },
        ]}
        data={pageData}
        sort={sort}
        onSort={(key, direction) => setSort({ key, direction })}
        onRowClick={(row) => navigate(`/projects/${row.id}`)}
        pagination={{ page, pageSize, total, onPageChange: setPage }}
      />
    </div>
  );
}



import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import SearchInput from '../components/SearchInput.jsx';
import Select from '../components/Select.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { ensureAllDataLoaded } from '../services/api.js';
import { includesAll } from '../utils/filters.js';
import { useNavigate } from 'react-router-dom';

export default function Clients() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    ensureAllDataLoaded(controller)
      .then((d) => setClients(d.clients))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    let res = clients;
    if (query) {
      const terms = query.split(/\s+/).filter(Boolean);
      res = res.filter((c) => includesAll(`${c.name} ${c.email} ${c.company}`, terms));
    }
    if (city) res = res.filter((c) => c.city === city);
    res = [...res].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      return a[sort.key].localeCompare(b[sort.key]) * dir;
    });
    return res;
  }, [clients, query, city, sort]);

  const total = filtered.length;
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  const cities = useMemo(() => Array.from(new Set(clients.map((c) => c.city))), [clients]);

  if (loading) return <Skeleton className="h-72" />;
  if (error)
    return (
      <div className="card"><div className="card-body text-sm text-red-600">Errore: {String(error.message || error)}</div></div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Cerca nome/email/company" />
        <Select value={city} onChange={(v) => { setCity(v); setPage(1); }} ariaLabel="Filtro città">
          <option value="">Tutte le città</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </div>
      <DataTable
        columns={[
          { key: 'name', header: 'Nome', sortable: true },
          { key: 'email', header: 'Email' },
          { key: 'company', header: 'Azienda' },
          { key: 'city', header: 'Città', sortable: true },
        ]}
        data={pageData}
        sort={sort}
        onSort={(key, direction) => setSort({ key, direction })}
        onRowClick={(row) => navigate(`/clients/${row.id}`)}
        pagination={{ page, pageSize, total, onPageChange: setPage }}
      />
    </div>
  );
}



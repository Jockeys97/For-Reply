import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState, useMemo } from 'react';
import DataTable from '../DataTable.jsx';

function Wrapper() {
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });
  const [query, setQuery] = useState('');
  const data = [
    { name: 'Beta', email: 'b@example.com' },
    { name: 'Alpha', email: 'a@example.com' },
    { name: 'Charlie', email: 'c@example.com' },
  ];
  const filtered = useMemo(() => {
    let res = data;
    if (query) res = res.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    const dir = sort.direction === 'asc' ? 1 : -1;
    res = [...res].sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * dir);
    return res;
  }, [data, query, sort]);
  const [page, setPage] = useState(1);
  const pageSize = 2;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <DataTable
      columns={[{ key: 'name', header: 'Name', sortable: true }, { key: 'email', header: 'Email' }]}
      data={paged}
      sort={sort}
      onSort={(key, direction) => setSort({ key, direction })}
      pagination={{ page, pageSize, total: filtered.length, onPageChange: setPage }}
      showFilterInput
      filterQuery={query}
      onFilterQueryChange={setQuery}
      filterFunction={(row, q) => row.name.toLowerCase().includes(q.toLowerCase())}
    />
  );
}

describe('DataTable', () => {
  it('sorts by clicking sortable header', () => {
    render(<Wrapper />);
    const firstCellBefore = screen.getAllByRole('cell')[0];
    expect(firstCellBefore).toHaveTextContent('Alpha');
    // Click header to toggle desc
    const header = screen.getByRole('button', { name: /name/i });
    fireEvent.click(header);
    const firstCellAfter = screen.getAllByRole('cell')[0];
    expect(firstCellAfter).toHaveTextContent('Charlie');
  });

  it('filters using the built-in filter input', () => {
    render(<Wrapper />);
    const input = screen.getByRole('searchbox', { name: /filtra/i });
    fireEvent.change(input, { target: { value: 'char' } });
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Charlie');
  });

  it('paginates using Prev/Next', () => {
    render(<Wrapper />);
    const nextButtons = screen.getAllByRole('button', { name: /next/i });
    fireEvent.click(nextButtons[0]);
    const firstCell = screen.getAllByRole('cell')[0];
    expect(firstCell).toHaveTextContent('Charlie');
    const prevButtons = screen.getAllByRole('button', { name: /prev/i });
    fireEvent.click(prevButtons[0]);
    const firstCellAgain = screen.getAllByRole('cell')[0];
    expect(firstCellAgain).toHaveTextContent('Alpha');
  });
});



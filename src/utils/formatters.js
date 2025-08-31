export function formatNumber(n) {
  return new Intl.NumberFormat('it-IT').format(n);
}

export function formatDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: '2-digit' });
}

export function monthLabel(monthIndex) {
  return new Date(2000, monthIndex, 1).toLocaleDateString('it-IT', { month: 'short' });
}



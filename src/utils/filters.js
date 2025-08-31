export function normalize(s) {
  return (s || '').toString().toLowerCase();
}

export function includesAll(text, terms) {
  const t = normalize(text);
  return terms.every((term) => t.includes(normalize(term)));
}



// Mapping helpers from JSONPlaceholder data structures to domain models

function randomStatus() {
  return Math.random() < 0.7 ? 'open' : 'closed';
}

function randomDateWithinYear() {
  const now = new Date();
  const past = new Date(now);
  past.setFullYear(now.getFullYear() - 1);
  const ts = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(ts);
}

export function mapClient(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    company: u.company?.name || 'N/A',
    city: u.address?.city || 'N/A',
  };
}

export function mapProject(p) {
  return {
    id: p.id,
    clientId: p.userId,
    title: p.title,
    description: p.body,
  };
}

export function mapTicket(c) {
  const createdAt = randomDateWithinYear();
  return {
    id: c.id,
    projectId: c.postId,
    subject: c.name,
    requester: c.email,
    description: c.body,
    status: randomStatus(),
    createdAt,
    month: createdAt.getMonth(),
    year: createdAt.getFullYear(),
  };
}



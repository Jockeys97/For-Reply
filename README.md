# Consulting Dashboard (React + Vite)

Una mini-dashboard front-end che mostra dati fittizi (JSONPlaceholder) su clienti, progetti e ticket. Pensata per contesto enterprise/consulting (Reply): focus su UX pulita, componenti riusabili, performance, integrazione API e qualità.

- Demo: inserire link Vercel qui
- Repo: inserire URL del repository pubblico

## Stack
- React 18 + Vite (JS)
- React Router
- Fetch API
- Tailwind CSS
- Recharts
- Zustand
- ESLint + Prettier
- Vitest + @testing-library/react
- Dotenv (Vite `VITE_*`)
- GitHub Actions (build + test)
- Deploy: Vercel

## Architettura
```
src/
  components/ (Navbar, KpiCard, ChartCard, DataTable, DetailModal, SearchInput, Select, Badge, Skeleton)
  pages/ (Dashboard, Clients, ClientDetail, Projects, ProjectDetail, Tickets)
  services/ (api.js, map.js)
  store/ (useDataStore.js)
  utils/ (formatters.js, filters.js)
  App.jsx, main.jsx, index.css
```

- `services/api.js`: layer API verso JSONPlaceholder, con AbortController, gestione errori e cache via Zustand.
- `services/map.js`: mapping users→clienti, posts→progetti, comments→ticket. Stato ticket simulato 70/30, date generate casualmente per trend mensili.
- `store/useDataStore.js`: cache dati per sessione e dark mode con persistenza in localStorage. Supporto a creazione ticket locale.
- `components/DataTable.jsx`: tabella riusabile con sort, pagination e supporto filtro (prop opzionale).
- Code-splitting delle route via `React.lazy` + `Suspense`.

## Funzionalità
- Dashboard con KPI, grafico bar per “ticket per mese”, grafico torta per “progetti per cliente” e lista ultimi ticket con modal di dettaglio.
- Pagine Clienti, Progetti, Ticket con ricerca, sort, filtri, paginazione client-side.
- DetailModal riusabile con focus management e ARIA roles.
- Dark mode persistente.
- Skeleton loading, error & empty states.

## Dati & Mapping
- Backend finto: JSONPlaceholder.
- users→Clienti (name, email, company, city)
- posts→Progetti (title, body, userId)
- comments→Ticket (name, email, body, postId)
- Stato ticket: random 70% aperti / 30% chiusi. Date finte negli ultimi 12 mesi.

## Scelte progettuali
- UI “enterprise”: card con shadow soft, spaziatura generosa, tipografia leggibile.
- Performance: memo per grafici/tabelle, cache in store, code-splitting.
- Accessibilità: ARIA per modali, etichette form, contrasto OK.

## Setup locale
1. Requisiti: Node 18+ (consigliato 20)
2. Installazione:
```bash
npm install
```
3. Sviluppo:
```bash
npm run dev
```
4. Build prod:
```bash
npm run build && npm run preview
```
5. Lint:
```bash
npm run lint
```
6. Test:
```bash
npm test
```

### Variabili ambiente (.env)
- Opzionale: `VITE_API_BASE=https://jsonplaceholder.typicode.com`

## Test
- DataTable: sort, filter (input interno), pagination
- DetailModal: apertura/chiusura e focus
- api.js: mock fetch, parsing/mapping

## CI
- GitHub Actions: workflow `ci.yml` esegue install, lint, test, build.

## Deploy su Vercel
- Importa repo su Vercel
- Framework Preset: Vite
- Build Command: `npm run build`
- Output: `dist`
- Env: opzionale `VITE_API_BASE`
- Dopo il deploy, aggiorna link Demo sopra.

## Mock locale “Nuovo ticket”
- La creazione ticket avviene solo in store locale (no POST). La vista si aggiorna immediatamente; spiegazione inclusa qui e nel codice.

## Cosa migliorerei in produzione
- Autenticazione e ruoli
- Backend reale e pagination server-side
- Error Boundary e logging (Sentry)
- E2E test (Playwright/Cypress)
- Ottimizzazione bundle e immagini

## Perché rilevante per una società di consulenza come Reply
- Dimostra competenze su architettura front-end, integrazione API, UX accessibile e performance.
- Qualità del codice con lint, test e CI; deploy su Vercel per demo rapida.

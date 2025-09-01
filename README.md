# Consulting Dashboard Full-Stack (React + Node.js)

Una **dashboard enterprise completa** con autenticazione JWT, database reale e dati italiani realistici. Stack full-stack moderno con frontend React e backend Node.js deployati separatamente.

- **🌐 Demo Live:** https://for-reply-iuh5x4ouy-alessios-projects-f60f895d.vercel.app
- **🔐 Login:** `demo@demo.com` / `demo123` (oppure `admin@demo.com` / `demo123`)
- **📡 API Backend:** https://for-reply-production.up.railway.app/api
- **📊 Repository:** https://github.com/Jockeys97/For-Reply

## 🚀 Stack Tecnologico

### Frontend (Vercel)
- **React 18** + **Vite** + **JavaScript**
- **React Router** per navigation con lazy loading
- **Tailwind CSS** per styling enterprise
- **Recharts** per grafici interattivi
- **Zustand** per state management

### Backend (Railway)
- **Node.js** + **Express.js** API REST
- **Prisma ORM** con database SQLite
- **JWT Authentication** con ruoli (USER/ADMIN/MANAGER)
- **bcryptjs** per password hashing sicuro
- **CORS** configurato per deployment

### DevOps & Quality
- **ESLint** + **Prettier** per code quality
- **Vitest** + **@testing-library/react** per testing
- **GitHub Actions** per CI/CD automatico
- **Vercel** (frontend) + **Railway** (backend) deployment

## 📊 Dati Realistici Italiani

**✅ 15 Clienti Aziendali:**
- TechCorp Milano, InnovaTech Roma, FinancePlus Torino, HealthSystems Bologna
- Digital Media Firenze, CloudTech Napoli, Automotive Brescia, RetailTech Palermo
- Con indirizzi, telefoni e settori realistici

**✅ 20+ Progetti Enterprise:**
- Budget da 45.000€ a 150.000€
- Migrazione Cloud AWS, App Mobile React Native, Dashboard Power BI
- Sistema Trading Algoritmi, IoT Fleet Management, Banking API Gateway
- Stati: ACTIVE, COMPLETED, ON_HOLD, CANCELLED

**✅ 127+ Ticket Distribuiti:**
- Ultimi 12 mesi per grafici "Ticket per Mese" ricchi
- Bug, Feature, Task, Support con priorità LOW/MEDIUM/HIGH/URGENT
- Stati: OPEN, IN_PROGRESS, RESOLVED, CLOSED

## 🏗️ Architettura

```
📁 Project Structure
├── 🎨 Frontend (Vercel)
│   ├── src/
│   │   ├── components/ (Navbar, DataTable, KpiCard, ChartCard, DetailModal)
│   │   ├── pages/ (Dashboard, Login, Clients, Projects, Tickets)
│   │   ├── services/ (api.js, auth.js)
│   │   └── store/ (useDataStore.js)
│   └── package.json
├── 🔧 Backend (Railway)
│   ├── routes/ (auth.js, clients.js, projects.js, tickets.js)
│   ├── lib/ (auth.js, pagination.js)
│   ├── prisma/ (schema.prisma, seed-enhanced.js)
│   └── server.js
└── 📚 README.md
```

## ⭐ Funzionalità Enterprise

### 🔐 **Autenticazione Completa**
- Login/logout con JWT tokens sicuri
- Ruoli utente (USER, MANAGER, ADMIN) 
- Session management con localStorage
- Protected routes e auth middleware

### 📊 **Dashboard Avanzata**
- KPI cards con metriche real-time
- Grafico "Ticket per Mese" (12 mesi di dati)
- Grafico "Progetti per Cliente" interattivo
- Lista ultimi ticket con modal dettaglio

### 🔍 **CRUD Completo**
- **Clienti:** Aggiungi/Modifica/Elimina con validazione
- **Progetti:** Gestione budget, date, stati
- **Ticket:** Sistema completo con priorità e tipologie
- Ricerca full-text e filtri avanzati

### ⚡ **Performance & UX**
- Server-side pagination per dataset grandi
- Skeleton loading states
- Dark mode persistente
- Responsive design mobile-first
- Error boundaries e gestione errori

## 🔧 Setup Locale

### Frontend
```bash
# Installazione
npm install

# Sviluppo (porta 5174)
npm run dev

# Build produzione
npm run build && npm run preview

# Testing
npm run test

# Linting
npm run lint && npm run format
```

### Backend  
```bash
cd backend

# Installazione
npm install

# Setup database
npx prisma generate
npm run db:reset

# Sviluppo (porta 3333)
npm run dev

# Produzione
npm run start:prod
```

### Variabili Ambiente

**Frontend (.env.local):**
```env
VITE_API_BASE=http://localhost:3333/api
```

**Backend (.env):**
```env
NODE_ENV=development
PORT=3333
JWT_SECRET=your-secret-key
DATABASE_URL="file:./dev.db"
```

## 🚀 Deploy in Produzione

### Backend su Railway
1. Connetti repository GitHub
2. Imposta **Root Directory:** `backend`
3. Aggiungi environment variables
4. Deploy automatico da `master` branch

### Frontend su Vercel  
1. Importa repository
2. Imposta `VITE_API_BASE=https://your-backend.railway.app/api`
3. Deploy automatico da ogni push

## 🧪 Testing & Quality

### Test Coverage
- **Component tests:** DataTable, DetailModal, Login
- **API tests:** Authentication, CRUD operations
- **Integration tests:** Frontend-Backend communication

### Code Quality
- **ESLint** per standard JavaScript
- **Prettier** per formatting consistente
- **Husky** pre-commit hooks (se configurato)
- **GitHub Actions** CI/CD pipeline

## 💼 Valore per il CV

### Competenze Dimostrate
✅ **Full-Stack Development:** Frontend React + Backend Node.js  
✅ **Database Design:** Relazioni, migrations, seeding  
✅ **Authentication:** JWT, ruoli, security best practices  
✅ **DevOps:** CI/CD, multi-environment deploy  
✅ **API Design:** REST, pagination, error handling  
✅ **Modern Stack:** React 18, ES6+, CSS moderno  

### Scenario Enterprise Realistico
- Gestione clienti aziendali italiani
- Budget progetti reali (45K-150K€)  
- Workflow ticket professionali
- UI/UX enterprise-grade
- Sicurezza e performance ottimizzate

## 🔄 Roadmap Futuri Miglioramenti

- [ ] **TypeScript** migration per type safety
- [ ] **React Query** per advanced data fetching
- [ ] **Docker** containerization
- [ ] **PostgreSQL** per production database
- [ ] **Redis** per session caching
- [ ] **Websockets** per real-time updates
- [ ] **E2E Testing** con Playwright
- [ ] **Monitoring** con Sentry
- [ ] **Advanced Analytics** dashboard

---

**⚡ Progetto creato per dimostrare competenze full-stack moderne in contesto enterprise italiano.**

*Sviluppato con architettura scalabile, best practices di sicurezza e focus su qualità del codice.*
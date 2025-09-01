import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: await bcrypt.hash('demo123', 12),
      name: 'Admin Demo',
      role: 'ADMIN'
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@demo.com' },
    update: {},
    create: {
      email: 'demo@demo.com',
      password: await bcrypt.hash('demo123', 12),
      name: 'Demo User',
      role: 'USER'
    }
  });

  // Create realistic clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Marco Rossi',
        email: 'marco.rossi@techcorp.it',
        company: 'TechCorp Italia',
        city: 'Milano',
        phone: '+39 02 1234567',
        address: 'Via Roma 15, 20121 Milano',
        userId: demoUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Laura Bianchi',
        email: 'l.bianchi@innovatech.com',
        company: 'InnovaTech Solutions',
        city: 'Roma',
        phone: '+39 06 9876543',
        address: 'Via del Corso 300, 00186 Roma',
        userId: demoUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Giuseppe Verdi',
        email: 'giuseppe.verdi@financeplus.eu',
        company: 'FinancePlus Europe',
        city: 'Torino',
        phone: '+39 011 555777',
        address: 'Piazza Castello 1, 10121 Torino',
        userId: demoUser.id
      }
    }),
    prisma.client.create({
      data: {
        name: 'Anna Ferrari',
        email: 'anna.ferrari@healthsys.org',
        company: 'HealthSystems International',
        city: 'Bologna',
        phone: '+39 051 333999',
        address: 'Via Indipendenza 8, 40121 Bologna',
        userId: demoUser.id
      }
    })
  ]);

  // Create realistic projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'Migrazione Cloud AWS',
        description: 'Migrazione dell\'infrastruttura aziendale da on-premise ad AWS con implementazione di DevOps practices',
        status: 'ACTIVE',
        budget: 85000,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        clientId: clients[0].id,
        userId: demoUser.id
      }
    }),
    prisma.project.create({
      data: {
        title: 'Sviluppo App Mobile React Native',
        description: 'Creazione di app mobile cross-platform per gestione ordini B2B con integrazione ERP',
        status: 'ACTIVE',
        budget: 120000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-15'),
        clientId: clients[1].id,
        userId: demoUser.id
      }
    }),
    prisma.project.create({
      data: {
        title: 'Dashboard Analytics Power BI',
        description: 'Implementazione di dashboard executive con Power BI e integrazione dati finanziari real-time',
        status: 'COMPLETED',
        budget: 45000,
        startDate: new Date('2023-10-01'),
        endDate: new Date('2024-01-31'),
        clientId: clients[2].id,
        userId: demoUser.id
      }
    }),
    prisma.project.create({
      data: {
        title: 'Sistema Gestione Pazienti',
        description: 'Sviluppo web app per gestione anagrafica pazienti con integrazione sistemi ospedalieri',
        status: 'ON_HOLD',
        budget: 95000,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-09-30'),
        clientId: clients[3].id,
        userId: demoUser.id
      }
    }),
    prisma.project.create({
      data: {
        title: 'E-commerce B2C Modernization',
        description: 'Refactoring completo piattaforma e-commerce con Next.js, Stripe e gestione inventario',
        status: 'ACTIVE',
        budget: 75000,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-10-15'),
        clientId: clients[1].id,
        userId: demoUser.id
      }
    })
  ]);

  // Create realistic tickets
  const tickets = [
    // TechCorp - Migrazione Cloud
    { title: 'Setup ambiente AWS Production', description: 'Configurazione VPC, subnets, security groups per ambiente prod', status: 'RESOLVED', priority: 'HIGH', type: 'TASK', projectId: projects[0].id },
    { title: 'Bug deployment pipeline', description: 'Pipeline CI/CD fallisce durante il deploy su staging environment', status: 'OPEN', priority: 'URGENT', type: 'BUG', projectId: projects[0].id },
    { title: 'Ottimizzazione costi AWS', description: 'Analisi e ottimizzazione dei costi mensili delle risorse AWS', status: 'IN_PROGRESS', priority: 'MEDIUM', type: 'TASK', projectId: projects[0].id },
    
    // InnovaTech - App Mobile
    { title: 'Integrazione API ERP SAP', description: 'Collegamento app mobile con sistema ERP aziendale SAP', status: 'IN_PROGRESS', priority: 'HIGH', type: 'FEATURE', projectId: projects[1].id },
    { title: 'Push notifications non funzionanti', description: 'Le notifiche push non arrivano su dispositivi Android', status: 'OPEN', priority: 'HIGH', type: 'BUG', projectId: projects[1].id },
    { title: 'Dark mode implementation', description: 'Implementazione tema scuro per migliorare UX', status: 'OPEN', priority: 'LOW', type: 'FEATURE', projectId: projects[1].id },
    
    // FinancePlus - Dashboard (COMPLETED)
    { title: 'Setup connessioni database', description: 'Configurazione connessioni sicure ai DB finanziari', status: 'CLOSED', priority: 'HIGH', type: 'TASK', projectId: projects[2].id },
    { title: 'Performance dashboard lenta', description: 'Dashboard impiega 15+ secondi per caricare i dati', status: 'RESOLVED', priority: 'MEDIUM', type: 'BUG', projectId: projects[2].id },
    
    // HealthSystems - ON_HOLD
    { title: 'Analisi requisiti GDPR', description: 'Valutazione compliance GDPR per dati sanitari', status: 'OPEN', priority: 'URGENT', type: 'TASK', projectId: projects[3].id },
    
    // InnovaTech - E-commerce
    { title: 'Integrazione gateway Stripe', description: 'Setup pagamenti con Stripe e gestione webhook', status: 'IN_PROGRESS', priority: 'HIGH', type: 'FEATURE', projectId: projects[4].id },
    { title: 'SEO optimization', description: 'Implementazione SEO best practices per Next.js', status: 'OPEN', priority: 'MEDIUM', type: 'TASK', projectId: projects[4].id }
  ];

  for (const ticketData of tickets) {
    await prisma.ticket.create({
      data: {
        ...ticketData,
        userId: demoUser.id,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random date in last 90 days
      }
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('👤 Demo user: demo@demo.com / demo123');
  console.log('👑 Admin user: admin@demo.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
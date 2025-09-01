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

  // Create 15 realistic Italian clients
  const clientsData = [
    { name: 'Marco Rossi', email: 'marco.rossi@techcorp.it', company: 'TechCorp Italia', city: 'Milano', phone: '+39 02 1234567', address: 'Via Roma 15, 20121 Milano' },
    { name: 'Laura Bianchi', email: 'l.bianchi@innovatech.com', company: 'InnovaTech Solutions', city: 'Roma', phone: '+39 06 9876543', address: 'Via del Corso 300, 00186 Roma' },
    { name: 'Giuseppe Verdi', email: 'giuseppe.verdi@financeplus.eu', company: 'FinancePlus Europe', city: 'Torino', phone: '+39 011 555777', address: 'Piazza Castello 1, 10121 Torino' },
    { name: 'Anna Ferrari', email: 'anna.ferrari@healthsys.org', company: 'HealthSystems International', city: 'Bologna', phone: '+39 051 333999', address: 'Via Indipendenza 8, 40121 Bologna' },
    { name: 'Roberto Conti', email: 'r.conti@digitalmedia.it', company: 'Digital Media Group', city: 'Firenze', phone: '+39 055 444888', address: 'Piazza Duomo 12, 50122 Firenze' },
    { name: 'Silvia Marino', email: 'silvia.marino@cloudtech.it', company: 'CloudTech Italia', city: 'Napoli', phone: '+39 081 777333', address: 'Via Toledo 200, 80134 Napoli' },
    { name: 'Andrea Lombardi', email: 'a.lombardi@automotive.com', company: 'Automotive Solutions SRL', city: 'Brescia', phone: '+39 030 222555', address: 'Via Industriale 45, 25100 Brescia' },
    { name: 'Francesca Rizzo', email: 'f.rizzo@retailtech.it', company: 'RetailTech Systems', city: 'Palermo', phone: '+39 091 888111', address: 'Via Maqueda 150, 90133 Palermo' },
    { name: 'Davide Greco', email: 'davide.greco@energy.it', company: 'GreenEnergy Corp', city: 'Bari', phone: '+39 080 666222', address: 'Corso Cavour 88, 70121 Bari' },
    { name: 'Valentina Costa', email: 'v.costa@logistics.eu', company: 'EuroLogistics SpA', city: 'Genova', phone: '+39 010 999444', address: 'Via del Porto 25, 16124 Genova' },
    { name: 'Matteo Ferretti', email: 'm.ferretti@banking.it', company: 'Digital Banking Solutions', city: 'Verona', phone: '+39 045 333777', address: 'Piazza Bra 18, 37121 Verona' },
    { name: 'Chiara Romano', email: 'chiara.romano@pharma.com', company: 'PharmaInnovation SRL', city: 'Catania', phone: '+39 095 555999', address: 'Via Etnea 120, 95131 Catania' },
    { name: 'Luca Santoro', email: 'luca.santoro@manufacturing.it', company: 'Smart Manufacturing', city: 'Padova', phone: '+39 049 777555', address: 'Via Università 42, 35122 Padova' },
    { name: 'Elena Moretti', email: 'e.moretti@insurtech.eu', company: 'InsurTech Europe', city: 'Trieste', phone: '+39 040 444666', address: 'Piazza Unità 8, 34121 Trieste' },
    { name: 'Stefano Bruno', email: 's.bruno@realestate.it', company: 'PropTech Solutions', city: 'Cagliari', phone: '+39 070 222888', address: 'Via Garibaldi 55, 09124 Cagliari' }
  ];

  const clients = await Promise.all(
    clientsData.map(clientData =>
      prisma.client.create({
        data: {
          ...clientData,
          userId: demoUser.id
        }
      })
    )
  );

  // Create realistic projects (2-3 per client)
  const projectsData = [
    // TechCorp Milano
    { title: 'Migrazione Cloud AWS', description: 'Migrazione dell\'infrastruttura aziendale da on-premise ad AWS con implementazione di DevOps practices', status: 'ACTIVE', budget: 85000, clientIndex: 0 },
    { title: 'Sistema CRM Personalizzato', description: 'Sviluppo di un CRM su misura per la gestione clienti enterprise', status: 'ACTIVE', budget: 65000, clientIndex: 0 },
    
    // InnovaTech Roma
    { title: 'App Mobile React Native', description: 'Creazione di app mobile cross-platform per gestione ordini B2B', status: 'ACTIVE', budget: 120000, clientIndex: 1 },
    { title: 'E-commerce B2C Modernization', description: 'Refactoring completo piattaforma e-commerce con Next.js e Stripe', status: 'ACTIVE', budget: 75000, clientIndex: 1 },
    
    // FinancePlus Torino
    { title: 'Dashboard Analytics Power BI', description: 'Implementazione dashboard executive con Power BI e integrazione dati real-time', status: 'COMPLETED', budget: 45000, clientIndex: 2 },
    { title: 'Sistema Trading Algoritmi', description: 'Piattaforma di trading algoritmico con Python e machine learning', status: 'ACTIVE', budget: 150000, clientIndex: 2 },
    
    // HealthSystems Bologna
    { title: 'Sistema Gestione Pazienti', description: 'Web app per gestione anagrafica pazienti con integrazione sistemi ospedalieri', status: 'ON_HOLD', budget: 95000, clientIndex: 3 },
    { title: 'Telemedicina Platform', description: 'Piattaforma per consulti medici online con video call integrata', status: 'ACTIVE', budget: 110000, clientIndex: 3 },
    
    // Digital Media Firenze
    { title: 'Content Management System', description: 'CMS personalizzato per gestione contenuti multimediali', status: 'ACTIVE', budget: 70000, clientIndex: 4 },
    { title: 'Video Streaming Platform', description: 'Piattaforma streaming video on-demand per contenuti premium', status: 'ACTIVE', budget: 130000, clientIndex: 4 },
    
    // CloudTech Napoli
    { title: 'Kubernetes Migration', description: 'Migrazione microservizi su Kubernetes con monitoraggio avanzato', status: 'ACTIVE', budget: 90000, clientIndex: 5 },
    
    // Automotive Brescia
    { title: 'IoT Fleet Management', description: 'Sistema IoT per tracciamento flotte aziendali in tempo reale', status: 'ACTIVE', budget: 100000, clientIndex: 6 },
    
    // RetailTech Palermo
    { title: 'POS System Integration', description: 'Integrazione sistemi POS con inventory management', status: 'COMPLETED', budget: 55000, clientIndex: 7 },
    
    // GreenEnergy Bari
    { title: 'Energy Monitoring Dashboard', description: 'Dashboard per monitoraggio consumi energetici industriali', status: 'ACTIVE', budget: 80000, clientIndex: 8 },
    
    // EuroLogistics Genova
    { title: 'Supply Chain Optimization', description: 'Sistema ottimizzazione supply chain con AI', status: 'ACTIVE', budget: 95000, clientIndex: 9 },
    
    // Altri progetti...
    { title: 'Banking API Gateway', description: 'Gateway per API bancarie con sicurezza PCI-DSS', status: 'ACTIVE', budget: 120000, clientIndex: 10 },
    { title: 'Clinical Trials Platform', description: 'Piattaforma per gestione trial clinici farmaceutici', status: 'ACTIVE', budget: 140000, clientIndex: 11 },
    { title: 'Industry 4.0 Dashboard', description: 'Dashboard per monitoraggio produzione industriale', status: 'ACTIVE', budget: 85000, clientIndex: 12 },
    { title: 'Insurance Claims AI', description: 'Sistema AI per processamento automatico richieste assicurative', status: 'ACTIVE', budget: 105000, clientIndex: 13 },
    { title: 'PropTech Mobile App', description: 'App mobile per gestione proprietà immobiliari', status: 'ACTIVE', budget: 75000, clientIndex: 14 }
  ];

  const projects = await Promise.all(
    projectsData.map(projectData => {
      const client = clients[projectData.clientIndex];
      const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const endDate = new Date(startDate.getTime() + (90 + Math.random() * 180) * 24 * 60 * 60 * 1000); // 90-270 days later
      
      return prisma.project.create({
        data: {
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
          budget: projectData.budget,
          startDate,
          endDate,
          clientId: client.id,
          userId: demoUser.id
        }
      });
    })
  );

  // Create many realistic tickets spread over the last 12 months
  const ticketTypes = ['BUG', 'FEATURE', 'TASK', 'SUPPORT'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  
  const ticketsData = [
    // High priority/urgent tickets
    'Setup ambiente AWS Production', 'Bug deployment pipeline', 'Ottimizzazione costi AWS', 'Database performance critica',
    'Integrazione API ERP SAP', 'Push notifications non funzionanti', 'Dark mode implementation', 'Cache Redis timeout',
    'Setup connessioni database', 'Performance dashboard lenta', 'Analisi requisiti GDPR', 'Backup automatico fallisce',
    'Integrazione gateway Stripe', 'SEO optimization', 'Mobile responsive issues', 'SSL certificate renewal',
    'API rate limiting', 'User authentication bug', 'Email notifications down', 'Server monitoring alerts',
    'Docker containerization', 'CI/CD pipeline ottimization', 'Load balancer configuration', 'CDN implementation',
    'Vulnerability scan report', 'Data migration script', 'Third-party API integration', 'WebSocket disconnection',
    'File upload size limit', 'Search functionality slow', 'Report generation timeout', 'Multi-tenant setup',
    'Logging system upgrade', 'Health check endpoints', 'Error tracking implementation', 'Performance profiling',
    'Unit tests coverage', 'End-to-end testing', 'Stress testing results', 'Security audit findings',
    'Code review automation', 'Documentation update', 'Training session setup', 'Knowledge base creation',
    'Client onboarding flow', 'User feedback integration', 'Analytics dashboard', 'A/B testing framework',
    'Notification system', 'Scheduled tasks optimization', 'Background job processing', 'Queue management',
    'Microservices architecture', 'Service mesh implementation', 'Event sourcing setup', 'CQRS pattern',
    'GraphQL API development', 'Real-time updates', 'Offline mode support', 'Progressive Web App'
  ];

  // Create 80+ tickets distributed over last 12 months
  const allTickets = [];
  for (let i = 0; i < ticketsData.length; i++) {
    const randomProject = projects[Math.floor(Math.random() * projects.length)];
    const monthsAgo = Math.floor(Math.random() * 12);
    const createdAt = new Date();
    createdAt.setMonth(createdAt.getMonth() - monthsAgo);
    createdAt.setDate(Math.floor(Math.random() * 28) + 1);
    
    allTickets.push({
      title: ticketsData[i],
      description: `Descrizione dettagliata per: ${ticketsData[i]}. Include analisi tecnica, requirements e acceptance criteria.`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      type: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
      projectId: randomProject.id,
      userId: demoUser.id,
      createdAt
    });
  }

  // Ensure good distribution for charts - add some tickets for each month
  for (let month = 0; month < 12; month++) {
    const ticketsThisMonth = Math.floor(Math.random() * 8) + 3; // 3-10 tickets per month
    for (let i = 0; i < ticketsThisMonth; i++) {
      const randomProject = projects[Math.floor(Math.random() * projects.length)];
      const createdAt = new Date();
      createdAt.setMonth(createdAt.getMonth() - month);
      createdAt.setDate(Math.floor(Math.random() * 28) + 1);
      
      allTickets.push({
        title: `Task ${month}-${i}: ${ticketsData[Math.floor(Math.random() * ticketsData.length)]}`,
        description: `Attività pianificata per il mese ${month + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        type: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
        projectId: randomProject.id,
        userId: demoUser.id,
        createdAt
      });
    }
  }

  await Promise.all(
    allTickets.map(ticketData =>
      prisma.ticket.create({
        data: ticketData
      })
    )
  );

  console.log('✅ Enhanced database seeded successfully!');
  console.log(`👥 Created ${clients.length} clients`);
  console.log(`📊 Created ${projects.length} projects`);
  console.log(`🎫 Created ${allTickets.length} tickets`);
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
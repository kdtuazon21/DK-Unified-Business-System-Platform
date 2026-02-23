/* ========================================
   UBMS - Sample Data Store
   Multi-tenant data for all 4 companies
   ======================================== */

const DataStore = {
    // ============================================================
    //  COMPANIES
    // ============================================================
    companies: {
        dheekay: {
            id: 'dheekay', name: 'Dheekay Builders OPC', type: 'construction',
            address: 'Tuguegarao City, Cagayan Valley', phone: '(078) 844-1234',
            email: 'info@dheekaybuilders.com', tin: '123-456-789-000',
            color: '#16a085', icon: 'fa-hard-hat', logo: 'assets/logos/dheekay.png'
        },
        kdchavit: {
            id: 'kdchavit', name: 'KDChavit Construction', type: 'construction',
            address: 'Tuguegarao City, Cagayan Valley', phone: '(078) 844-5678',
            email: 'info@kdchavit.com', tin: '987-654-321-000',
            color: '#2c3e50', icon: 'fa-building', logo: 'assets/logos/kdchavit.png'
        },
        nuatthai: {
            id: 'nuatthai', name: 'Nuat Thai Foot & Body Massage', type: 'wellness',
            address: 'Makati City, Metro Manila', phone: '(02) 8123-4567',
            email: 'hello@nuatthai.ph', tin: '456-789-012-000',
            color: '#FFD700', icon: 'fa-spa', logo: 'assets/logos/nuatthai.png',
            branches: [
                { id: 'makati', name: 'Makati Branch', address: 'Makati Ave, Makati City' },
                { id: 'bgc', name: 'BGC Branch', address: 'Bonifacio High Street, BGC' },
                { id: 'ortigas', name: 'Ortigas Branch', address: 'Ortigas Center, Pasig' }
            ]
        },
        autocasa: {
            id: 'autocasa', name: 'AutoCasa Auto Expert & Repair Services', type: 'automotive',
            address: 'Metro Manila, Philippines', phone: '(02) 8987-6543',
            email: 'service@autocasa.ph', tin: '321-654-987-000',
            color: '#e74c3c', icon: 'fa-car', logo: 'assets/logos/autocasa.png',
            website: 'https://autocasa.ph'
        }
    },

    // ============================================================
    //  CRM - CUSTOMERS (Unified)
    // ============================================================
    customers: [
        { id: 'CUS-001', name: 'Juan dela Cruz', email: 'juan@email.com', phone: '0917-123-4567', type: 'individual',
          tags: ['construction-client', 'car-owner'], companies: ['dheekay', 'autocasa'],
          address: 'Tuguegarao City, Cagayan', created: '2024-01-15', totalSpent: 2850000,
          notes: 'Long-time construction client. Also brings car for service.' },
        { id: 'CUS-002', name: 'Maria Santos', email: 'maria@email.com', phone: '0918-987-6543', type: 'individual',
          tags: ['massage-client', 'loyalty-gold'], companies: ['nuatthai'],
          address: 'Makati City', created: '2024-03-20', totalSpent: 45800,
          notes: 'Gold member. Prefers deep tissue massage.' },
        { id: 'CUS-003', name: 'ABC Corporation', email: 'procurement@abc.com', phone: '(02) 8555-1234', type: 'corporate',
          tags: ['construction-client'], companies: ['dheekay', 'kdchavit'],
          address: 'Quezon City', created: '2023-06-10', totalSpent: 15400000,
          contactPerson: 'Engr. Carlos Reyes', notes: 'Joint projects with both construction companies.' },
        { id: 'CUS-004', name: 'Pedro Alvarez', email: 'pedro@email.com', phone: '0919-555-7890', type: 'individual',
          tags: ['car-owner'], companies: ['autocasa'],
          address: 'Paranaque City', created: '2024-08-05', totalSpent: 28500,
          vehicle: 'Toyota Vios 2022 (ABC-1234)' },
        { id: 'CUS-005', name: 'Liza Reyes', email: 'liza@email.com', phone: '0920-111-2233', type: 'individual',
          tags: ['massage-client', 'loyalty-platinum'], companies: ['nuatthai'],
          address: 'BGC, Taguig', created: '2023-12-01', totalSpent: 89500,
          notes: 'Platinum member. VIP.' },
        { id: 'CUS-006', name: 'Globe Telecom', email: 'infra@globe.com', phone: '(02) 7730-1000', type: 'corporate',
          tags: ['construction-client'], companies: ['dheekay'],
          address: 'Mandaluyong City', created: '2023-01-20', totalSpent: 85000000,
          contactPerson: 'Engr. Ramon Cruz', notes: 'Telecom tower projects in Cagayan Valley.' },
        { id: 'CUS-007', name: 'DPWH Region II', email: 'region2@dpwh.gov.ph', phone: '(078) 846-9000', type: 'government',
          tags: ['construction-client'], companies: ['kdchavit'],
          address: 'Tuguegarao City', created: '2022-09-15', totalSpent: 125000000,
          notes: 'Government infrastructure projects.' },
        { id: 'CUS-008', name: 'Roberto Tan', email: 'rob@email.com', phone: '0917-333-4455', type: 'individual',
          tags: ['car-owner', 'massage-client'], companies: ['autocasa', 'nuatthai'],
          address: 'Ortigas, Pasig', created: '2024-05-12', totalSpent: 56700,
          notes: 'Cross-sell success: Massage client who now does car service with us.' },
        { id: 'CUS-009', name: 'Anna Garcia', email: 'anna@email.com', phone: '0918-666-7788', type: 'individual',
          tags: ['massage-client', 'loyalty-silver'], companies: ['nuatthai'],
          address: 'Makati City', created: '2024-07-01', totalSpent: 22400 },
        { id: 'CUS-010', name: 'Tech Builders Inc.', email: 'info@techbuilders.com', phone: '(02) 8444-5566', type: 'corporate',
          tags: ['construction-client'], companies: ['dheekay'],
          address: 'Pasig City', created: '2024-02-14', totalSpent: 9800000 }
    ],

    // ============================================================
    //  FINANCIAL - ACCOUNTS & TRANSACTIONS
    // ============================================================
    chartOfAccounts: [
        { code: '1000', name: 'Cash and Cash Equivalents', type: 'asset', company: 'all' },
        { code: '1100', name: 'Accounts Receivable', type: 'asset', company: 'all' },
        { code: '1200', name: 'Inventory', type: 'asset', company: 'all' },
        { code: '1300', name: 'Prepaid Expenses', type: 'asset', company: 'all' },
        { code: '2000', name: 'Accounts Payable', type: 'liability', company: 'all' },
        { code: '2100', name: 'Accrued Expenses', type: 'liability', company: 'all' },
        { code: '3000', name: 'Owner\'s Equity', type: 'equity', company: 'all' },
        { code: '4000', name: 'Service Revenue', type: 'revenue', company: 'all' },
        { code: '4100', name: 'Project Revenue', type: 'revenue', company: 'dheekay' },
        { code: '4200', name: 'Project Revenue', type: 'revenue', company: 'kdchavit' },
        { code: '4300', name: 'Massage Service Revenue', type: 'revenue', company: 'nuatthai' },
        { code: '4400', name: 'Repair Service Revenue', type: 'revenue', company: 'autocasa' },
        { code: '5000', name: 'Cost of Goods Sold', type: 'expense', company: 'all' },
        { code: '5100', name: 'Materials Cost', type: 'expense', company: 'all' },
        { code: '5200', name: 'Labor Cost', type: 'expense', company: 'all' },
        { code: '6000', name: 'Operating Expenses', type: 'expense', company: 'all' },
        { code: '6100', name: 'Salaries & Wages', type: 'expense', company: 'all' },
        { code: '6200', name: 'Rent Expense', type: 'expense', company: 'all' },
        { code: '6300', name: 'Utilities', type: 'expense', company: 'all' }
    ],

    invoices: [
        { id: 'INV-2026-001', company: 'dheekay', customer: 'CUS-006', amount: 4500000, paid: 3000000,
          status: 'partial', dueDate: '2026-03-15', issueDate: '2026-01-15', description: 'Tower Site A - Progress Billing #3' },
        { id: 'INV-2026-002', company: 'dheekay', customer: 'CUS-003', amount: 2800000, paid: 2800000,
          status: 'paid', dueDate: '2026-02-01', issueDate: '2026-01-01', description: 'Commercial Building Phase 2' },
        { id: 'INV-2026-003', company: 'kdchavit', customer: 'CUS-007', amount: 8500000, paid: 0,
          status: 'unpaid', dueDate: '2026-04-01', issueDate: '2026-02-15', description: 'Road Improvement Project - Lot 4' },
        { id: 'INV-2026-004', company: 'nuatthai', customer: 'CUS-002', amount: 3800, paid: 3800,
          status: 'paid', dueDate: '2026-02-20', issueDate: '2026-02-20', description: 'Spa Package - Gold Member' },
        { id: 'INV-2026-005', company: 'autocasa', customer: 'CUS-004', amount: 15800, paid: 0,
          status: 'unpaid', dueDate: '2026-03-01', issueDate: '2026-02-18', description: 'Engine Oil Change + Brake Service' },
        { id: 'INV-2026-006', company: 'nuatthai', customer: 'CUS-005', amount: 8990, paid: 8990,
          status: 'paid', dueDate: '2026-02-22', issueDate: '2026-02-22', description: 'Platinum Package - 10 Sessions' },
        { id: 'INV-2026-007', company: 'autocasa', customer: 'CUS-008', amount: 22500, paid: 22500,
          status: 'paid', dueDate: '2026-02-10', issueDate: '2026-02-05', description: 'ATF Dialysis + Air Filter + Coolant' },
        { id: 'INV-2026-008', company: 'kdchavit', customer: 'CUS-007', amount: 12000000, paid: 6000000,
          status: 'partial', dueDate: '2026-05-01', issueDate: '2026-02-01', description: 'Bridge Rehabilitation Project' }
    ],

    expenses: [
        { id: 'EXP-001', company: 'dheekay', category: 'Materials', amount: 1250000, date: '2026-02-10', vendor: 'Steel Corp PH', description: 'Structural steel for Tower Site A' },
        { id: 'EXP-002', company: 'dheekay', category: 'Labor', amount: 450000, date: '2026-02-15', vendor: 'Payroll', description: 'Bi-monthly payroll - construction crew' },
        { id: 'EXP-003', company: 'kdchavit', category: 'Materials', amount: 2100000, date: '2026-02-12', vendor: 'Concrete Mix Inc.', description: 'Ready-mix concrete for Road Project' },
        { id: 'EXP-004', company: 'kdchavit', category: 'Equipment', amount: 180000, date: '2026-02-08', vendor: 'Heavy Rentals PH', description: 'Crane rental - 2 weeks' },
        { id: 'EXP-005', company: 'nuatthai', category: 'Rent', amount: 85000, date: '2026-02-01', vendor: 'SM Prime', description: 'Monthly rent - Makati Branch' },
        { id: 'EXP-006', company: 'nuatthai', category: 'Supplies', amount: 12500, date: '2026-02-05', vendor: 'Spa Essentials PH', description: 'Massage oils and aromatherapy supplies' },
        { id: 'EXP-007', company: 'nuatthai', category: 'Salaries', amount: 320000, date: '2026-02-15', vendor: 'Payroll', description: 'Therapist salaries + commissions' },
        { id: 'EXP-008', company: 'autocasa', category: 'Parts', amount: 45000, date: '2026-02-09', vendor: 'AutoParts Direct', description: 'Brake pads, oil filters, air filters inventory' },
        { id: 'EXP-009', company: 'autocasa', category: 'Rent', amount: 55000, date: '2026-02-01', vendor: 'Property Mgmt Corp', description: 'Workshop rent' },
        { id: 'EXP-010', company: 'autocasa', category: 'Utilities', amount: 18000, date: '2026-02-03', vendor: 'Meralco', description: 'Electricity - workshop' }
    ],

    // ============================================================
    //  CONSTRUCTION - PROJECTS
    // ============================================================
    projects: [
        {
            id: 'PRJ-001', company: 'dheekay', name: 'Globe Tower Site Alpha', client: 'CUS-006',
            status: 'in-progress', priority: 'high', progress: 68,
            startDate: '2025-06-01', endDate: '2026-08-30',
            budget: 95000000, actualCost: 72500000,
            location: 'Tuguegarao City, Cagayan',
            manager: 'Engr. Marcos Villanueva',
            description: 'Construction of 60m telecom tower with equipment shelter',
            phases: [
                { name: 'Foundation', progress: 100, status: 'completed', budget: 15000000, actual: 14200000 },
                { name: 'Steel Erection', progress: 85, status: 'in-progress', budget: 35000000, actual: 32100000 },
                { name: 'Equipment Installation', progress: 40, status: 'in-progress', budget: 25000000, actual: 18500000 },
                { name: 'Commissioning', progress: 0, status: 'pending', budget: 20000000, actual: 0 }
            ]
        },
        {
            id: 'PRJ-002', company: 'dheekay', name: 'Commercial Building - Phase 2', client: 'CUS-003',
            status: 'in-progress', priority: 'medium', progress: 45,
            startDate: '2025-09-15', endDate: '2026-12-31',
            budget: 280000000, actualCost: 142000000,
            location: 'Tuguegarao City, Cagayan',
            manager: 'Engr. Roberto Cruz',
            description: '5-storey commercial building with basement parking',
            phases: [
                { name: 'Excavation & Foundation', progress: 100, status: 'completed', budget: 45000000, actual: 48500000 },
                { name: 'Structural Frame', progress: 70, status: 'in-progress', budget: 85000000, actual: 65000000 },
                { name: 'MEP Rough-In', progress: 20, status: 'in-progress', budget: 65000000, actual: 18500000 },
                { name: 'Finishing & Handover', progress: 0, status: 'pending', budget: 85000000, actual: 0 }
            ]
        },
        {
            id: 'PRJ-003', company: 'dheekay', name: 'Residential Subdivision - Lot A', client: 'CUS-010',
            status: 'completed', priority: 'low', progress: 100,
            startDate: '2024-01-10', endDate: '2025-11-30',
            budget: 45000000, actualCost: 43200000,
            location: 'Solana, Cagayan',
            manager: 'Engr. Marcos Villanueva',
            description: '12-unit residential housing development'
        },
        {
            id: 'PRJ-004', company: 'kdchavit', name: 'Road Improvement Project - Barangay Road Lot 4', client: 'CUS-007',
            status: 'in-progress', priority: 'high', progress: 35,
            startDate: '2025-11-01', endDate: '2026-07-30',
            budget: 120000000, actualCost: 48000000,
            location: 'Penablanca, Cagayan',
            manager: 'Engr. Antonio Ramos',
            description: '8km road rehabilitation with drainage system',
            phases: [
                { name: 'Site Clearing', progress: 100, status: 'completed', budget: 8000000, actual: 7500000 },
                { name: 'Sub-base & Base Course', progress: 60, status: 'in-progress', budget: 35000000, actual: 25000000 },
                { name: 'Concrete Paving', progress: 10, status: 'in-progress', budget: 50000000, actual: 12000000 },
                { name: 'Drainage & Finishing', progress: 0, status: 'pending', budget: 27000000, actual: 0 }
            ]
        },
        {
            id: 'PRJ-005', company: 'kdchavit', name: 'Bridge Rehabilitation', client: 'CUS-007',
            status: 'in-progress', priority: 'high', progress: 55,
            startDate: '2025-08-15', endDate: '2026-06-30',
            budget: 185000000, actualCost: 98000000,
            location: 'Iguig, Cagayan',
            manager: 'Engr. Jose Santos',
            description: 'Rehabilitation of 150m river bridge'
        },
        {
            id: 'PRJ-006', company: 'kdchavit', name: 'School Building Project', client: 'CUS-007',
            status: 'pending', priority: 'medium', progress: 0,
            startDate: '2026-04-01', endDate: '2027-03-31',
            budget: 65000000, actualCost: 0,
            location: 'Amulung, Cagayan',
            manager: 'Engr. Antonio Ramos',
            description: '3-storey school building with 18 classrooms'
        }
    ],

    subcontractors: [
        { id: 'SUB-001', name: 'Steel Masters PH', specialty: 'Structural Steel', company: 'dheekay', phone: '0917-111-2233', email: 'info@steelmasters.ph', status: 'active', rating: 4.5 },
        { id: 'SUB-002', name: 'Metro Electric', specialty: 'Electrical', company: 'dheekay', phone: '0918-333-4455', email: 'metro@electric.ph', status: 'active', rating: 4.2 },
        { id: 'SUB-003', name: 'Cagayan Plumbing', specialty: 'Plumbing', company: 'kdchavit', phone: '0919-555-6677', email: 'info@cagplumbing.com', status: 'active', rating: 3.8 },
        { id: 'SUB-004', name: 'Heavy Lift Corp', specialty: 'Crane Services', company: 'dheekay', phone: '0920-777-8899', email: 'ops@heavylift.ph', status: 'active', rating: 4.7 },
        { id: 'SUB-005', name: 'Valley Concrete', specialty: 'Concrete Works', company: 'kdchavit', phone: '0917-999-0011', email: 'sales@valleyconcrete.com', status: 'active', rating: 4.0 }
    ],

    // ============================================================
    //  WELLNESS - SERVICES, THERAPISTS, BOOKINGS
    // ============================================================
    spaServices: [
        { id: 'SVC-001', name: 'Thai Foot Massage', duration: 60, price: 499, category: 'Foot', description: 'Traditional Thai foot reflexology' },
        { id: 'SVC-002', name: 'Full Body Thai Massage', duration: 90, price: 899, category: 'Body', description: 'Authentic Thai body massage with stretching' },
        { id: 'SVC-003', name: 'Deep Tissue Massage', duration: 60, price: 699, category: 'Body', description: 'Targeted deep pressure for muscle relief' },
        { id: 'SVC-004', name: 'Hot Stone Therapy', duration: 90, price: 1199, category: 'Premium', description: 'Heated stones with massage combination' },
        { id: 'SVC-005', name: 'Aromatherapy Massage', duration: 60, price: 799, category: 'Body', description: 'Essential oils combined with gentle massage' },
        { id: 'SVC-006', name: 'Combination Package', duration: 120, price: 1499, category: 'Premium', description: 'Foot + body massage combo' },
        { id: 'SVC-007', name: 'Head & Shoulder Massage', duration: 30, price: 349, category: 'Quick', description: 'Quick relief for tension headaches' },
        { id: 'SVC-008', name: 'Thai Herbal Compress', duration: 90, price: 999, category: 'Premium', description: 'Herbal compress with traditional massage' },
        { id: 'SVC-009', name: 'Foot Reflexology', duration: 30, price: 299, category: 'Foot', description: 'Quick foot pressure point treatment' },
        { id: 'SVC-010', name: 'Couples Massage', duration: 90, price: 1599, category: 'Premium', description: 'Side-by-side massage experience' },
        { id: 'SVC-011', name: 'Back & Neck Focus', duration: 45, price: 449, category: 'Body', description: 'Targeted back and neck relief' }
    ],

    therapists: [
        { id: 'TH-001', name: 'Maria Reyes', branch: 'makati', status: 'available', rating: 4.8, specialties: ['Thai Massage', 'Deep Tissue'], phone: '0917-001-0001', hireDate: '2022-03-15', commissionRate: 0.15 },
        { id: 'TH-002', name: 'Ana Santos', branch: 'makati', status: 'in-session', rating: 4.9, specialties: ['Hot Stone', 'Aromatherapy'], phone: '0917-001-0002', hireDate: '2021-06-20', commissionRate: 0.15 },
        { id: 'TH-003', name: 'Rosa Garcia', branch: 'bgc', status: 'available', rating: 4.6, specialties: ['Foot Reflexology', 'Thai Massage'], phone: '0917-001-0003', hireDate: '2023-01-10', commissionRate: 0.15 },
        { id: 'TH-004', name: 'Carmen Lopez', branch: 'bgc', status: 'off-duty', rating: 4.7, specialties: ['Deep Tissue', 'Thai Herbal'], phone: '0917-001-0004', hireDate: '2023-05-08', commissionRate: 0.15 },
        { id: 'TH-005', name: 'Patricia Cruz', branch: 'ortigas', status: 'available', rating: 4.5, specialties: ['Full Body', 'Couples'], phone: '0917-001-0005', hireDate: '2024-02-01', commissionRate: 0.15 },
        { id: 'TH-006', name: 'Luz Mendoza', branch: 'ortigas', status: 'in-session', rating: 4.4, specialties: ['Thai Massage', 'Back & Neck'], phone: '0917-001-0006', hireDate: '2024-06-15', commissionRate: 0.15 },
        { id: 'TH-007', name: 'Elena Flores', branch: 'makati', status: 'available', rating: 4.3, specialties: ['Foot Reflexology'], phone: '0917-001-0007', hireDate: '2024-09-01', commissionRate: 0.12 }
    ],

    bookings: [
        { id: 'BK-001', company: 'nuatthai', customer: 'CUS-002', therapist: 'TH-002', service: 'SVC-004', branch: 'makati', date: '2026-02-23', time: '10:00', status: 'in-session', amount: 1199, notes: 'Regular client - prefers low music' },
        { id: 'BK-002', company: 'nuatthai', customer: 'CUS-005', therapist: 'TH-003', service: 'SVC-006', branch: 'bgc', date: '2026-02-23', time: '14:00', status: 'confirmed', amount: 1499, notes: 'VIP Platinum member' },
        { id: 'BK-003', company: 'nuatthai', customer: 'CUS-009', therapist: 'TH-001', service: 'SVC-001', branch: 'makati', date: '2026-02-23', time: '11:30', status: 'confirmed', amount: 499 },
        { id: 'BK-004', company: 'nuatthai', customer: 'CUS-008', therapist: 'TH-006', service: 'SVC-002', branch: 'ortigas', date: '2026-02-23', time: '15:00', status: 'scheduled', amount: 899 },
        { id: 'BK-005', company: 'nuatthai', customer: 'CUS-002', therapist: 'TH-005', service: 'SVC-010', branch: 'ortigas', date: '2026-02-24', time: '10:00', status: 'scheduled', amount: 1599 },
        { id: 'BK-006', company: 'nuatthai', customer: 'CUS-009', therapist: 'TH-007', service: 'SVC-009', branch: 'makati', date: '2026-02-24', time: '13:00', status: 'scheduled', amount: 299 },
        { id: 'BK-007', company: 'nuatthai', customer: 'CUS-005', therapist: 'TH-002', service: 'SVC-005', branch: 'makati', date: '2026-02-22', time: '16:00', status: 'completed', amount: 799 },
        { id: 'BK-008', company: 'nuatthai', customer: 'CUS-002', therapist: 'TH-001', service: 'SVC-003', branch: 'makati', date: '2026-02-21', time: '09:00', status: 'completed', amount: 699 }
    ],

    memberships: [
        { id: 'MEM-001', customer: 'CUS-005', type: 'Platinum', sessionsTotal: 20, sessionsUsed: 14, expiryDate: '2026-06-30', status: 'active', purchaseDate: '2025-12-01', price: 15990 },
        { id: 'MEM-002', customer: 'CUS-002', type: 'Gold', sessionsTotal: 10, sessionsUsed: 7, expiryDate: '2026-05-15', status: 'active', purchaseDate: '2025-11-15', price: 8990 },
        { id: 'MEM-003', customer: 'CUS-009', type: 'Silver', sessionsTotal: 5, sessionsUsed: 3, expiryDate: '2026-04-01', status: 'active', purchaseDate: '2026-01-01', price: 4490 },
        { id: 'MEM-004', customer: 'CUS-008', type: 'Gold', sessionsTotal: 10, sessionsUsed: 10, expiryDate: '2026-01-31', status: 'expired', purchaseDate: '2025-07-31', price: 8990 }
    ],

    // ============================================================
    //  AUTOMOTIVE - VEHICLES, JOBS, PARTS
    // ============================================================
    autoServices: [
        { id: 'AS-001', name: 'Engine Oil Change', price: 2500, duration: 60, category: 'Maintenance' },
        { id: 'AS-002', name: 'Coolant Flushing', price: 3500, duration: 90, category: 'Maintenance' },
        { id: 'AS-003', name: 'Brake Cleaning Service', price: 2000, duration: 45, category: 'Brakes' },
        { id: 'AS-004', name: 'Brake Fluid Flushing', price: 2800, duration: 60, category: 'Brakes' },
        { id: 'AS-005', name: 'Sparkplugs Replace', price: 3000, duration: 60, category: 'Engine' },
        { id: 'AS-006', name: 'Air Filter Replace', price: 1500, duration: 30, category: 'Engine' },
        { id: 'AS-007', name: 'Fuel Filter Replace', price: 2200, duration: 45, category: 'Engine' },
        { id: 'AS-008', name: 'Engine Decarb', price: 5500, duration: 120, category: 'Engine' },
        { id: 'AS-009', name: 'ATF Dialysis', price: 6500, duration: 120, category: 'Transmission' },
        { id: 'AS-010', name: 'Regular Check-Up', price: 1500, duration: 60, category: 'Inspection' },
        { id: 'AS-011', name: 'Rotor Reface', price: 3500, duration: 90, category: 'Brakes' },
        { id: 'AS-012', name: 'Aircon Service', price: 4000, duration: 90, category: 'HVAC' }
    ],

    vehicles: [
        { id: 'VH-001', plate: 'ABC-1234', make: 'Toyota', model: 'Vios', year: 2022, color: 'White', customer: 'CUS-004', mileage: 45000 },
        { id: 'VH-002', plate: 'XYZ-5678', make: 'Honda', model: 'Civic', year: 2021, color: 'Silver', customer: 'CUS-008', mileage: 62000 },
        { id: 'VH-003', plate: 'DEF-9012', make: 'Mitsubishi', model: 'Montero Sport', year: 2023, color: 'Black', customer: 'CUS-001', mileage: 28000 },
        { id: 'VH-004', plate: 'GHI-3456', make: 'Ford', model: 'Ranger', year: 2020, color: 'Blue', customer: 'CUS-004', mileage: 78000 },
        { id: 'VH-005', plate: 'JKL-7890', make: 'Suzuki', model: 'Ertiga', year: 2024, color: 'Red', customer: 'CUS-008', mileage: 12000 }
    ],

    jobCards: [
        { id: 'JC-001', company: 'autocasa', vehicle: 'VH-001', customer: 'CUS-004', services: ['AS-001', 'AS-003'],
          status: 'in-repair', technician: 'Mike Santos', priority: 'normal',
          dateIn: '2026-02-23', estimatedOut: '2026-02-23', actualOut: null,
          laborHours: 1.5, totalParts: 1800, totalLabor: 2250, totalAmount: 6550,
          notes: 'Customer requested synthetic oil' },
        { id: 'JC-002', company: 'autocasa', vehicle: 'VH-002', customer: 'CUS-008', services: ['AS-009', 'AS-006', 'AS-002'],
          status: 'waiting-parts', technician: 'Jun Reyes', priority: 'high',
          dateIn: '2026-02-22', estimatedOut: '2026-02-24', actualOut: null,
          laborHours: 4, totalParts: 5500, totalLabor: 6000, totalAmount: 17500,
          notes: 'Waiting for ATF fluid - arriving tomorrow' },
        { id: 'JC-003', company: 'autocasa', vehicle: 'VH-003', customer: 'CUS-001', services: ['AS-010'],
          status: 'in-queue', technician: null, priority: 'low',
          dateIn: '2026-02-23', estimatedOut: '2026-02-23', actualOut: null,
          laborHours: 0, totalParts: 0, totalLabor: 1500, totalAmount: 1500,
          notes: 'Regular check-up, construction client' },
        { id: 'JC-004', company: 'autocasa', vehicle: 'VH-004', customer: 'CUS-004', services: ['AS-008', 'AS-005'],
          status: 'ready-pickup', technician: 'Mike Santos', priority: 'normal',
          dateIn: '2026-02-21', estimatedOut: '2026-02-22', actualOut: '2026-02-22',
          laborHours: 3, totalParts: 4200, totalLabor: 4500, totalAmount: 12200,
          notes: 'Engine decarb complete. Customer notified.' },
        { id: 'JC-005', company: 'autocasa', vehicle: 'VH-005', customer: 'CUS-008', services: ['AS-012'],
          status: 'completed', technician: 'Jun Reyes', priority: 'normal',
          dateIn: '2026-02-19', estimatedOut: '2026-02-19', actualOut: '2026-02-19',
          laborHours: 1.5, totalParts: 1500, totalLabor: 2250, totalAmount: 5750,
          notes: 'Aircon cleaning and recharge done' }
    ],

    autoParts: [
        { id: 'PT-001', name: 'Engine Oil (Synthetic 5W-30)', sku: 'OIL-5W30', quantity: 24, minStock: 10, price: 650, supplier: 'AutoParts Direct' },
        { id: 'PT-002', name: 'Oil Filter (Universal)', sku: 'FLT-OIL-U', quantity: 18, minStock: 10, price: 350, supplier: 'AutoParts Direct' },
        { id: 'PT-003', name: 'Air Filter (Toyota)', sku: 'FLT-AIR-T', quantity: 8, minStock: 5, price: 450, supplier: 'Toyota Parts PH' },
        { id: 'PT-004', name: 'Brake Pad Set (Front)', sku: 'BRK-PAD-F', quantity: 6, minStock: 4, price: 2800, supplier: 'Brembo PH' },
        { id: 'PT-005', name: 'Brake Pad Set (Rear)', sku: 'BRK-PAD-R', quantity: 4, minStock: 4, price: 2400, supplier: 'Brembo PH' },
        { id: 'PT-006', name: 'Coolant (1L)', sku: 'CLT-1L', quantity: 15, minStock: 8, price: 380, supplier: 'AutoParts Direct' },
        { id: 'PT-007', name: 'ATF Fluid (1L)', sku: 'ATF-1L', quantity: 3, minStock: 6, price: 850, supplier: 'Transmission Experts' },
        { id: 'PT-008', name: 'Spark Plug (NGK)', sku: 'SPK-NGK', quantity: 20, minStock: 12, price: 450, supplier: 'NGK Philippines' },
        { id: 'PT-009', name: 'Brake Fluid (DOT 4)', sku: 'BRK-FLD', quantity: 12, minStock: 6, price: 550, supplier: 'AutoParts Direct' },
        { id: 'PT-010', name: 'Fuel Filter (Universal)', sku: 'FLT-FUEL', quantity: 7, minStock: 5, price: 680, supplier: 'AutoParts Direct' },
        { id: 'PT-011', name: 'Aircon Refrigerant (R134a)', sku: 'AC-R134', quantity: 10, minStock: 5, price: 950, supplier: 'Cool Parts PH' },
        { id: 'PT-012', name: 'Wiper Blade Set', sku: 'WPR-SET', quantity: 8, minStock: 4, price: 550, supplier: 'AutoParts Direct' }
    ],

    // ============================================================
    //  GROUP FINANCIAL SUMMARY
    // ============================================================
    getFinancialSummary(company = 'all') {
        const filter = (items) => company === 'all' ? items : items.filter(i => i.company === company);
        const invs = filter(this.invoices);
        const exps = filter(this.expenses);

        const totalRevenue = invs.reduce((s, i) => s + i.paid, 0);
        const totalReceivable = invs.reduce((s, i) => s + (i.amount - i.paid), 0);
        const totalExpenses = exps.reduce((s, e) => s + e.amount, 0);

        return {
            totalRevenue,
            totalReceivable,
            totalExpenses,
            netIncome: totalRevenue - totalExpenses,
            invoiceCount: invs.length,
            paidInvoices: invs.filter(i => i.status === 'paid').length,
            unpaidInvoices: invs.filter(i => i.status === 'unpaid').length,
            partialInvoices: invs.filter(i => i.status === 'partial').length
        };
    },

    getCompanySummary(companyId) {
        const fin = this.getFinancialSummary(companyId);
        const company = this.companies[companyId];
        let extra = {};

        if (company.type === 'construction') {
            const projs = this.projects.filter(p => p.company === companyId);
            extra = {
                activeProjects: projs.filter(p => p.status === 'in-progress').length,
                totalProjects: projs.length,
                totalBudget: projs.reduce((s, p) => s + p.budget, 0),
                avgProgress: projs.filter(p => p.status === 'in-progress').reduce((s, p) => s + p.progress, 0) / (projs.filter(p => p.status === 'in-progress').length || 1)
            };
        } else if (company.type === 'wellness') {
            const bks = this.bookings.filter(b => b.company === companyId);
            extra = {
                todayBookings: bks.filter(b => b.date === '2026-02-23').length,
                totalBookings: bks.length,
                activeMembers: this.memberships.filter(m => m.status === 'active').length,
                availableTherapists: this.therapists.filter(t => t.status === 'available').length
            };
        } else if (company.type === 'automotive') {
            const jcs = this.jobCards.filter(j => j.company === companyId);
            extra = {
                activeJobs: jcs.filter(j => !['completed'].includes(j.status)).length,
                completedJobs: jcs.filter(j => j.status === 'completed').length,
                totalVehicles: this.vehicles.length,
                lowStockParts: this.autoParts.filter(p => p.quantity <= p.minStock).length
            };
        }

        return { ...fin, ...extra, company };
    },

    // Monthly revenue data by company
    monthlyRevenue: {
        dheekay:  [4200000, 5100000, 3800000, 6200000, 5500000, 4800000, 7100000, 6800000, 5200000, 6500000, 7200000, 5800000],
        kdchavit: [3500000, 4200000, 3100000, 5800000, 4900000, 4100000, 6200000, 5900000, 4500000, 5800000, 6500000, 6000000],
        nuatthai: [850000, 920000, 780000, 1050000, 980000, 1120000, 1200000, 1150000, 1050000, 1180000, 1250000, 1100000],
        autocasa: [380000, 420000, 350000, 480000, 520000, 450000, 550000, 510000, 480000, 530000, 580000, 490000]
    },

    // Activity log
    activityLog: [
        { type: 'success', message: 'Invoice INV-2026-007 paid in full by Roberto Tan', company: 'autocasa', time: '2026-02-23T09:30:00' },
        { type: 'info', message: 'New booking BK-003 confirmed - Maria Reyes (Therapist)', company: 'nuatthai', time: '2026-02-23T09:15:00' },
        { type: 'warning', message: 'ATF Fluid stock is below minimum (3 remaining)', company: 'autocasa', time: '2026-02-23T08:45:00' },
        { type: 'success', message: 'Project PRJ-001 Phase "Foundation" marked 100% complete', company: 'dheekay', time: '2026-02-23T08:30:00' },
        { type: 'danger', message: 'Invoice INV-2026-003 is overdue (₱8,500,000)', company: 'kdchavit', time: '2026-02-23T08:00:00' },
        { type: 'info', message: 'Job Card JC-004 completed - Ford Ranger Engine Decarb', company: 'autocasa', time: '2026-02-22T17:30:00' },
        { type: 'success', message: 'Booking BK-007 completed - Liza Reyes at Makati Branch', company: 'nuatthai', time: '2026-02-22T17:00:00' },
        { type: 'warning', message: 'Commercial Building Phase 2 - Excavation 8% over budget', company: 'dheekay', time: '2026-02-22T14:00:00' },
        { type: 'info', message: 'New customer Pedro Alvarez registered', company: 'autocasa', time: '2026-02-22T10:00:00' },
        { type: 'success', message: 'Bridge Rehabilitation reached 55% completion', company: 'kdchavit', time: '2026-02-22T09:00:00' }
    ],

    // Notifications
    notifications: [
        { id: 1, type: 'danger', icon: 'fa-exclamation-triangle', title: 'Overdue Invoice', message: 'INV-2026-003 (₱8.5M) from DPWH is past due', time: '2026-02-23T08:00:00', read: false },
        { id: 2, type: 'warning', icon: 'fa-box-open', title: 'Low Stock Alert', message: 'ATF Fluid and Brake Pads are below minimum', time: '2026-02-23T08:45:00', read: false },
        { id: 3, type: 'info', icon: 'fa-calendar', title: 'Today\'s Bookings', message: '4 massage appointments scheduled today', time: '2026-02-23T07:00:00', read: false },
        { id: 4, type: 'warning', icon: 'fa-hard-hat', title: 'Budget Alert', message: 'Commercial Building excavation is 8% over budget', time: '2026-02-22T14:00:00', read: false },
        { id: 5, type: 'success', icon: 'fa-check-circle', title: 'Payment Received', message: '₱22,500 received from Roberto Tan (AutoCasa)', time: '2026-02-23T09:30:00', read: false }
    ]
};

/* ========================================
   UBMS - Main Application Controller
   Navigation, routing, and lifecycle
   ======================================== */

const App = {
    currentModule: 'dashboard',
    activeCompany: 'all',
    charts: {},
    sidebarCollapsed: false,

    // ---- Initialize ----
    init() {
        if (!Auth.init()) return;

        this.activeCompany = Auth.getCompany();
        this.setupUI();
        this.setupNavVisibility();
        this.loadNotifications();
        this.navigate('dashboard');

        // Hide loading screen
        const ls = document.getElementById('loadingScreen');
        if (ls) ls.style.display = 'none';
    },

    // ---- UI Setup ----
    setupUI() {
        // User info
        document.getElementById('userName').textContent = Auth.getName();
        document.getElementById('userRole').textContent = Auth.getRole().charAt(0).toUpperCase() + Auth.getRole().slice(1);

        // Company selector
        const sel = document.getElementById('activeCompany');
        if (sel) {
            sel.value = this.activeCompany;
            // If not owner, restrict to their company
            if (!Auth.isOwner() && Auth.getRole() !== 'accountant') {
                sel.value = this.activeCompany;
                if (this.activeCompany !== 'all') {
                    // Hide other companies
                    Array.from(sel.options).forEach(opt => {
                        if (opt.value !== this.activeCompany && opt.value !== 'all') {
                            opt.style.display = 'none';
                        }
                    });
                }
            }
        }

        this.updateCompanyBadge();

        // Theme
        const savedTheme = Utils.storage.get('theme', 'light');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('themeIcon').className = 'fas fa-sun';
        }
    },

    // ---- Navigation Visibility based on company ----
    setupNavVisibility() {
        const company = this.activeCompany;
        const navConstruction = document.getElementById('navConstruction');
        const navWellness = document.getElementById('navWellness');
        const navAutomotive = document.getElementById('navAutomotive');

        if (company === 'all') {
            navConstruction.style.display = '';
            navWellness.style.display = '';
            navAutomotive.style.display = '';
        } else {
            const type = DataStore.companies[company]?.type;
            navConstruction.style.display = (type === 'construction') ? '' : 'none';
            navWellness.style.display = (type === 'wellness') ? '' : 'none';
            navAutomotive.style.display = (type === 'automotive') ? '' : 'none';
        }
    },

    // ---- Module Navigation ----
    navigate(module) {
        if (!Auth.canAccessModule(module)) {
            this.showToast('Access denied for this module', 'error');
            return;
        }

        this.currentModule = module;

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === module);
        });

        // Update breadcrumb
        const names = {
            dashboard: 'Group Dashboard', crm: 'Customer Relationship Management',
            financial: 'Financial Management', reports: 'Reports & Analytics',
            construction: 'Project Management', jobcosting: 'Job Costing',
            subcontractors: 'Subcontractor Management',
            booking: 'Booking Management', therapists: 'Therapist Management',
            pos: 'Point of Sale', membership: 'Membership Management',
            workshop: 'Workshop Management', vehicles: 'Vehicle History',
            parts: 'Parts Inventory', inspections: 'Digital Inspections',
            settings: 'Administration & Settings'
        };
        document.getElementById('breadcrumb').innerHTML = `<span class="breadcrumb-item">${names[module] || module}</span>`;

        // Render module
        const content = document.getElementById('contentArea');
        content.innerHTML = '<div class="loading-screen"><div class="spinner"></div><p>Loading...</p></div>';

        // Slight delay for smooth transition
        setTimeout(() => {
            this.renderModule(module);
        }, 100);
    },

    renderModule(module) {
        const content = document.getElementById('contentArea');
        switch (module) {
            case 'dashboard': Dashboard.render(content); break;
            case 'crm': CRM.render(content); break;
            case 'financial': Financial.render(content); break;
            case 'reports': Reports.render(content); break;
            case 'construction': Construction.render(content); break;
            case 'jobcosting': Construction.renderJobCosting(content); break;
            case 'subcontractors': Construction.renderSubcontractors(content); break;
            case 'booking': Wellness.renderBookings(content); break;
            case 'therapists': Wellness.renderTherapists(content); break;
            case 'pos': Wellness.renderPOS(content); break;
            case 'membership': Wellness.renderMembership(content); break;
            case 'workshop': Automotive.renderWorkshop(content); break;
            case 'vehicles': Automotive.renderVehicles(content); break;
            case 'parts': Automotive.renderParts(content); break;
            case 'inspections': Automotive.renderInspections(content); break;
            case 'settings': Settings.render(content); break;
            default:
                content.innerHTML = `<div class="empty-state"><i class="fas fa-tools"></i><h3>Module Not Found</h3><p>This module is under development.</p></div>`;
        }
    },

    // ---- Company Switching ----
    switchCompany(company) {
        this.activeCompany = company;
        this.setupNavVisibility();
        this.updateCompanyBadge();
        this.navigate(this.currentModule);
    },

    updateCompanyBadge() {
        const badge = document.getElementById('companyBadge');
        const icon = Utils.getCompanyIcon(this.activeCompany);
        const name = Utils.getCompanyName(this.activeCompany);
        badge.innerHTML = `<i class="fas ${icon}"></i><span>${name}</span>`;
        badge.style.color = Utils.getCompanyColor(this.activeCompany);
        badge.style.borderColor = Utils.getCompanyColor(this.activeCompany) + '30';
        badge.style.background = Utils.getCompanyColor(this.activeCompany) + '12';
    },

    // ---- Sidebar ----
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 1024) {
            sidebar.classList.toggle('mobile-open');
        } else {
            sidebar.classList.toggle('collapsed');
            this.sidebarCollapsed = !this.sidebarCollapsed;
        }
    },

    // ---- Theme ----
    toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            document.getElementById('themeIcon').className = 'fas fa-moon';
            Utils.storage.set('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('themeIcon').className = 'fas fa-sun';
            Utils.storage.set('theme', 'dark');
        }
        // Re-render current module to update chart colors
        this.renderModule(this.currentModule);
    },

    // ---- Notifications ----
    loadNotifications() {
        const list = document.getElementById('notifList');
        const badge = document.getElementById('notifBadge');
        const unread = DataStore.notifications.filter(n => !n.read);
        badge.textContent = unread.length;
        badge.style.display = unread.length > 0 ? 'flex' : 'none';

        list.innerHTML = DataStore.notifications.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}">
                <div class="notif-icon ${n.type}"><i class="fas ${n.icon}"></i></div>
                <div class="notif-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <span class="notif-time">${Utils.formatRelative(n.time)}</span>
                </div>
            </div>
        `).join('');
    },

    toggleNotifications() {
        document.getElementById('notificationPanel').classList.toggle('open');
    },

    clearNotifications() {
        DataStore.notifications.forEach(n => n.read = true);
        this.loadNotifications();
        this.showToast('All notifications cleared', 'success');
    },

    // ---- Modal ----
    openModal(title, bodyHtml, footerHtml = '', wide = false) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHtml;
        document.getElementById('modalFooter').innerHTML = footerHtml;
        document.getElementById('modalOverlay').classList.add('open');
        const container = document.getElementById('modalContainer');
        container.classList.add('open');
        if (wide) container.classList.add('wide');
        else container.classList.remove('wide');
    },

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('open');
        document.getElementById('modalContainer').classList.remove('open');
    },

    // ---- Toast ----
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const icons = { success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle', info: 'fa-info-circle' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // ---- Global Search ----
    globalSearch: Utils.debounce(function(query) {
        if (!query || query.length < 2) return;
        console.log('Searching:', query);
        // Search across all data
        const results = [];
        const q = query.toLowerCase();

        DataStore.customers.forEach(c => {
            if (c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)) {
                results.push({ type: 'Customer', name: c.name, module: 'crm', id: c.id });
            }
        });
        DataStore.projects.forEach(p => {
            if (p.name.toLowerCase().includes(q)) {
                results.push({ type: 'Project', name: p.name, module: 'construction', id: p.id });
            }
        });
        DataStore.vehicles.forEach(v => {
            if (v.plate.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) {
                results.push({ type: 'Vehicle', name: `${v.make} ${v.model} (${v.plate})`, module: 'vehicles', id: v.id });
            }
        });

        if (results.length > 0) {
            let html = '<div style="padding:8px"><h4 style="margin-bottom:12px">Search Results</h4>';
            results.forEach(r => {
                html += `<div class="notif-item" onclick="App.closeModal();App.navigate('${r.module}')" style="cursor:pointer">
                    <div class="notif-content"><h4>${r.name}</h4><p>${r.type} — ${r.id}</p></div>
                </div>`;
            });
            html += '</div>';
            App.openModal(`Search: "${query}"`, html);
        }
    }, 500),

    // ---- Logout ----
    logout() {
        Auth.logout();
    },

    // ---- Helper: Get filtered data by active company ----
    getFilteredData(dataArray, companyField = 'company') {
        if (this.activeCompany === 'all') return dataArray;
        return dataArray.filter(item => item[companyField] === this.activeCompany);
    }
};

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => App.init());

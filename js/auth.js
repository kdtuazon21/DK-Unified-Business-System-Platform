/* ========================================
   UBMS - Authentication Module
   Session management and RBAC
   ======================================== */

const Auth = {
    session: null,

    init() {
        const stored = localStorage.getItem('ubms_session');
        if (!stored) {
            window.location.href = 'login.html';
            return false;
        }
        this.session = JSON.parse(stored);
        if (!this.session.isLoggedIn) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    getSession() {
        return this.session;
    },

    getRole() {
        return this.session?.role || 'staff';
    },

    getCompany() {
        return this.session?.company || 'all';
    },

    getName() {
        return this.session?.name || 'User';
    },

    isOwner() {
        return this.session?.role === 'owner';
    },

    isManager() {
        return ['owner', 'manager'].includes(this.session?.role);
    },

    canAccessCompany(companyId) {
        if (this.isOwner() || this.session?.role === 'accountant') return true;
        return this.session?.company === companyId || this.session?.company === 'all';
    },

    canAccessModule(module) {
        const role = this.getRole();
        const company = this.getCompany();

        // Owner and accountant can see everything
        if (role === 'owner' || role === 'accountant') return true;

        // Module access by company type
        const constructionModules = ['construction', 'jobcosting', 'subcontractors'];
        const wellnessModules = ['booking', 'therapists', 'pos', 'membership'];
        const automotiveModules = ['workshop', 'vehicles', 'parts', 'inspections'];

        if (company === 'dheekay' || company === 'kdchavit') {
            return !wellnessModules.includes(module) && !automotiveModules.includes(module);
        }
        if (company === 'nuatthai') {
            return !constructionModules.includes(module) && !automotiveModules.includes(module);
        }
        if (company === 'autocasa') {
            return !constructionModules.includes(module) && !wellnessModules.includes(module);
        }
        return true;
    },

    logout() {
        localStorage.removeItem('ubms_session');
        window.location.href = 'login.html';
    }
};

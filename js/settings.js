/* ========================================
   UBMS - Settings / Administration Module
   Users, Roles, Company, Audit Log
   ======================================== */

const Settings = {
    render(container) {
        container.innerHTML = `
        <div class="section-header mb-3">
            <h2>Administration & Settings</h2>
        </div>

        <div class="tabs mb-3">
            <button class="tab-btn active" onclick="Settings.switchTab('users',this)">Users</button>
            <button class="tab-btn" onclick="Settings.switchTab('roles',this)">Roles & Permissions</button>
            <button class="tab-btn" onclick="Settings.switchTab('companies',this)">Company Settings</button>
            <button class="tab-btn" onclick="Settings.switchTab('audit',this)">Audit Log</button>
        </div>

        <div id="settingsContent">
            ${this.renderUsers()}
        </div>`;
    },

    switchTab(tab, btn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const el = document.getElementById('settingsContent');
        switch (tab) {
            case 'users': el.innerHTML = this.renderUsers(); break;
            case 'roles': el.innerHTML = this.renderRoles(); break;
            case 'companies': el.innerHTML = this.renderCompanySettings(); break;
            case 'audit': el.innerHTML = this.renderAuditLog(); break;
        }
    },

    renderUsers() {
        const users = [
            { id: 'U001', name: 'System Owner', username: 'owner', role: 'owner', email: 'owner@ubms.ph', companies: ['all'], lastLogin: '2025-01-15 08:30', status: 'active' },
            { id: 'U002', name: 'Dheekay Manager', username: 'manager', role: 'manager', email: 'manager@dheekay.ph', companies: ['dheekay'], lastLogin: '2025-01-15 09:15', status: 'active' },
            { id: 'U003', name: 'Nuat Thai Manager', username: 'ntmanager', role: 'manager', email: 'manager@nuatthai.ph', companies: ['nuatthai'], lastLogin: '2025-01-14 14:20', status: 'active' },
            { id: 'U004', name: 'AutoCasa Manager', username: 'acmanager', role: 'manager', email: 'manager@autocasa.ph', companies: ['autocasa'], lastLogin: '2025-01-15 07:45', status: 'active' },
            { id: 'U005', name: 'Group Accountant', username: 'accountant', role: 'accountant', email: 'accounting@ubms.ph', companies: ['all'], lastLogin: '2025-01-13 16:30', status: 'active' },
            { id: 'U006', name: 'KDChavit Staff', username: 'staff', role: 'staff', email: 'staff@kdchavit.ph', companies: ['kdchavit'], lastLogin: '2025-01-12 11:00', status: 'active' },
            { id: 'U007', name: 'Receptionist NT', username: 'receptionist', role: 'staff', email: 'front@nuatthai.ph', companies: ['nuatthai'], lastLogin: '2025-01-10 08:00', status: 'inactive' }
        ];

        return `
        <div class="section-header mb-2">
            <h3>User Management</h3>
            <button class="btn btn-primary" onclick="Settings.openAddUser()"><i class="fas fa-user-plus"></i> Add User</button>
        </div>

        <div class="card">
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'User', render: r => `<div style="display:flex;align-items:center;gap:10px"><div class="avatar" style="background:var(--secondary);color:#fff">${r.name.split(' ').map(n=>n[0]).join('')}</div><div><strong>${r.name}</strong><div style="font-size:11px;color:var(--text-muted)">@${r.username}</div></div></div>` },
                        { label: 'Role', render: r => `<span class="badge-tag badge-${r.role === 'owner' ? 'danger' : r.role === 'manager' ? 'warning' : r.role === 'accountant' ? 'info' : 'neutral'}">${r.role}</span>` },
                        { label: 'Email', key: 'email' },
                        { label: 'Companies', render: r => r.companies.includes('all') ? '<span class="badge-tag badge-teal">All Companies</span>' : r.companies.map(c => `<span class="badge-tag badge-${c}" style="margin:1px">${c}</span>`).join(' ') },
                        { label: 'Last Login', key: 'lastLogin' },
                        { label: 'Status', render: r => `<span class="badge-tag ${r.status === 'active' ? 'badge-success' : 'badge-neutral'}">${r.status}</span>` }
                    ],
                    users,
                    {
                        actions: r => `
                            <button class="btn btn-sm btn-secondary" title="Edit"><i class="fas fa-edit"></i></button>
                            ${r.role !== 'owner' ? `<button class="btn btn-sm btn-danger" style="margin-left:4px" title="Deactivate"><i class="fas fa-ban"></i></button>` : ''}
                        `
                    }
                )}
            </div>
        </div>`;
    },

    openAddUser() {
        App.openModal('Add User', `
        <form>
            <div class="form-row">
                <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="newUserName"></div>
                <div class="form-group"><label>Username</label><input type="text" class="form-control" id="newUserUsername"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Email</label><input type="email" class="form-control" id="newUserEmail"></div>
                <div class="form-group"><label>Role</label>
                    <select class="form-control" id="newUserRole">
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="accountant">Accountant</option>
                    </select>
                </div>
            </div>
            <div class="form-group"><label>Company Access</label>
                <div style="display:flex;gap:12px;flex-wrap:wrap">
                    ${Object.entries(DataStore.companies).map(([k, v]) => `<label style="display:flex;align-items:center;gap:6px;font-size:13px"><input type="checkbox" value="${k}"> ${v.name}</label>`).join('')}
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Password</label><input type="password" class="form-control" id="newUserPass"></div>
                <div class="form-group"><label>Confirm Password</label><input type="password" class="form-control" id="newUserPassConfirm"></div>
            </div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="App.closeModal();App.showToast('User created','success')"><i class="fas fa-save"></i> Create User</button>
        `);
    },

    renderRoles() {
        const roles = [
            { role: 'Owner', description: 'Full system access. Can manage all companies, users, and settings.',
              perms: ['Dashboard (Group)', 'CRM', 'Financial', 'Reports', 'Construction Hub', 'Wellness Hub', 'Automotive Hub', 'Settings', 'User Management', 'Audit Log'] },
            { role: 'Manager', description: 'Company-level access. Can manage operations within assigned companies.',
              perms: ['Dashboard (Company)', 'CRM', 'Financial', 'Reports', 'Industry Hub (assigned)', 'Staff Management'] },
            { role: 'Accountant', description: 'Financial access across companies. Read-only on operational modules.',
              perms: ['Dashboard (Read)', 'Financial (Full)', 'Reports', 'Chart of Accounts', 'Tax Reports'] },
            { role: 'Staff', description: 'Limited access to assigned company modules. Cannot modify financial data.',
              perms: ['Dashboard (Company, Read)', 'CRM (Read)', 'Industry Hub (assigned, limited)'] }
        ];

        return `
        <h3 class="mb-2">Role Definitions & Permissions</h3>
        <div class="grid-2" style="gap:16px">
            ${roles.map(r => `
            <div class="card">
                <div class="card-header"><h3>${r.role}</h3></div>
                <div class="card-body">
                    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">${r.description}</p>
                    <h4 style="font-size:12px;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase">Permissions</h4>
                    <div style="display:flex;flex-wrap:wrap;gap:6px">
                        ${r.perms.map(p => `<span class="badge-tag badge-teal" style="font-size:11px">${p}</span>`).join('')}
                    </div>
                </div>
            </div>`).join('')}
        </div>`;
    },

    renderCompanySettings() {
        return `
        <h3 class="mb-2">Company Profiles</h3>
        ${Object.entries(DataStore.companies).map(([key, co]) => `
        <div class="card mb-2">
            <div class="card-header" style="border-bottom:3px solid ${co.color}">
                <div style="display:flex;align-items:center;gap:12px">
                    <div style="width:40px;height:40px;background:${co.color};border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px">
                        <i class="fas fa-${co.icon}"></i>
                    </div>
                    <div>
                        <h3>${co.name}</h3>
                        <span style="font-size:12px;color:var(--text-muted)">${key.toUpperCase()}</span>
                    </div>
                </div>
                <button class="btn btn-sm btn-secondary"><i class="fas fa-edit"></i> Edit</button>
            </div>
            <div class="card-body">
                <div class="grid-2" style="gap:12px;font-size:13px">
                    <div><strong>Address:</strong> ${co.address}</div>
                    <div><strong>TIN:</strong> ${co.tin}</div>
                    <div><strong>Industry:</strong> ${key === 'dheekay' || key === 'kdchavit' ? 'Construction' : key === 'nuatthai' ? 'Wellness & Spa' : 'Automotive'}</div>
                    <div><strong>Brand Color:</strong> <span style="display:inline-flex;align-items:center;gap:6px"><span style="width:14px;height:14px;background:${co.color};border-radius:3px;display:inline-block"></span>${co.color}</span></div>
                </div>
            </div>
        </div>`).join('')}

        <div class="card mt-3">
            <div class="card-header"><h3>System Preferences</h3></div>
            <div class="card-body">
                <div class="grid-2" style="gap:16px">
                    <div class="form-group">
                        <label>Currency</label>
                        <select class="form-control"><option selected>₱ Philippine Peso (PHP)</option></select>
                    </div>
                    <div class="form-group">
                        <label>Date Format</label>
                        <select class="form-control"><option selected>MMM DD, YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select>
                    </div>
                    <div class="form-group">
                        <label>Fiscal Year Start</label>
                        <select class="form-control"><option selected>January</option></select>
                    </div>
                    <div class="form-group">
                        <label>Default Tax Rate (VAT)</label>
                        <input type="number" class="form-control" value="12" min="0" max="100">
                    </div>
                </div>
                <button class="btn btn-primary mt-2"><i class="fas fa-save"></i> Save Preferences</button>
            </div>
        </div>`;
    },

    renderAuditLog() {
        const logs = [
            { time: '2025-01-15 09:32:15', user: 'owner', action: 'Login', detail: 'Successful login from 192.168.1.1', level: 'info' },
            { time: '2025-01-15 09:30:00', user: 'manager', action: 'Created Invoice', detail: 'INV-2025-009 for ₱580,000', level: 'info' },
            { time: '2025-01-15 08:45:22', user: 'accountant', action: 'Exported Report', detail: 'Annual P&L — All Companies', level: 'info' },
            { time: '2025-01-14 16:20:10', user: 'ntmanager', action: 'Updated Booking', detail: 'BK-007 status → completed', level: 'info' },
            { time: '2025-01-14 14:15:33', user: 'acmanager', action: 'Created Job Card', detail: 'JC-006 for Toyota Vios (XYZ 789)', level: 'info' },
            { time: '2025-01-14 11:00:05', user: 'staff', action: 'Failed Login', detail: 'Invalid password attempt', level: 'warning' },
            { time: '2025-01-13 17:45:00', user: 'owner', action: 'Updated User', detail: 'Changed role for U007 → inactive', level: 'warning' },
            { time: '2025-01-13 15:30:22', user: 'manager', action: 'Project Update', detail: 'PRJ-001 progress → 72%', level: 'info' },
            { time: '2025-01-13 10:12:00', user: 'accountant', action: 'Payment Recorded', detail: '₱2,000,000 for INV-2025-001', level: 'info' },
            { time: '2025-01-12 08:00:00', user: 'system', action: 'Backup', detail: 'Automated daily backup completed', level: 'success' }
        ];

        return `
        <div class="section-header mb-2">
            <h3>Audit Log</h3>
            <div class="section-actions">
                <select class="form-control" style="width:120px">
                    <option value="all">All Levels</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                </select>
                <button class="btn btn-secondary"><i class="fas fa-download"></i> Export</button>
            </div>
        </div>

        <div class="card">
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'Timestamp', render: r => `<span style="font-family:monospace;font-size:12px">${r.time}</span>` },
                        { label: 'User', render: r => `<span class="badge-tag badge-neutral">${r.user}</span>` },
                        { label: 'Action', render: r => `<strong>${r.action}</strong>` },
                        { label: 'Details', render: r => `<span style="font-size:12px;color:var(--text-secondary)">${r.detail}</span>` },
                        { label: 'Level', render: r => `<span class="badge-tag ${r.level === 'warning' ? 'badge-warning' : r.level === 'success' ? 'badge-success' : 'badge-info'}">${r.level}</span>` }
                    ],
                    logs
                )}
            </div>
        </div>`;
    }
};

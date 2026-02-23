/* ========================================
   UBMS - Construction Hub Module
   Projects, Job Costing, Subcontractors
   ======================================== */

const Construction = {
    // ============================================================
    //  PROJECT MANAGEMENT
    // ============================================================
    render(container) {
        const projects = App.activeCompany === 'all'
            ? DataStore.projects
            : DataStore.projects.filter(p => p.company === App.activeCompany);

        const active = projects.filter(p => p.status === 'in-progress');
        const completed = projects.filter(p => p.status === 'completed');
        const totalBudget = projects.reduce((s, p) => s + p.budget, 0);

        container.innerHTML = `
        <div class="grid-4 mb-3">
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon teal"><i class="fas fa-project-diagram"></i></div></div>
                <div class="stat-value">${projects.length}</div>
                <div class="stat-label">Total Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon blue"><i class="fas fa-spinner"></i></div></div>
                <div class="stat-value">${active.length}</div>
                <div class="stat-label">Active Projects</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div>
                <div class="stat-value">${completed.length}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon orange"><i class="fas fa-peso-sign"></i></div></div>
                <div class="stat-value">${Utils.formatCurrency(totalBudget, true)}</div>
                <div class="stat-label">Total Budget</div>
            </div>
        </div>

        <!-- Project Cards -->
        <div class="section-header">
            <h2>Projects</h2>
            <div class="section-actions">
                <select class="form-control" style="width:160px" id="projStatusFilter" onchange="Construction.filterProjects()">
                    <option value="all">All Statuses</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
                <button class="btn btn-primary" onclick="Construction.openNewProject()"><i class="fas fa-plus"></i> New Project</button>
            </div>
        </div>

        <div id="projectCardContainer">
            ${this.renderProjectCards(projects)}
        </div>`;
    },

    renderProjectCards(projects) {
        if (projects.length === 0) {
            return '<div class="empty-state"><i class="fas fa-hard-hat"></i><h3>No Projects</h3><p>Create your first project to get started.</p></div>';
        }

        return `<div class="grid-2">${projects.map(p => {
            const co = DataStore.companies[p.company];
            const budgetUsed = p.budget > 0 ? ((p.actualCost / p.budget) * 100).toFixed(0) : 0;
            const overBudget = p.actualCost > p.budget * 0.9;
            const client = DataStore.customers.find(c => c.id === p.client);

            return `
            <div class="card" style="cursor:pointer" onclick="Construction.viewProject('${p.id}')">
                <div class="card-header" style="border-bottom:3px solid ${co?.color || 'var(--secondary)'}">
                    <div>
                        <h3>${p.name}</h3>
                        <span style="font-size:11px;color:var(--text-muted)">${p.id} • ${co?.name || p.company}</span>
                    </div>
                    <span class="badge-tag ${Utils.getStatusClass(p.status)}">${p.status}</span>
                </div>
                <div class="card-body">
                    <div style="margin-bottom:16px">
                        <div class="flex-between mb-1">
                            <span style="font-size:12px;color:var(--text-secondary)">Progress</span>
                            <span style="font-size:14px;font-weight:700;color:var(--secondary)">${p.progress}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill ${p.progress === 100 ? 'green' : p.progress > 50 ? 'blue' : 'orange'}" style="width:${p.progress}%"></div>
                        </div>
                    </div>

                    <div class="grid-2" style="gap:12px;font-size:12px">
                        <div>
                            <div style="color:var(--text-muted)">Budget</div>
                            <div style="font-weight:600">${Utils.formatCurrency(p.budget, true)}</div>
                        </div>
                        <div>
                            <div style="color:var(--text-muted)">Actual Cost</div>
                            <div style="font-weight:600;color:${overBudget ? 'var(--danger)' : 'inherit'}">${Utils.formatCurrency(p.actualCost, true)} (${budgetUsed}%)</div>
                        </div>
                        <div>
                            <div style="color:var(--text-muted)">Manager</div>
                            <div style="font-weight:500">${p.manager}</div>
                        </div>
                        <div>
                            <div style="color:var(--text-muted)">Client</div>
                            <div style="font-weight:500">${client?.name || 'N/A'}</div>
                        </div>
                        <div>
                            <div style="color:var(--text-muted)">Start</div>
                            <div>${Utils.formatDate(p.startDate)}</div>
                        </div>
                        <div>
                            <div style="color:var(--text-muted)">Target End</div>
                            <div>${Utils.formatDate(p.endDate)}</div>
                        </div>
                    </div>

                    ${overBudget ? `<div style="margin-top:12px;padding:8px 12px;background:rgba(239,68,68,0.08);border-radius:6px;font-size:12px;color:var(--danger)"><i class="fas fa-exclamation-triangle" style="margin-right:6px"></i>Near/Over budget alert</div>` : ''}
                </div>
            </div>`;
        }).join('')}</div>`;
    },

    filterProjects() {
        const status = document.getElementById('projStatusFilter')?.value || 'all';
        let projects = App.activeCompany === 'all' ? DataStore.projects : DataStore.projects.filter(p => p.company === App.activeCompany);
        if (status !== 'all') projects = projects.filter(p => p.status === status);
        document.getElementById('projectCardContainer').innerHTML = this.renderProjectCards(projects);
    },

    viewProject(id) {
        const p = DataStore.projects.find(proj => proj.id === id);
        if (!p) return;

        const client = DataStore.customers.find(c => c.id === p.client);
        const budgetUsed = p.budget > 0 ? ((p.actualCost / p.budget) * 100).toFixed(1) : 0;

        let html = `
        <div class="flex-between mb-3">
            <div>
                <h2 style="font-size:22px;margin-bottom:4px">${p.name}</h2>
                <p style="color:var(--text-secondary)">${p.description}</p>
            </div>
            <span class="badge-tag ${Utils.getStatusClass(p.status)}" style="font-size:14px;padding:6px 16px">${p.status}</span>
        </div>

        <div class="grid-4 mb-3" style="gap:12px">
            <div style="background:var(--bg);padding:16px;border-radius:var(--radius)">
                <div style="font-size:11px;color:var(--text-muted)">Budget</div>
                <div style="font-size:18px;font-weight:700">${Utils.formatCurrency(p.budget, true)}</div>
            </div>
            <div style="background:var(--bg);padding:16px;border-radius:var(--radius)">
                <div style="font-size:11px;color:var(--text-muted)">Spent</div>
                <div style="font-size:18px;font-weight:700;color:${p.actualCost > p.budget * 0.9 ? 'var(--danger)' : 'var(--secondary)'}">${Utils.formatCurrency(p.actualCost, true)}</div>
            </div>
            <div style="background:var(--bg);padding:16px;border-radius:var(--radius)">
                <div style="font-size:11px;color:var(--text-muted)">Remaining</div>
                <div style="font-size:18px;font-weight:700">${Utils.formatCurrency(p.budget - p.actualCost, true)}</div>
            </div>
            <div style="background:var(--bg);padding:16px;border-radius:var(--radius)">
                <div style="font-size:11px;color:var(--text-muted)">Progress</div>
                <div style="font-size:18px;font-weight:700;color:var(--secondary)">${p.progress}%</div>
            </div>
        </div>

        <div class="grid-2 mb-2" style="font-size:13px;gap:8px">
            <div><strong>Client:</strong> ${client?.name || 'N/A'}</div>
            <div><strong>Manager:</strong> ${p.manager}</div>
            <div><strong>Location:</strong> ${p.location}</div>
            <div><strong>Company:</strong> <span class="badge-tag badge-${p.company}">${p.company}</span></div>
            <div><strong>Start:</strong> ${Utils.formatDate(p.startDate)}</div>
            <div><strong>End:</strong> ${Utils.formatDate(p.endDate)}</div>
        </div>`;

        // Phases
        if (p.phases && p.phases.length > 0) {
            html += `
            <h4 style="margin:24px 0 12px">Project Phases</h4>
            ${p.phases.map(ph => `
                <div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px">
                    <div class="flex-between mb-1">
                        <div>
                            <span style="font-weight:600">${ph.name}</span>
                            <span class="badge-tag ${Utils.getStatusClass(ph.status)}" style="margin-left:8px">${ph.status}</span>
                        </div>
                        <span style="font-weight:700;color:var(--secondary)">${ph.progress}%</span>
                    </div>
                    <div class="progress-bar" style="margin-bottom:8px">
                        <div class="progress-fill ${ph.progress === 100 ? 'green' : 'blue'}" style="width:${ph.progress}%"></div>
                    </div>
                    <div class="flex-between" style="font-size:12px;color:var(--text-secondary)">
                        <span>Budget: ${Utils.formatCurrency(ph.budget, true)}</span>
                        <span>Actual: ${Utils.formatCurrency(ph.actual, true)} (${ph.budget > 0 ? ((ph.actual / ph.budget) * 100).toFixed(0) : 0}%)</span>
                    </div>
                </div>
            `).join('')}`;

            // Gantt-like timeline
            html += `
            <h4 style="margin:24px 0 12px">Timeline (Gantt View)</h4>
            <div class="gantt-container">
                ${p.phases.map((ph, i) => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                    return `
                    <div class="gantt-row">
                        <div class="gantt-label">${ph.name}</div>
                        <div class="gantt-timeline">
                            <div class="gantt-bar" style="left:${i * 22}%;width:${Math.max(ph.progress * 0.7, 15)}%;background:${colors[i % colors.length]}">${ph.progress}%</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        }

        App.openModal('Project Details', html, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Close</button>
            <button class="btn btn-primary"><i class="fas fa-edit"></i> Edit Project</button>
        `, true);
    },

    openNewProject() {
        const html = `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Company <span class="required">*</span></label>
                    <select class="form-control" id="newProjCompany">
                        <option value="dheekay" ${App.activeCompany === 'dheekay' ? 'selected' : ''}>Dheekay Builders OPC</option>
                        <option value="kdchavit" ${App.activeCompany === 'kdchavit' ? 'selected' : ''}>KDChavit Construction</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select class="form-control" id="newProjPriority">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Project Name <span class="required">*</span></label>
                <input type="text" class="form-control" id="newProjName" placeholder="e.g., Tower Site Bravo">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="form-control" id="newProjDesc" rows="2"></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Client</label>
                    <select class="form-control" id="newProjClient">
                        ${DataStore.customers.filter(c => c.tags?.includes('construction-client')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Project Manager</label>
                    <input type="text" class="form-control" id="newProjManager" placeholder="Engr. ...">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Budget (₱)</label>
                    <input type="number" class="form-control" id="newProjBudget" min="0">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" class="form-control" id="newProjLocation">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" class="form-control" id="newProjStart">
                </div>
                <div class="form-group">
                    <label>Target End Date</label>
                    <input type="date" class="form-control" id="newProjEnd">
                </div>
            </div>
        </form>`;

        App.openModal('Create New Project', html, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Construction.saveNewProject()"><i class="fas fa-save"></i> Create</button>
        `);
    },

    saveNewProject() {
        const name = document.getElementById('newProjName')?.value;
        if (!name) { App.showToast('Project name is required', 'error'); return; }

        DataStore.projects.push({
            id: Utils.generateId('PRJ'),
            company: document.getElementById('newProjCompany').value,
            name,
            description: document.getElementById('newProjDesc')?.value || '',
            client: document.getElementById('newProjClient').value,
            manager: document.getElementById('newProjManager')?.value || '',
            budget: parseFloat(document.getElementById('newProjBudget')?.value || 0),
            actualCost: 0,
            location: document.getElementById('newProjLocation')?.value || '',
            startDate: document.getElementById('newProjStart')?.value || '',
            endDate: document.getElementById('newProjEnd')?.value || '',
            status: 'pending',
            priority: document.getElementById('newProjPriority').value,
            progress: 0,
            phases: []
        });

        App.closeModal();
        App.showToast(`Project "${name}" created successfully`, 'success');
        this.render(document.getElementById('contentArea'));
    },

    // ============================================================
    //  JOB COSTING
    // ============================================================
    renderJobCosting(container) {
        const projects = App.activeCompany === 'all'
            ? DataStore.projects.filter(p => p.status === 'in-progress')
            : DataStore.projects.filter(p => p.company === App.activeCompany && p.status === 'in-progress');

        container.innerHTML = `
        <div class="section-header mb-3">
            <h2>Job Costing — Actual vs Budget</h2>
        </div>

        <div class="card mb-3">
            <div class="card-header"><h3>Budget vs Actual by Project</h3></div>
            <div class="card-body">
                <div class="chart-container large"><canvas id="jobCostChart"></canvas></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h3>Cost Breakdown</h3></div>
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'Project', render: r => `<strong>${r.name}</strong>` },
                        { label: 'Company', render: r => `<span class="badge-tag badge-${r.company}">${r.company}</span>` },
                        { label: 'Budget', render: r => Utils.formatCurrency(r.budget) },
                        { label: 'Actual', render: r => Utils.formatCurrency(r.actualCost) },
                        { label: 'Variance', render: r => {
                            const v = r.budget - r.actualCost;
                            return `<span class="${v >= 0 ? 'text-success' : 'text-danger'}">${v >= 0 ? '+' : ''}${Utils.formatCurrency(v, true)}</span>`;
                        }},
                        { label: '% Used', render: r => {
                            const pct = r.budget > 0 ? ((r.actualCost / r.budget) * 100).toFixed(1) : 0;
                            return `<div style="display:flex;align-items:center;gap:8px">
                                <div class="progress-bar" style="width:100px"><div class="progress-fill ${pct > 90 ? 'red' : pct > 70 ? 'orange' : 'green'}" style="width:${Math.min(pct, 100)}%"></div></div>
                                <span style="font-weight:600;font-size:12px">${pct}%</span>
                            </div>`;
                        }},
                        { label: 'Status', render: r => {
                            const pct = r.budget > 0 ? (r.actualCost / r.budget) * 100 : 0;
                            if (pct > 100) return '<span class="badge-tag badge-danger">Over Budget</span>';
                            if (pct > 90) return '<span class="badge-tag badge-warning">At Risk</span>';
                            return '<span class="badge-tag badge-success">On Track</span>';
                        }}
                    ],
                    projects
                )}
            </div>
        </div>`;

        // Init chart
        setTimeout(() => {
            const canvas = document.getElementById('jobCostChart');
            if (canvas) {
                Utils.destroyChart('jobCostChart');
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: projects.map(p => p.name.substring(0, 25)),
                        datasets: [
                            { label: 'Budget', data: projects.map(p => p.budget), backgroundColor: '#3b82f680', borderColor: '#3b82f6', borderWidth: 1 },
                            { label: 'Actual Cost', data: projects.map(p => p.actualCost), backgroundColor: projects.map(p => p.actualCost > p.budget * 0.9 ? '#ef444480' : '#10b98180'), borderColor: projects.map(p => p.actualCost > p.budget * 0.9 ? '#ef4444' : '#10b981'), borderWidth: 1 }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${Utils.formatCurrency(ctx.raw, true)}` } } },
                        scales: { y: { beginAtZero: true, ticks: { callback: v => Utils.formatCurrency(v, true) } } }
                    }
                });
            }
        }, 100);
    },

    // ============================================================
    //  SUBCONTRACTORS
    // ============================================================
    renderSubcontractors(container) {
        const subs = App.activeCompany === 'all'
            ? DataStore.subcontractors
            : DataStore.subcontractors.filter(s => s.company === App.activeCompany);

        container.innerHTML = `
        <div class="section-header mb-3">
            <h2>Subcontractor Management</h2>
            <button class="btn btn-primary" onclick="Construction.openAddSubcontractor()"><i class="fas fa-plus"></i> Add Subcontractor</button>
        </div>

        <div class="grid-3 mb-3">
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon teal"><i class="fas fa-people-carry"></i></div></div>
                <div class="stat-value">${subs.length}</div>
                <div class="stat-label">Total Subcontractors</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon green"><i class="fas fa-check"></i></div></div>
                <div class="stat-value">${subs.filter(s => s.status === 'active').length}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon orange"><i class="fas fa-star"></i></div></div>
                <div class="stat-value">${(subs.reduce((s, sub) => s + sub.rating, 0) / (subs.length || 1)).toFixed(1)}</div>
                <div class="stat-label">Avg Rating</div>
            </div>
        </div>

        <div class="card">
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'Subcontractor', render: r => `<div><strong>${r.name}</strong><div style="font-size:11px;color:var(--text-muted)">${r.email}</div></div>` },
                        { label: 'Specialty', render: r => `<span class="badge-tag badge-teal">${r.specialty}</span>` },
                        { label: 'Company', render: r => `<span class="badge-tag badge-${r.company}">${r.company}</span>` },
                        { label: 'Phone', key: 'phone' },
                        { label: 'Rating', render: r => `<span style="color:#f59e0b">★</span> ${r.rating}/5.0` },
                        { label: 'Status', render: r => `<span class="badge-tag ${r.status === 'active' ? 'badge-success' : 'badge-neutral'}">${r.status}</span>` }
                    ],
                    subs,
                    {
                        actions: (r) => `
                            <button class="btn btn-sm btn-secondary" title="View" onclick="Construction.viewSubcontractor('${r.id}')"><i class="fas fa-eye"></i></button>
                            <button class="btn btn-sm btn-secondary" title="Edit" style="margin-left:4px"><i class="fas fa-edit"></i></button>
                        `
                    }
                )}
            </div>
        </div>`;
    },

    viewSubcontractor(id) {
        const sub = DataStore.subcontractors.find(s => s.id === id);
        if (!sub) return;
        App.openModal('Subcontractor Details', `
            <div class="grid-2" style="gap:12px">
                <div><strong>Name:</strong> ${sub.name}</div>
                <div><strong>Specialty:</strong> ${sub.specialty}</div>
                <div><strong>Phone:</strong> ${sub.phone}</div>
                <div><strong>Email:</strong> ${sub.email}</div>
                <div><strong>Company:</strong> <span class="badge-tag badge-${sub.company}">${Utils.getCompanyName(sub.company)}</span></div>
                <div><strong>Rating:</strong> ★ ${sub.rating}/5.0</div>
                <div><strong>Status:</strong> <span class="badge-tag ${sub.status === 'active' ? 'badge-success' : 'badge-neutral'}">${sub.status}</span></div>
            </div>
            <h4 style="margin:20px 0 8px">Documents</h4>
            <div style="padding:16px;background:var(--bg);border-radius:var(--radius);text-align:center;color:var(--text-muted)">
                <i class="fas fa-file-alt" style="font-size:24px;margin-bottom:8px"></i><br>
                W-9, Insurance certificates, and contracts would be stored here
            </div>
        `);
    },

    openAddSubcontractor() {
        const html = `
        <form>
            <div class="form-row">
                <div class="form-group"><label>Company Name</label><input type="text" class="form-control" id="newSubName"></div>
                <div class="form-group"><label>Specialty</label><input type="text" class="form-control" id="newSubSpec" placeholder="e.g., Electrical"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Phone</label><input type="text" class="form-control" id="newSubPhone"></div>
                <div class="form-group"><label>Email</label><input type="email" class="form-control" id="newSubEmail"></div>
            </div>
            <div class="form-group">
                <label>Assigned Company</label>
                <select class="form-control" id="newSubCompany">
                    <option value="dheekay">Dheekay Builders</option>
                    <option value="kdchavit">KDChavit Construction</option>
                </select>
            </div>
        </form>`;

        App.openModal('Add Subcontractor', html, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Construction.saveSubcontractor()"><i class="fas fa-save"></i> Save</button>
        `);
    },

    saveSubcontractor() {
        const name = document.getElementById('newSubName')?.value;
        if (!name) { App.showToast('Name is required', 'error'); return; }

        DataStore.subcontractors.push({
            id: Utils.generateId('SUB'),
            name,
            specialty: document.getElementById('newSubSpec')?.value || '',
            phone: document.getElementById('newSubPhone')?.value || '',
            email: document.getElementById('newSubEmail')?.value || '',
            company: document.getElementById('newSubCompany').value,
            status: 'active',
            rating: 0
        });

        App.closeModal();
        App.showToast('Subcontractor added', 'success');
        this.renderSubcontractors(document.getElementById('contentArea'));
    }
};

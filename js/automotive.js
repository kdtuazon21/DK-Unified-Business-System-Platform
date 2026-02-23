/* ========================================
   UBMS - Automotive Hub Module
   Workshop, Vehicles, Parts, Inspections
   ======================================== */

const Automotive = {
    // ============================================================
    //  WORKSHOP MANAGEMENT
    // ============================================================
    renderWorkshop(container) {
        const jobs = DataStore.jobCards;
        const inQueue = jobs.filter(j => j.status === 'in-queue');
        const inProgress = jobs.filter(j => j.status === 'in-progress');
        const waitingParts = jobs.filter(j => j.status === 'waiting-parts');
        const ready = jobs.filter(j => j.status === 'completed');
        const totalRevenue = jobs.filter(j => j.status === 'completed').reduce((s, j) => s + j.total, 0);

        container.innerHTML = `
        <div class="grid-4 mb-3">
            <div class="stat-card"><div class="stat-header"><div class="stat-icon teal"><i class="fas fa-car-wrench"></i></div></div><div class="stat-value">${jobs.length}</div><div class="stat-label">Total Job Cards</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon blue"><i class="fas fa-spinner"></i></div></div><div class="stat-value">${inProgress.length}</div><div class="stat-label">Under Repair</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon orange"><i class="fas fa-box-open"></i></div></div><div class="stat-value">${waitingParts.length}</div><div class="stat-label">Waiting Parts</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon green"><i class="fas fa-peso-sign"></i></div></div><div class="stat-value">${Utils.formatCurrency(totalRevenue, true)}</div><div class="stat-label">Revenue</div></div>
        </div>

        <div class="section-header mb-2">
            <h2>Workshop Status Board</h2>
            <button class="btn btn-primary" onclick="Automotive.openNewJobCard()"><i class="fas fa-plus"></i> New Job Card</button>
        </div>

        <div class="status-board">
            <div class="status-column">
                <div class="status-column-header" style="border-top:3px solid #3b82f6"><div class="flex-between"><span>In Queue</span><span class="badge-tag badge-info">${inQueue.length}</span></div></div>
                ${inQueue.map(j => this.renderJobCardWidget(j)).join('') || '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:12px">Empty</div>'}
            </div>
            <div class="status-column">
                <div class="status-column-header" style="border-top:3px solid #f59e0b"><div class="flex-between"><span>Under Repair</span><span class="badge-tag badge-warning">${inProgress.length}</span></div></div>
                ${inProgress.map(j => this.renderJobCardWidget(j)).join('') || '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:12px">Empty</div>'}
            </div>
            <div class="status-column">
                <div class="status-column-header" style="border-top:3px solid #8b5cf6"><div class="flex-between"><span>Waiting Parts</span><span class="badge-tag badge-neutral">${waitingParts.length}</span></div></div>
                ${waitingParts.map(j => this.renderJobCardWidget(j)).join('') || '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:12px">Empty</div>'}
            </div>
            <div class="status-column">
                <div class="status-column-header" style="border-top:3px solid #10b981"><div class="flex-between"><span>Ready / Completed</span><span class="badge-tag badge-success">${ready.length}</span></div></div>
                ${ready.map(j => this.renderJobCardWidget(j)).join('') || '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:12px">Empty</div>'}
            </div>
        </div>`;
    },

    renderJobCardWidget(job) {
        const vehicle = DataStore.vehicles.find(v => v.id === job.vehicle);
        const customer = DataStore.customers.find(c => c.id === job.customer);
        return `
        <div class="status-card" onclick="Automotive.viewJobCard('${job.id}')" style="cursor:pointer">
            <div class="flex-between mb-1">
                <strong style="font-size:13px">${job.id}</strong>
                <span style="font-size:11px;color:var(--text-muted)">${Utils.formatDate(job.dateIn)}</span>
            </div>
            <div style="font-size:14px;font-weight:600;margin-bottom:4px">${vehicle?.make || ''} ${vehicle?.model || ''}</div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:8px">
                <i class="fas fa-car" style="width:14px"></i> ${vehicle?.plate || 'N/A'} &nbsp;
                <i class="fas fa-user" style="width:14px"></i> ${customer?.name || 'Walk-in'}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
                ${job.services.slice(0, 2).map(s => {
                    const srv = DataStore.autoServices.find(as => as.id === s);
                    return `<span class="badge-tag badge-neutral" style="font-size:10px">${srv?.name || s}</span>`;
                }).join('')}
                ${job.services.length > 2 ? `<span class="badge-tag badge-neutral" style="font-size:10px">+${job.services.length - 2}</span>` : ''}
            </div>
            <div class="flex-between">
                <span style="font-size:13px;font-weight:700;color:var(--secondary)">${Utils.formatCurrency(job.total)}</span>
                ${job.priority === 'urgent' ? '<span class="badge-tag badge-danger" style="font-size:10px">URGENT</span>' : ''}
            </div>
        </div>`;
    },

    viewJobCard(id) {
        const job = DataStore.jobCards.find(j => j.id === id);
        if (!job) return;
        const vehicle = DataStore.vehicles.find(v => v.id === job.vehicle);
        const customer = DataStore.customers.find(c => c.id === job.customer);

        const serviceDetails = job.services.map(s => {
            const srv = DataStore.autoServices.find(as => as.id === s);
            return srv ? `<tr><td>${srv.name}</td><td>${srv.category}</td><td>${Utils.formatCurrency(srv.price)}</td></tr>` : '';
        }).join('');

        App.openModal('Job Card — ' + job.id, `
            <div class="grid-2" style="gap:16px;margin-bottom:20px">
                <div style="padding:16px;background:var(--bg);border-radius:var(--radius)">
                    <h4 style="margin-bottom:8px"><i class="fas fa-car" style="color:var(--secondary)"></i> Vehicle</h4>
                    <div style="font-size:13px;line-height:1.8">
                        <div><strong>${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''}</strong></div>
                        <div>Plate: <strong>${vehicle?.plate || 'N/A'}</strong></div>
                        <div>Mileage: ${vehicle ? Utils.formatNumber(vehicle.mileage) + ' km' : 'N/A'}</div>
                        <div>Color: ${vehicle?.color || 'N/A'}</div>
                    </div>
                </div>
                <div style="padding:16px;background:var(--bg);border-radius:var(--radius)">
                    <h4 style="margin-bottom:8px"><i class="fas fa-user" style="color:var(--secondary)"></i> Customer</h4>
                    <div style="font-size:13px;line-height:1.8">
                        <div><strong>${customer?.name || 'Walk-in'}</strong></div>
                        <div>${customer?.phone || ''}</div>
                        <div>${customer?.email || ''}</div>
                    </div>
                </div>
            </div>

            <div class="grid-3" style="gap:8px;margin-bottom:16px;font-size:13px">
                <div><strong>Date In:</strong> ${Utils.formatDate(job.dateIn)}</div>
                <div><strong>Date Out:</strong> ${job.dateOut ? Utils.formatDate(job.dateOut) : 'Pending'}</div>
                <div><strong>Priority:</strong> <span class="badge-tag ${job.priority === 'urgent' ? 'badge-danger' : job.priority === 'high' ? 'badge-warning' : 'badge-neutral'}">${job.priority}</span></div>
            </div>

            <h4 style="margin-bottom:8px">Services</h4>
            <table class="data-table"><thead><tr><th>Service</th><th>Category</th><th>Price</th></tr></thead><tbody>${serviceDetails}</tbody></table>

            <div class="flex-between" style="margin-top:16px;padding:12px 16px;background:var(--bg);border-radius:var(--radius);font-size:16px">
                <strong>Total</strong>
                <strong style="color:var(--secondary)">${Utils.formatCurrency(job.total)}</strong>
            </div>

            ${job.notes ? `<div style="margin-top:16px;padding:12px;background:var(--bg);border-radius:var(--radius);font-size:13px"><strong>Technician Notes:</strong> ${job.notes}</div>` : ''}

            <div style="margin-top:16px;display:flex;gap:8px">
                ${job.status !== 'completed' ? `
                    <button class="btn btn-success" onclick="Automotive.updateJobStatus('${job.id}','completed');App.closeModal()"><i class="fas fa-check"></i> Mark Ready</button>
                    <button class="btn btn-warning" onclick="Automotive.updateJobStatus('${job.id}','waiting-parts');App.closeModal()"><i class="fas fa-box-open"></i> Waiting Parts</button>
                    <button class="btn btn-primary" onclick="Automotive.updateJobStatus('${job.id}','in-progress');App.closeModal()"><i class="fas fa-wrench"></i> Start Repair</button>
                ` : ''}
            </div>
        `, '', true);
    },

    updateJobStatus(id, status) {
        const job = DataStore.jobCards.find(j => j.id === id);
        if (job) {
            job.status = status;
            if (status === 'completed') job.dateOut = new Date().toISOString().split('T')[0];
            App.showToast(`Job ${id} updated to ${status}`, 'success');
            this.renderWorkshop(document.getElementById('contentArea'));
        }
    },

    openNewJobCard() {
        App.openModal('New Job Card', `
        <form>
            <div class="form-row">
                <div class="form-group"><label>Customer</label>
                    <select class="form-control" id="newJCCustomer">
                        <option value="">Walk-in</option>
                        ${DataStore.customers.filter(c => c.companies?.includes('autocasa')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Vehicle</label>
                    <select class="form-control" id="newJCVehicle">
                        ${DataStore.vehicles.map(v => `<option value="${v.id}">${v.year} ${v.make} ${v.model} (${v.plate})</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group"><label>Services</label>
                <div id="newJCServices" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:200px;overflow-y:auto">
                    ${DataStore.autoServices.map(s => `<label style="display:flex;align-items:center;gap:6px;font-size:13px;padding:4px"><input type="checkbox" value="${s.id}" data-price="${s.price}" onchange="Automotive.updateJCTotal()"> ${s.name} (${Utils.formatCurrency(s.price)})</label>`).join('')}
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Priority</label>
                    <select class="form-control" id="newJCPriority">
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                <div class="form-group"><label>Estimated Total</label>
                    <div id="newJCTotal" style="font-size:24px;font-weight:700;color:var(--secondary);padding:8px 0">₱0.00</div>
                </div>
            </div>
            <div class="form-group"><label>Notes</label><textarea class="form-control" id="newJCNotes" rows="2"></textarea></div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Automotive.saveJobCard()"><i class="fas fa-save"></i> Create</button>
        `);
    },

    updateJCTotal() {
        const checkboxes = document.querySelectorAll('#newJCServices input:checked');
        let total = 0;
        checkboxes.forEach(cb => { total += parseFloat(cb.dataset.price || 0); });
        const el = document.getElementById('newJCTotal');
        if (el) el.textContent = Utils.formatCurrency(total);
    },

    saveJobCard() {
        const checkboxes = document.querySelectorAll('#newJCServices input:checked');
        const services = Array.from(checkboxes).map(cb => cb.value);
        const total = Array.from(checkboxes).reduce((s, cb) => s + parseFloat(cb.dataset.price || 0), 0);

        if (services.length === 0) { App.showToast('Select at least one service', 'error'); return; }

        DataStore.jobCards.push({
            id: Utils.generateId('JC'),
            customer: document.getElementById('newJCCustomer').value,
            vehicle: document.getElementById('newJCVehicle').value,
            services,
            total,
            priority: document.getElementById('newJCPriority').value,
            notes: document.getElementById('newJCNotes')?.value || '',
            dateIn: new Date().toISOString().split('T')[0],
            dateOut: null,
            status: 'in-queue'
        });

        App.closeModal();
        App.showToast('Job Card created', 'success');
        this.renderWorkshop(document.getElementById('contentArea'));
    },

    // ============================================================
    //  VEHICLES
    // ============================================================
    renderVehicles(container) {
        const vehicles = DataStore.vehicles;

        container.innerHTML = `
        <div class="section-header mb-3">
            <h2>Vehicle Database</h2>
            <div class="section-actions">
                <input type="text" class="form-control" placeholder="Search plates..." style="width:200px" id="vehicleSearch" oninput="Automotive.searchVehicles()">
                <button class="btn btn-primary" onclick="Automotive.openAddVehicle()"><i class="fas fa-plus"></i> Add Vehicle</button>
            </div>
        </div>

        <div class="card">
            <div class="card-body no-padding" id="vehiclesTableContainer">
                ${this.buildVehiclesTable(vehicles)}
            </div>
        </div>`;
    },

    buildVehiclesTable(vehicles) {
        return Utils.buildTable(
            [
                { label: 'Vehicle', render: r => `<div><strong>${r.year} ${r.make} ${r.model}</strong><div style="font-size:11px;color:var(--text-muted)">${r.color}</div></div>` },
                { label: 'Plate', render: r => `<span style="font-family:monospace;font-weight:700;background:var(--bg);padding:3px 8px;border-radius:4px">${r.plate}</span>` },
                { label: 'Owner', render: r => { const c = DataStore.customers.find(cu => cu.id === r.owner); return c?.name || 'N/A'; } },
                { label: 'Mileage', render: r => `${Utils.formatNumber(r.mileage)} km` },
                { label: 'Last Service', render: r => Utils.formatDate(r.lastService) },
                { label: 'Jobs', render: r => { const count = DataStore.jobCards.filter(j => j.vehicle === r.id).length; return `<span class="badge-tag badge-info">${count}</span>`; } }
            ],
            vehicles,
            {
                actions: (r) => `
                    <button class="btn btn-sm btn-secondary" onclick="Automotive.viewVehicleHistory('${r.id}')"><i class="fas fa-history"></i></button>
                `
            }
        );
    },

    searchVehicles() {
        const q = (document.getElementById('vehicleSearch')?.value || '').toLowerCase();
        const filtered = DataStore.vehicles.filter(v =>
            v.plate.toLowerCase().includes(q) ||
            v.make.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q)
        );
        document.getElementById('vehiclesTableContainer').innerHTML = this.buildVehiclesTable(filtered);
    },

    viewVehicleHistory(id) {
        const v = DataStore.vehicles.find(vh => vh.id === id);
        if (!v) return;
        const jobs = DataStore.jobCards.filter(j => j.vehicle === id);
        const customer = DataStore.customers.find(c => c.id === v.owner);

        const jobRows = jobs.map(j => `
            <div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px">
                <div class="flex-between">
                    <div><strong>${j.id}</strong> — <span class="badge-tag ${Utils.getStatusClass(j.status)}">${j.status}</span></div>
                    <span style="font-weight:700;color:var(--secondary)">${Utils.formatCurrency(j.total)}</span>
                </div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:4px">
                    ${j.services.map(s => { const srv = DataStore.autoServices.find(a => a.id === s); return srv?.name || s; }).join(', ')}
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px">In: ${Utils.formatDate(j.dateIn)} ${j.dateOut ? '| Out: ' + Utils.formatDate(j.dateOut) : ''}</div>
            </div>
        `).join('') || '<div style="text-align:center;padding:24px;color:var(--text-muted)">No service records</div>';

        App.openModal(`Vehicle History — ${v.plate}`, `
            <div style="padding:16px;background:var(--bg);border-radius:var(--radius);margin-bottom:20px">
                <h3 style="margin-bottom:4px">${v.year} ${v.make} ${v.model}</h3>
                <div style="font-size:13px;color:var(--text-secondary)">
                    Plate: <strong>${v.plate}</strong> &nbsp;|&nbsp;
                    Color: ${v.color} &nbsp;|&nbsp;
                    Mileage: ${Utils.formatNumber(v.mileage)} km &nbsp;|&nbsp;
                    Owner: ${customer?.name || 'N/A'}
                </div>
            </div>
            <h4 style="margin-bottom:8px">Service History (${jobs.length} records)</h4>
            ${jobRows}
        `, '', true);
    },

    openAddVehicle() {
        App.openModal('Add Vehicle', `
        <form>
            <div class="form-row">
                <div class="form-group"><label>Make</label><input type="text" class="form-control" id="newVehMake" placeholder="e.g., Toyota"></div>
                <div class="form-group"><label>Model</label><input type="text" class="form-control" id="newVehModel" placeholder="e.g., Vios"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Year</label><input type="number" class="form-control" id="newVehYear" value="2024"></div>
                <div class="form-group"><label>Color</label><input type="text" class="form-control" id="newVehColor"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Plate Number</label><input type="text" class="form-control" id="newVehPlate" placeholder="e.g., ABC 1234"></div>
                <div class="form-group"><label>Mileage (km)</label><input type="number" class="form-control" id="newVehMileage" min="0"></div>
            </div>
            <div class="form-group"><label>Owner</label>
                <select class="form-control" id="newVehOwner">
                    ${DataStore.customers.filter(c => c.companies?.includes('autocasa')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Automotive.saveVehicle()"><i class="fas fa-save"></i> Save</button>
        `);
    },

    saveVehicle() {
        const make = document.getElementById('newVehMake')?.value;
        const model = document.getElementById('newVehModel')?.value;
        if (!make || !model) { App.showToast('Make and model required', 'error'); return; }

        DataStore.vehicles.push({
            id: Utils.generateId('VEH'),
            make, model,
            year: parseInt(document.getElementById('newVehYear')?.value || 2024),
            color: document.getElementById('newVehColor')?.value || '',
            plate: document.getElementById('newVehPlate')?.value || '',
            mileage: parseInt(document.getElementById('newVehMileage')?.value || 0),
            owner: document.getElementById('newVehOwner').value,
            lastService: new Date().toISOString().split('T')[0]
        });

        App.closeModal();
        App.showToast('Vehicle added', 'success');
        this.renderVehicles(document.getElementById('contentArea'));
    },

    // ============================================================
    //  PARTS INVENTORY
    // ============================================================
    renderParts(container) {
        const parts = DataStore.autoParts;
        const lowStock = parts.filter(p => p.quantity <= p.reorderLevel);
        const totalValue = parts.reduce((s, p) => s + (p.quantity * p.unitCost), 0);

        container.innerHTML = `
        <div class="grid-4 mb-3">
            <div class="stat-card"><div class="stat-header"><div class="stat-icon teal"><i class="fas fa-boxes-stacked"></i></div></div><div class="stat-value">${parts.length}</div><div class="stat-label">Total SKUs</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon green"><i class="fas fa-cubes"></i></div></div><div class="stat-value">${parts.reduce((s, p) => s + p.quantity, 0)}</div><div class="stat-label">Total Units</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon orange"><i class="fas fa-triangle-exclamation"></i></div></div><div class="stat-value">${lowStock.length}</div><div class="stat-label">Low Stock Items</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon blue"><i class="fas fa-peso-sign"></i></div></div><div class="stat-value">${Utils.formatCurrency(totalValue, true)}</div><div class="stat-label">Inventory Value</div></div>
        </div>

        ${lowStock.length > 0 ? `
        <div class="card mb-3" style="border-left:4px solid var(--danger)">
            <div class="card-header"><h3 style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> Low Stock Alerts</h3></div>
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'Part', render: r => `<strong>${r.name}</strong>` },
                        { label: 'SKU', key: 'sku' },
                        { label: 'In Stock', render: r => `<span style="color:var(--danger);font-weight:700">${r.quantity}</span>` },
                        { label: 'Reorder Level', key: 'reorderLevel' },
                        { label: 'Supplier', key: 'supplier' }
                    ],
                    lowStock,
                    { actions: () => `<button class="btn btn-sm btn-primary"><i class="fas fa-cart-plus"></i> Reorder</button>` }
                )}
            </div>
        </div>` : ''}

        <div class="section-header mb-2">
            <h2>Parts Inventory</h2>
            <div class="section-actions">
                <select class="form-control" style="width:140px" id="partCategoryFilter" onchange="Automotive.filterParts()">
                    <option value="all">All Categories</option>
                    ${[...new Set(parts.map(p => p.category))].map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <button class="btn btn-primary" onclick="Automotive.openAddPart()"><i class="fas fa-plus"></i> Add Part</button>
            </div>
        </div>

        <div class="card">
            <div class="card-body no-padding" id="partsTableContainer">
                ${this.buildPartsTable(parts)}
            </div>
        </div>`;
    },

    buildPartsTable(parts) {
        return Utils.buildTable(
            [
                { label: 'Part Name', render: r => `<div><strong>${r.name}</strong><div style="font-size:11px;color:var(--text-muted)">${r.sku}</div></div>` },
                { label: 'Category', render: r => `<span class="badge-tag badge-neutral">${r.category}</span>` },
                { label: 'In Stock', render: r => {
                    const low = r.quantity <= r.reorderLevel;
                    return `<span style="font-weight:700;color:${low ? 'var(--danger)' : 'inherit'}">${r.quantity}</span>${low ? ' <i class="fas fa-exclamation-triangle" style="color:var(--danger);font-size:11px"></i>' : ''}`;
                }},
                { label: 'Unit Cost', render: r => Utils.formatCurrency(r.unitCost) },
                { label: 'Total Value', render: r => Utils.formatCurrency(r.quantity * r.unitCost) },
                { label: 'Supplier', key: 'supplier' }
            ],
            parts
        );
    },

    filterParts() {
        const cat = document.getElementById('partCategoryFilter')?.value || 'all';
        let parts = DataStore.autoParts;
        if (cat !== 'all') parts = parts.filter(p => p.category === cat);
        document.getElementById('partsTableContainer').innerHTML = this.buildPartsTable(parts);
    },

    openAddPart() {
        App.openModal('Add Part', `
        <form>
            <div class="form-group"><label>Part Name</label><input type="text" class="form-control" id="newPartName"></div>
            <div class="form-row">
                <div class="form-group"><label>SKU</label><input type="text" class="form-control" id="newPartSKU"></div>
                <div class="form-group"><label>Category</label><input type="text" class="form-control" id="newPartCat" placeholder="e.g., Filters"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Quantity</label><input type="number" class="form-control" id="newPartQty" min="0"></div>
                <div class="form-group"><label>Reorder Level</label><input type="number" class="form-control" id="newPartReorder" min="0"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Unit Cost (₱)</label><input type="number" class="form-control" id="newPartCost" min="0" step="0.01"></div>
                <div class="form-group"><label>Supplier</label><input type="text" class="form-control" id="newPartSupplier"></div>
            </div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Automotive.savePart()"><i class="fas fa-save"></i> Save</button>
        `);
    },

    savePart() {
        const name = document.getElementById('newPartName')?.value;
        if (!name) { App.showToast('Part name required', 'error'); return; }
        DataStore.autoParts.push({
            id: Utils.generateId('PART'),
            name,
            sku: document.getElementById('newPartSKU')?.value || '',
            category: document.getElementById('newPartCat')?.value || '',
            quantity: parseInt(document.getElementById('newPartQty')?.value || 0),
            reorderLevel: parseInt(document.getElementById('newPartReorder')?.value || 5),
            unitCost: parseFloat(document.getElementById('newPartCost')?.value || 0),
            supplier: document.getElementById('newPartSupplier')?.value || ''
        });
        App.closeModal();
        App.showToast('Part added to inventory', 'success');
        this.renderParts(document.getElementById('contentArea'));
    },

    // ============================================================
    //  INSPECTIONS
    // ============================================================
    renderInspections(container) {
        container.innerHTML = `
        <div class="section-header mb-3">
            <h2>Digital Vehicle Inspections</h2>
            <button class="btn btn-primary" onclick="Automotive.openNewInspection()"><i class="fas fa-plus"></i> New Inspection</button>
        </div>

        <div class="grid-2 mb-3">
            <div class="card">
                <div class="card-header"><h3>Inspection Checklist Template</h3></div>
                <div class="card-body">
                    ${this.getInspectionCategories().map(cat => `
                    <div style="margin-bottom:16px">
                        <h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">${cat.name}</h4>
                        ${cat.items.map(item => `
                        <div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between;align-items:center">
                            <span>${item}</span>
                            <div style="display:flex;gap:4px">
                                <span class="badge-tag badge-success" style="font-size:10px;cursor:pointer">Good</span>
                                <span class="badge-tag badge-warning" style="font-size:10px;cursor:pointer">Fair</span>
                                <span class="badge-tag badge-danger" style="font-size:10px;cursor:pointer">Poor</span>
                            </div>
                        </div>`).join('')}
                    </div>`).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header"><h3>Recent Inspections</h3></div>
                <div class="card-body">
                    ${DataStore.vehicles.slice(0, 4).map(v => `
                    <div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:8px">
                        <div class="flex-between">
                            <strong>${v.year} ${v.make} ${v.model}</strong>
                            <span class="badge-tag badge-success">Passed</span>
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);margin-top:4px">
                            Plate: ${v.plate} &nbsp;|&nbsp; Inspected: ${Utils.formatDate(v.lastService)}
                        </div>
                        <div class="progress-bar" style="margin-top:8px">
                            <div class="progress-fill green" style="width:${75 + Math.floor(Math.random() * 25)}%"></div>
                        </div>
                    </div>`).join('')}
                    ${DataStore.vehicles.length === 0 ? '<div style="text-align:center;padding:24px;color:var(--text-muted)">No inspections yet</div>' : ''}
                </div>
            </div>
        </div>`;
    },

    getInspectionCategories() {
        return [
            { name: 'Exterior', items: ['Body Condition', 'Paint/Finish', 'Lights (Front)', 'Lights (Rear)', 'Windshield', 'Wipers', 'Tires — Tread Depth', 'Tire Pressure'] },
            { name: 'Under the Hood', items: ['Engine Oil Level', 'Coolant Level', 'Brake Fluid', 'Power Steering Fluid', 'Battery Condition', 'Belts & Hoses', 'Air Filter'] },
            { name: 'Interior', items: ['Dashboard Lights', 'Horn', 'A/C System', 'Seat Belts', 'Mirrors', 'Gauges & Instruments'] },
            { name: 'Underneath', items: ['Brake Pads (Front)', 'Brake Pads (Rear)', 'Exhaust System', 'Suspension', 'CV Joints', 'Oil/Fluid Leaks'] }
        ];
    },

    openNewInspection() {
        App.openModal('New Vehicle Inspection', `
        <form>
            <div class="form-group"><label>Vehicle</label>
                <select class="form-control" id="inspVehicle">
                    ${DataStore.vehicles.map(v => `<option value="${v.id}">${v.year} ${v.make} ${v.model} — ${v.plate}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Inspector</label><input type="text" class="form-control" id="inspInspector" placeholder="Technician name"></div>
            <div class="form-group"><label>Mileage at Inspection</label><input type="number" class="form-control" id="inspMileage"></div>
            <div class="form-group"><label>General Notes</label><textarea class="form-control" id="inspNotes" rows="3"></textarea></div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="App.closeModal();App.showToast('Inspection saved','success')"><i class="fas fa-clipboard-check"></i> Save Inspection</button>
        `, false);
    }
};

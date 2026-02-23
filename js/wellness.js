/* ========================================
   UBMS - Wellness Hub Module
   Bookings, Therapists, POS, Membership
   ======================================== */

const Wellness = {
    // ============================================================
    //  BOOKINGS
    // ============================================================
    renderBookings(container) {
        const bookings = DataStore.bookings;
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(b => b.date === today);
        const upcoming = bookings.filter(b => b.date >= today);
        const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.total, 0);

        container.innerHTML = `
        <div class="grid-4 mb-3">
            <div class="stat-card"><div class="stat-header"><div class="stat-icon teal"><i class="fas fa-calendar-check"></i></div></div><div class="stat-value">${todayBookings.length}</div><div class="stat-label">Today's Bookings</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon blue"><i class="fas fa-clock"></i></div></div><div class="stat-value">${upcoming.length}</div><div class="stat-label">Upcoming</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon green"><i class="fas fa-check"></i></div></div><div class="stat-value">${bookings.filter(b => b.status === 'completed').length}</div><div class="stat-label">Completed</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon orange"><i class="fas fa-peso-sign"></i></div></div><div class="stat-value">${Utils.formatCurrency(totalRevenue, true)}</div><div class="stat-label">Revenue</div></div>
        </div>

        <div class="section-header mb-2">
            <h2>Booking Schedule</h2>
            <div class="section-actions">
                <select class="form-control" style="width:140px" id="bookStatusFilter" onchange="Wellness.filterBookings()">
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                </select>
                <button class="btn btn-primary" onclick="Wellness.openNewBooking()"><i class="fas fa-plus"></i> New Booking</button>
            </div>
        </div>

        <div class="card">
            <div class="card-body no-padding" id="bookingsTableContainer">
                ${this.buildBookingsTable(bookings)}
            </div>
        </div>`;
    },

    buildBookingsTable(bookings) {
        return Utils.buildTable(
            [
                { label: 'Date / Time', render: r => `<div><strong>${Utils.formatDate(r.date)}</strong><div style="font-size:11px;color:var(--text-muted)">${r.time}</div></div>` },
                { label: 'Client', render: r => { const c = DataStore.customers.find(cu => cu.id === r.client); return c ? c.name : r.client; } },
                { label: 'Service', render: r => { const s = DataStore.spaServices.find(sv => sv.id === r.service); return s ? `<div><strong>${s.name}</strong><div style="font-size:11px;color:var(--text-muted)">${s.duration} min</div></div>` : r.service; } },
                { label: 'Therapist', render: r => { const t = DataStore.therapists.find(th => th.id === r.therapist); return t ? t.name : r.therapist; } },
                { label: 'Branch', render: r => `<span class="badge-tag badge-neutral">${r.branch}</span>` },
                { label: 'Amount', render: r => `<strong>${Utils.formatCurrency(r.total)}</strong>` },
                { label: 'Status', render: r => `<span class="badge-tag ${Utils.getStatusClass(r.status)}">${r.status}</span>` }
            ],
            bookings,
            {
                actions: (r) => `
                    <button class="btn btn-sm btn-secondary" onclick="Wellness.viewBooking('${r.id}')"><i class="fas fa-eye"></i></button>
                    ${r.status === 'confirmed' ? `<button class="btn btn-sm btn-success" style="margin-left:4px" onclick="Wellness.completeBooking('${r.id}')"><i class="fas fa-check"></i></button>` : ''}
                `
            }
        );
    },

    filterBookings() {
        const status = document.getElementById('bookStatusFilter')?.value || 'all';
        let bookings = DataStore.bookings;
        if (status !== 'all') bookings = bookings.filter(b => b.status === status);
        document.getElementById('bookingsTableContainer').innerHTML = this.buildBookingsTable(bookings);
    },

    viewBooking(id) {
        const b = DataStore.bookings.find(bk => bk.id === id);
        if (!b) return;
        const client = DataStore.customers.find(c => c.id === b.client);
        const service = DataStore.spaServices.find(s => s.id === b.service);
        const therapist = DataStore.therapists.find(t => t.id === b.therapist);

        App.openModal('Booking Details', `
            <div class="grid-2" style="gap:16px;font-size:14px">
                <div><i class="fas fa-hashtag" style="width:20px;color:var(--text-muted)"></i> <strong>${b.id}</strong></div>
                <div><i class="fas fa-calendar" style="width:20px;color:var(--text-muted)"></i> ${Utils.formatDate(b.date)} at ${b.time}</div>
                <div><i class="fas fa-user" style="width:20px;color:var(--text-muted)"></i> ${client?.name || b.client}</div>
                <div><i class="fas fa-spa" style="width:20px;color:var(--text-muted)"></i> ${service?.name || b.service}</div>
                <div><i class="fas fa-user-md" style="width:20px;color:var(--text-muted)"></i> ${therapist?.name || b.therapist}</div>
                <div><i class="fas fa-store" style="width:20px;color:var(--text-muted)"></i> ${b.branch}</div>
                <div><i class="fas fa-peso-sign" style="width:20px;color:var(--text-muted)"></i> <strong style="font-size:16px">${Utils.formatCurrency(b.total)}</strong></div>
                <div>Status: <span class="badge-tag ${Utils.getStatusClass(b.status)}">${b.status}</span></div>
            </div>
            ${b.notes ? `<div style="margin-top:16px;padding:12px;background:var(--bg);border-radius:var(--radius);font-size:13px"><strong>Notes:</strong> ${b.notes}</div>` : ''}
        `);
    },

    completeBooking(id) {
        const b = DataStore.bookings.find(bk => bk.id === id);
        if (b) { b.status = 'completed'; App.showToast('Booking marked as completed', 'success'); this.renderBookings(document.getElementById('contentArea')); }
    },

    openNewBooking() {
        const branches = [...new Set(DataStore.therapists.map(t => t.branch))];

        const html = `
        <form>
            <div class="form-row">
                <div class="form-group"><label>Client</label>
                    <select class="form-control" id="newBookClient">
                        ${DataStore.customers.filter(c => c.companies?.includes('nuatthai')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Branch</label>
                    <select class="form-control" id="newBookBranch" onchange="Wellness.updateTherapistDropdown()">
                        ${branches.map(b => `<option value="${b}">${b}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Service</label>
                    <select class="form-control" id="newBookService" onchange="Wellness.updateBookingPrice()">
                        ${DataStore.spaServices.map(s => `<option value="${s.id}" data-price="${s.price}" data-duration="${s.duration}">${s.name} (${s.duration}min — ${Utils.formatCurrency(s.price)})</option>`).join('')}
                    </select>
                </div>
                <div class="form-group"><label>Therapist</label>
                    <select class="form-control" id="newBookTherapist">
                        ${DataStore.therapists.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Date</label><input type="date" class="form-control" id="newBookDate" value="${new Date().toISOString().split('T')[0]}"></div>
                <div class="form-group"><label>Time</label><input type="time" class="form-control" id="newBookTime" value="10:00"></div>
            </div>
            <div class="form-group"><label>Notes</label><textarea class="form-control" id="newBookNotes" rows="2"></textarea></div>
            <div style="padding:12px;background:var(--bg);border-radius:var(--radius);text-align:center">
                <span style="color:var(--text-muted)">Total:</span>
                <span id="newBookTotal" style="font-size:20px;font-weight:700;margin-left:8px;color:var(--secondary)">${Utils.formatCurrency(DataStore.spaServices[0]?.price || 0)}</span>
            </div>
        </form>`;

        App.openModal('New Booking', html, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Wellness.saveBooking()"><i class="fas fa-calendar-plus"></i> Book</button>
        `);
    },

    updateBookingPrice() {
        const sel = document.getElementById('newBookService');
        const opt = sel.options[sel.selectedIndex];
        const price = parseFloat(opt.dataset.price || 0);
        const el = document.getElementById('newBookTotal');
        if (el) el.textContent = Utils.formatCurrency(price);
    },

    updateTherapistDropdown() {
        const branch = document.getElementById('newBookBranch')?.value;
        const tSelect = document.getElementById('newBookTherapist');
        if (!tSelect) return;
        const therapists = branch ? DataStore.therapists.filter(t => t.branch === branch) : DataStore.therapists;
        tSelect.innerHTML = therapists.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    },

    saveBooking() {
        const sel = document.getElementById('newBookService');
        const opt = sel.options[sel.selectedIndex];
        const price = parseFloat(opt.dataset.price || 0);

        DataStore.bookings.push({
            id: Utils.generateId('BK'),
            client: document.getElementById('newBookClient').value,
            service: sel.value,
            therapist: document.getElementById('newBookTherapist').value,
            branch: document.getElementById('newBookBranch').value,
            date: document.getElementById('newBookDate').value,
            time: document.getElementById('newBookTime').value,
            total: price,
            status: 'confirmed',
            notes: document.getElementById('newBookNotes')?.value || ''
        });

        App.closeModal();
        App.showToast('Booking created', 'success');
        this.renderBookings(document.getElementById('contentArea'));
    },

    // ============================================================
    //  THERAPISTS
    // ============================================================
    renderTherapists(container) {
        const therapists = DataStore.therapists;
        const available = therapists.filter(t => t.status === 'available');

        container.innerHTML = `
        <div class="section-header mb-3">
            <h2>Therapists</h2>
            <button class="btn btn-primary" onclick="Wellness.openAddTherapist()"><i class="fas fa-plus"></i> Add Therapist</button>
        </div>

        <div class="grid-3 mb-3">
            <div class="stat-card"><div class="stat-header"><div class="stat-icon teal"><i class="fas fa-users"></i></div></div><div class="stat-value">${therapists.length}</div><div class="stat-label">Total Therapists</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div><div class="stat-value">${available.length}</div><div class="stat-label">Available Now</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon orange"><i class="fas fa-star"></i></div></div><div class="stat-value">${(therapists.reduce((s, t) => s + t.rating, 0) / (therapists.length || 1)).toFixed(1)}</div><div class="stat-label">Avg Rating</div></div>
        </div>

        <div class="grid-3">
            ${therapists.map(t => `
            <div class="card">
                <div class="card-body" style="text-align:center">
                    <div class="avatar avatar-lg" style="margin:0 auto 12px;background:${t.status === 'available' ? 'var(--secondary)' : t.status === 'on-break' ? '#f59e0b' : '#94a3b8'};color:#fff;font-size:20px">
                        ${t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 style="font-size:16px;margin-bottom:4px">${t.name}</h3>
                    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">${t.branch}</div>
                    <span class="badge-tag ${t.status === 'available' ? 'badge-success' : t.status === 'on-break' ? 'badge-warning' : 'badge-neutral'}" style="margin-bottom:12px">${t.status}</span>
                    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;justify-content:center">
                        ${t.specialties.map(s => `<span class="badge-tag badge-teal" style="font-size:10px">${s}</span>`).join('')}
                    </div>
                    <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
                        <div style="padding:8px;background:var(--bg);border-radius:6px"><div style="color:var(--text-muted)">Rating</div><div style="font-weight:700;color:#f59e0b">★ ${t.rating}</div></div>
                        <div style="padding:8px;background:var(--bg);border-radius:6px"><div style="color:var(--text-muted)">Commission</div><div style="font-weight:700">${t.commissionRate}%</div></div>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>`;
    },

    openAddTherapist() {
        const branches = [...new Set(DataStore.therapists.map(t => t.branch))];
        App.openModal('Add Therapist', `
        <form>
            <div class="form-group"><label>Full Name</label><input type="text" class="form-control" id="newThName"></div>
            <div class="form-row">
                <div class="form-group"><label>Branch</label>
                    <select class="form-control" id="newThBranch">${branches.map(b => `<option value="${b}">${b}</option>`).join('')}</select>
                </div>
                <div class="form-group"><label>Commission Rate (%)</label><input type="number" class="form-control" id="newThComm" value="40" min="0" max="100"></div>
            </div>
            <div class="form-group"><label>Specialties (comma separated)</label><input type="text" class="form-control" id="newThSpec" placeholder="e.g., Thai, Shiatsu, Swedish"></div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Wellness.saveTherapist()"><i class="fas fa-save"></i> Save</button>
        `);
    },

    saveTherapist() {
        const name = document.getElementById('newThName')?.value;
        if (!name) { App.showToast('Name is required', 'error'); return; }
        DataStore.therapists.push({
            id: Utils.generateId('TH'),
            name,
            branch: document.getElementById('newThBranch').value,
            commissionRate: parseInt(document.getElementById('newThComm')?.value || 40),
            specialties: (document.getElementById('newThSpec')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
            status: 'available',
            rating: 0
        });
        App.closeModal();
        App.showToast('Therapist added', 'success');
        this.renderTherapists(document.getElementById('contentArea'));
    },

    // ============================================================
    //  POS (Point of Sale)
    // ============================================================
    renderPOS(container) {
        container.innerHTML = `
        <div class="grid-2" style="gap:24px;grid-template-columns:1fr 360px">
            <!-- Service Selection -->
            <div>
                <h3 style="margin-bottom:16px"><i class="fas fa-spa" style="color:var(--secondary);margin-right:8px"></i>Select Services</h3>
                <div class="grid-2" style="gap:12px" id="posServicesGrid">
                    ${DataStore.spaServices.map(s => `
                    <div class="card" style="cursor:pointer;transition:all 0.2s" onclick="Wellness.addToCart('${s.id}')" id="posItem-${s.id}">
                        <div class="card-body" style="padding:16px">
                            <div class="flex-between mb-1">
                                <strong style="font-size:14px">${s.name}</strong>
                                <span class="badge-tag badge-${s.category === 'massage' ? 'teal' : s.category === 'body-treatment' ? 'info' : 'neutral'}">${s.category}</span>
                            </div>
                            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">${s.description}</div>
                            <div class="flex-between">
                                <span style="font-size:12px;color:var(--text-muted)">${s.duration} min</span>
                                <span style="font-size:18px;font-weight:700;color:var(--secondary)">${Utils.formatCurrency(s.price)}</span>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <!-- Cart -->
            <div>
                <div class="card" style="position:sticky;top:80px">
                    <div class="card-header" style="background:var(--primary);color:#fff"><h3><i class="fas fa-receipt" style="margin-right:8px"></i>Current Transaction</h3></div>
                    <div class="card-body">
                        <div class="form-group">
                            <label>Client</label>
                            <select class="form-control" id="posClient">
                                <option value="">Walk-in</option>
                                ${DataStore.customers.filter(c => c.companies?.includes('nuatthai')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Therapist</label>
                            <select class="form-control" id="posTherapist">
                                ${DataStore.therapists.filter(t => t.status === 'available').map(t => `<option value="${t.id}">${t.name} (${t.branch})</option>`).join('')}
                            </select>
                        </div>
                        <hr style="margin:16px 0;border-color:var(--border)">
                        <div id="posCartItems" style="min-height:80px"></div>
                        <hr style="margin:16px 0;border-color:var(--border)">
                        <div class="flex-between" style="font-size:18px;font-weight:700;margin-bottom:16px">
                            <span>Total</span>
                            <span id="posTotal" style="color:var(--secondary)">₱0.00</span>
                        </div>
                        <div class="form-group">
                            <label>Payment Method</label>
                            <select class="form-control" id="posPayment">
                                <option value="cash">Cash</option>
                                <option value="gcash">GCash</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="maya">Maya</option>
                            </select>
                        </div>
                        <button class="btn btn-primary btn-lg" style="width:100%" onclick="Wellness.processPayment()" id="posProceedBtn" disabled>
                            <i class="fas fa-cash-register" style="margin-right:8px"></i>Process Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        this.posCart = [];
    },

    posCart: [],

    addToCart(serviceId) {
        const service = DataStore.spaServices.find(s => s.id === serviceId);
        if (!service) return;

        const existing = this.posCart.find(i => i.id === serviceId);
        if (existing) {
            existing.qty++;
        } else {
            this.posCart.push({ id: serviceId, name: service.name, price: service.price, qty: 1 });
        }
        this.updateCart();
    },

    removeFromCart(serviceId) {
        this.posCart = this.posCart.filter(i => i.id !== serviceId);
        this.updateCart();
    },

    updateCart() {
        const cartEl = document.getElementById('posCartItems');
        const totalEl = document.getElementById('posTotal');
        const btn = document.getElementById('posProceedBtn');

        if (this.posCart.length === 0) {
            cartEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px"><i class="fas fa-shopping-basket" style="font-size:24px;margin-bottom:8px;display:block"></i>No items</div>';
            totalEl.textContent = '₱0.00';
            btn.disabled = true;
            return;
        }

        const total = this.posCart.reduce((s, i) => s + (i.price * i.qty), 0);
        cartEl.innerHTML = this.posCart.map(i => `
            <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)">
                <div>
                    <div style="font-weight:500">${i.name}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${Utils.formatCurrency(i.price)} × ${i.qty}</div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    <strong>${Utils.formatCurrency(i.price * i.qty)}</strong>
                    <button class="btn btn-sm btn-danger" onclick="Wellness.removeFromCart('${i.id}')"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `).join('');

        totalEl.textContent = Utils.formatCurrency(total);
        btn.disabled = false;
    },

    processPayment() {
        if (this.posCart.length === 0) return;
        const total = this.posCart.reduce((s, i) => s + (i.price * i.qty), 0);
        const method = document.getElementById('posPayment')?.value || 'cash';

        App.showToast(`Payment of ${Utils.formatCurrency(total)} via ${method.toUpperCase()} processed successfully!`, 'success');
        this.posCart = [];
        this.updateCart();
    },

    // ============================================================
    //  MEMBERSHIP
    // ============================================================
    renderMembership(container) {
        const memberships = DataStore.memberships;
        const active = memberships.filter(m => m.status === 'active');
        const totalValue = memberships.reduce((s, m) => s + m.price, 0);

        container.innerHTML = `
        <div class="grid-4 mb-3">
            <div class="stat-card"><div class="stat-header"><div class="stat-icon teal"><i class="fas fa-id-card"></i></div></div><div class="stat-value">${memberships.length}</div><div class="stat-label">Total Members</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div><div class="stat-value">${active.length}</div><div class="stat-label">Active</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon orange"><i class="fas fa-peso-sign"></i></div></div><div class="stat-value">${Utils.formatCurrency(totalValue, true)}</div><div class="stat-label">Membership Value</div></div>
            <div class="stat-card"><div class="stat-header"><div class="stat-icon blue"><i class="fas fa-percentage"></i></div></div><div class="stat-value">${memberships.length > 0 ? ((active.length / memberships.length) * 100).toFixed(0) : 0}%</div><div class="stat-label">Retention Rate</div></div>
        </div>

        <div class="section-header mb-2">
            <h2>Memberships</h2>
            <button class="btn btn-primary" onclick="Wellness.openNewMembership()"><i class="fas fa-plus"></i> New Membership</button>
        </div>

        <div class="card">
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'Member', render: r => { const c = DataStore.customers.find(cu => cu.id === r.customer); return `<strong>${c?.name || r.customer}</strong>`; } },
                        { label: 'Package', render: r => `<span class="badge-tag badge-teal">${r.package}</span>` },
                        { label: 'Price', render: r => Utils.formatCurrency(r.price) },
                        { label: 'Sessions', render: r => `<div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${r.sessionsUsed >= r.sessionsTotal ? 'red' : 'green'}" style="width:${r.sessionsTotal > 0 ? (r.sessionsUsed / r.sessionsTotal) * 100 : 0}%"></div></div><span style="font-size:12px">${r.sessionsUsed}/${r.sessionsTotal}</span></div>` },
                        { label: 'Valid Until', render: r => Utils.formatDate(r.validUntil) },
                        { label: 'Status', render: r => `<span class="badge-tag ${r.status === 'active' ? 'badge-success' : 'badge-neutral'}">${r.status}</span>` }
                    ],
                    memberships
                )}
            </div>
        </div>

        <div class="grid-3 mt-3">
            <div class="card">
                <div class="card-header"><h3>Platinum Package</h3></div>
                <div class="card-body" style="text-align:center">
                    <div style="font-size:36px;font-weight:800;color:var(--secondary);margin-bottom:4px">₱9,999</div>
                    <div style="color:var(--text-muted);margin-bottom:16px">per month</div>
                    <ul style="text-align:left;font-size:13px;list-style:none;padding:0">
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>Unlimited massage sessions</li>
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>20% discount on add-ons</li>
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>Priority booking</li>
                        <li style="padding:6px 0"><i class="fas fa-check text-success" style="margin-right:8px"></i>Free hot stone upgrade</li>
                    </ul>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3>Gold Package</h3></div>
                <div class="card-body" style="text-align:center">
                    <div style="font-size:36px;font-weight:800;color:var(--secondary);margin-bottom:4px">₱5,999</div>
                    <div style="color:var(--text-muted);margin-bottom:16px">per month</div>
                    <ul style="text-align:left;font-size:13px;list-style:none;padding:0">
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>12 sessions per month</li>
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>10% discount on add-ons</li>
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>Birthday free session</li>
                        <li style="padding:6px 0"><i class="fas fa-check text-success" style="margin-right:8px"></i>1 free guest pass/month</li>
                    </ul>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><h3>Silver Package</h3></div>
                <div class="card-body" style="text-align:center">
                    <div style="font-size:36px;font-weight:800;color:var(--secondary);margin-bottom:4px">₱2,999</div>
                    <div style="color:var(--text-muted);margin-bottom:16px">per month</div>
                    <ul style="text-align:left;font-size:13px;list-style:none;padding:0">
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>6 sessions per month</li>
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>5% discount on services</li>
                        <li style="padding:6px 0;border-bottom:1px solid var(--border)"><i class="fas fa-check text-success" style="margin-right:8px"></i>Priority booking</li>
                        <li style="padding:6px 0"><i class="fas fa-check text-success" style="margin-right:8px"></i>Special promo access</li>
                    </ul>
                </div>
            </div>
        </div>`;
    },

    openNewMembership() {
        App.openModal('New Membership', `
        <form>
            <div class="form-group"><label>Client</label>
                <select class="form-control" id="newMemClient">
                    ${DataStore.customers.filter(c => c.companies?.includes('nuatthai')).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group"><label>Package</label>
                <select class="form-control" id="newMemPackage" onchange="Wellness.updateMemPrice()">
                    <option value="Platinum" data-price="9999" data-sessions="30">Platinum — ₱9,999/mo (Unlimited)</option>
                    <option value="Gold" data-price="5999" data-sessions="12">Gold — ₱5,999/mo (12 sessions)</option>
                    <option value="Silver" data-price="2999" data-sessions="6">Silver — ₱2,999/mo (6 sessions)</option>
                </select>
            </div>
            <div class="form-group"><label>Valid Until</label><input type="date" class="form-control" id="newMemExpiry"></div>
        </form>`, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Wellness.saveMembership()"><i class="fas fa-save"></i> Create</button>
        `);
    },

    saveMembership() {
        const sel = document.getElementById('newMemPackage');
        const opt = sel.options[sel.selectedIndex];
        DataStore.memberships.push({
            id: Utils.generateId('MEM'),
            customer: document.getElementById('newMemClient').value,
            package: sel.value,
            price: parseFloat(opt.dataset.price),
            sessionsTotal: parseInt(opt.dataset.sessions),
            sessionsUsed: 0,
            validUntil: document.getElementById('newMemExpiry')?.value || '',
            status: 'active'
        });
        App.closeModal();
        App.showToast('Membership created', 'success');
        this.renderMembership(document.getElementById('contentArea'));
    }
};

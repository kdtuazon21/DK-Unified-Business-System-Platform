/* ========================================
   UBMS - Financial Module
   AP/AR, Chart of Accounts, Transactions
   ======================================== */

const Financial = {
    activeTab: 'overview',

    render(container) {
        const summary = DataStore.getFinancialSummary(App.activeCompany);

        container.innerHTML = `
        <!-- KPI Cards -->
        <div class="grid-4 mb-3">
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon green"><i class="fas fa-arrow-down"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 8%</span></div>
                <div class="stat-value">${Utils.formatCurrency(summary.totalRevenue, true)}</div>
                <div class="stat-label">Total Revenue Collected</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon orange"><i class="fas fa-hourglass-half"></i></div></div>
                <div class="stat-value">${Utils.formatCurrency(summary.totalReceivable, true)}</div>
                <div class="stat-label">Accounts Receivable</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon red"><i class="fas fa-arrow-up"></i></div></div>
                <div class="stat-value">${Utils.formatCurrency(summary.totalExpenses, true)}</div>
                <div class="stat-label">Total Expenses</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><div class="stat-icon ${summary.netIncome >= 0 ? 'teal' : 'red'}"><i class="fas fa-balance-scale"></i></div></div>
                <div class="stat-value">${Utils.formatCurrency(summary.netIncome, true)}</div>
                <div class="stat-label">Net Income</div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tab-nav">
            <button class="tab-btn active" onclick="Financial.switchTab('invoices', this)">Invoices (AR)</button>
            <button class="tab-btn" onclick="Financial.switchTab('expenses', this)">Expenses (AP)</button>
            <button class="tab-btn" onclick="Financial.switchTab('accounts', this)">Chart of Accounts</button>
            <button class="tab-btn" onclick="Financial.switchTab('reconciliation', this)">Bank Reconciliation</button>
        </div>

        <div id="financialTabContent">
            ${this.renderInvoicesTab()}
        </div>`;
    },

    switchTab(tab, btn) {
        this.activeTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const content = document.getElementById('financialTabContent');
        switch (tab) {
            case 'invoices': content.innerHTML = this.renderInvoicesTab(); break;
            case 'expenses': content.innerHTML = this.renderExpensesTab(); break;
            case 'accounts': content.innerHTML = this.renderAccountsTab(); break;
            case 'reconciliation': content.innerHTML = this.renderReconciliationTab(); break;
        }
    },

    // ---- INVOICES TAB ----
    renderInvoicesTab() {
        const invoices = App.getFilteredData(DataStore.invoices);

        return `
        <div class="card">
            <div class="card-header">
                <h3>Invoices</h3>
                <div class="card-actions">
                    <select class="form-control" style="width:140px" id="invStatusFilter" onchange="Financial.filterInvoices()">
                        <option value="all">All Statuses</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                    </select>
                    <button class="btn btn-primary" onclick="Financial.openNewInvoice()"><i class="fas fa-plus"></i> New Invoice</button>
                </div>
            </div>
            <div class="card-body no-padding" id="invoiceTableContainer">
                ${this.renderInvoiceTable(invoices)}
            </div>
            <div class="card-footer">
                <span style="font-size:12px;color:var(--text-muted)">${invoices.length} invoice(s)</span>
                <div>
                    <span style="font-size:12px;margin-right:16px"><strong>Total:</strong> ${Utils.formatCurrency(invoices.reduce((s, i) => s + i.amount, 0))}</span>
                    <span style="font-size:12px"><strong>Collected:</strong> ${Utils.formatCurrency(invoices.reduce((s, i) => s + i.paid, 0))}</span>
                </div>
            </div>
        </div>`;
    },

    renderInvoiceTable(invoices) {
        return Utils.buildTable(
            [
                { label: 'Invoice #', render: r => `<span class="font-mono" style="font-weight:600">${r.id}</span>` },
                { label: 'Company', render: r => `<span class="badge-tag badge-${r.company}">${r.company}</span>` },
                { label: 'Customer', render: r => {
                    const cust = DataStore.customers.find(c => c.id === r.customer);
                    return cust ? cust.name : r.customer;
                }},
                { label: 'Description', render: r => `<span class="truncate" style="max-width:200px;display:inline-block">${r.description}</span>` },
                { label: 'Amount', render: r => `<strong>${Utils.formatCurrency(r.amount)}</strong>` },
                { label: 'Paid', render: r => Utils.formatCurrency(r.paid) },
                { label: 'Balance', render: r => {
                    const bal = r.amount - r.paid;
                    return bal > 0 ? `<span class="text-danger">${Utils.formatCurrency(bal)}</span>` : '<span class="text-success">₱0.00</span>';
                }},
                { label: 'Status', render: r => `<span class="badge-tag ${Utils.getStatusClass(r.status)}">${r.status}</span>` },
                { label: 'Due Date', render: r => {
                    const isOverdue = r.status !== 'paid' && new Date(r.dueDate) < new Date();
                    return `<span class="${isOverdue ? 'text-danger' : ''}">${Utils.formatDate(r.dueDate)}${isOverdue ? ' ⚠️' : ''}</span>`;
                }}
            ],
            invoices,
            {
                actions: (r) => `
                    <button class="btn btn-sm btn-secondary" onclick="Financial.viewInvoice('${r.id}')" title="View"><i class="fas fa-eye"></i></button>
                `
            }
        );
    },

    filterInvoices() {
        const status = document.getElementById('invStatusFilter')?.value || 'all';
        let invoices = App.getFilteredData(DataStore.invoices);
        if (status !== 'all') invoices = invoices.filter(i => i.status === status);
        document.getElementById('invoiceTableContainer').innerHTML = this.renderInvoiceTable(invoices);
    },

    viewInvoice(id) {
        const inv = DataStore.invoices.find(i => i.id === id);
        if (!inv) return;
        const cust = DataStore.customers.find(c => c.id === inv.customer);
        const co = DataStore.companies[inv.company];
        const balance = inv.amount - inv.paid;

        const html = `
        <div style="display:flex;justify-content:space-between;margin-bottom:24px">
            <div>
                <h3 style="font-size:20px">${inv.id}</h3>
                <p style="color:var(--text-secondary)">${inv.description}</p>
            </div>
            <span class="badge-tag ${Utils.getStatusClass(inv.status)}" style="height:fit-content;font-size:14px;padding:6px 16px">${inv.status.toUpperCase()}</span>
        </div>

        <div class="grid-2 mb-3">
            <div class="card" style="padding:16px">
                <h4 style="font-size:12px;color:var(--text-muted);margin-bottom:8px">FROM</h4>
                <div style="font-weight:600">${co?.name || inv.company}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${co?.address || ''}</div>
            </div>
            <div class="card" style="padding:16px">
                <h4 style="font-size:12px;color:var(--text-muted);margin-bottom:8px">BILL TO</h4>
                <div style="font-weight:600">${cust?.name || inv.customer}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${cust?.address || ''}</div>
            </div>
        </div>

        <div class="grid-3 mb-3">
            <div><strong>Issue Date:</strong> ${Utils.formatDate(inv.issueDate)}</div>
            <div><strong>Due Date:</strong> ${Utils.formatDate(inv.dueDate)}</div>
            <div><strong>Company:</strong> <span class="badge-tag badge-${inv.company}">${inv.company}</span></div>
        </div>

        <table class="data-table" style="margin-top:16px">
            <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
            <tbody>
                <tr><td>${inv.description}</td><td class="text-right">${Utils.formatCurrency(inv.amount)}</td></tr>
                <tr><td><strong>Total</strong></td><td class="text-right"><strong>${Utils.formatCurrency(inv.amount)}</strong></td></tr>
                <tr><td>Paid</td><td class="text-right text-success">(${Utils.formatCurrency(inv.paid)})</td></tr>
                <tr style="background:var(--bg)"><td><strong>Balance Due</strong></td><td class="text-right"><strong class="${balance > 0 ? 'text-danger' : 'text-success'}">${Utils.formatCurrency(balance)}</strong></td></tr>
            </tbody>
        </table>`;

        const footer = balance > 0 ? `
            <button class="btn btn-secondary" onclick="App.closeModal()">Close</button>
            <button class="btn btn-success" onclick="Financial.recordPayment('${inv.id}')"><i class="fas fa-peso-sign"></i> Record Payment</button>
        ` : `<button class="btn btn-secondary" onclick="App.closeModal()">Close</button>`;

        App.openModal('Invoice Details', html, footer, true);
    },

    recordPayment(invId) {
        const inv = DataStore.invoices.find(i => i.id === invId);
        if (!inv) return;
        const balance = inv.amount - inv.paid;
        inv.paid = inv.amount;
        inv.status = 'paid';
        App.showToast(`Payment of ${Utils.formatCurrency(balance)} recorded for ${invId}`, 'success');
        App.closeModal();
        this.render(document.getElementById('contentArea'));
    },

    openNewInvoice() {
        const html = `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Company <span class="required">*</span></label>
                    <select class="form-control" id="newInvCompany">
                        ${Object.entries(DataStore.companies).map(([id, co]) => `<option value="${id}" ${App.activeCompany === id ? 'selected' : ''}>${co.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Customer <span class="required">*</span></label>
                    <select class="form-control" id="newInvCustomer">
                        ${DataStore.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" class="form-control" id="newInvDesc" placeholder="Invoice description...">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Amount (₱)</label>
                    <input type="number" class="form-control" id="newInvAmount" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" class="form-control" id="newInvDue">
                </div>
            </div>
        </form>`;

        App.openModal('Create New Invoice', html, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Financial.saveNewInvoice()"><i class="fas fa-save"></i> Create Invoice</button>
        `);
    },

    saveNewInvoice() {
        const amount = parseFloat(document.getElementById('newInvAmount')?.value || 0);
        if (!amount) { App.showToast('Amount is required', 'error'); return; }

        const newInv = {
            id: Utils.generateId('INV'),
            company: document.getElementById('newInvCompany').value,
            customer: document.getElementById('newInvCustomer').value,
            amount,
            paid: 0,
            status: 'unpaid',
            description: document.getElementById('newInvDesc').value,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: document.getElementById('newInvDue').value || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
        };

        DataStore.invoices.push(newInv);
        App.closeModal();
        App.showToast(`Invoice ${newInv.id} created (${Utils.formatCurrency(amount)})`, 'success');
        this.render(document.getElementById('contentArea'));
    },

    // ---- EXPENSES TAB ----
    renderExpensesTab() {
        const expenses = App.getFilteredData(DataStore.expenses);

        return `
        <div class="card">
            <div class="card-header">
                <h3>Expenses</h3>
                <button class="btn btn-primary" onclick="Financial.openNewExpense()"><i class="fas fa-plus"></i> Record Expense</button>
            </div>
            <div class="card-body no-padding">
                ${Utils.buildTable(
                    [
                        { label: 'ID', render: r => `<span class="font-mono">${r.id}</span>` },
                        { label: 'Company', render: r => `<span class="badge-tag badge-${r.company}">${r.company}</span>` },
                        { label: 'Date', render: r => Utils.formatDate(r.date) },
                        { label: 'Category', render: r => `<span class="badge-tag badge-neutral">${r.category}</span>` },
                        { label: 'Description', key: 'description' },
                        { label: 'Vendor', key: 'vendor' },
                        { label: 'Amount', render: r => `<strong class="text-danger">${Utils.formatCurrency(r.amount)}</strong>` }
                    ],
                    expenses
                )}
            </div>
            <div class="card-footer">
                <span style="font-size:12px;color:var(--text-muted)">${expenses.length} expense(s)</span>
                <span style="font-size:12px"><strong>Total:</strong> ${Utils.formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</span>
            </div>
        </div>`;
    },

    openNewExpense() {
        const html = `
        <form>
            <div class="form-row">
                <div class="form-group">
                    <label>Company</label>
                    <select class="form-control" id="newExpCompany">
                        ${Object.entries(DataStore.companies).map(([id, co]) => `<option value="${id}" ${App.activeCompany === id ? 'selected' : ''}>${co.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select class="form-control" id="newExpCategory">
                        <option>Materials</option><option>Labor</option><option>Equipment</option>
                        <option>Rent</option><option>Utilities</option><option>Supplies</option>
                        <option>Salaries</option><option>Parts</option><option>Other</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Amount (₱)</label>
                    <input type="number" class="form-control" id="newExpAmount" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" class="form-control" id="newExpDate" value="${new Date().toISOString().split('T')[0]}">
                </div>
            </div>
            <div class="form-group">
                <label>Vendor</label>
                <input type="text" class="form-control" id="newExpVendor">
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" class="form-control" id="newExpDesc">
            </div>
        </form>`;

        App.openModal('Record Expense', html, `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Financial.saveNewExpense()"><i class="fas fa-save"></i> Save</button>
        `);
    },

    saveNewExpense() {
        const amount = parseFloat(document.getElementById('newExpAmount')?.value || 0);
        if (!amount) { App.showToast('Amount is required', 'error'); return; }

        DataStore.expenses.push({
            id: Utils.generateId('EXP'),
            company: document.getElementById('newExpCompany').value,
            category: document.getElementById('newExpCategory').value,
            amount,
            date: document.getElementById('newExpDate').value,
            vendor: document.getElementById('newExpVendor').value,
            description: document.getElementById('newExpDesc').value
        });

        App.closeModal();
        App.showToast('Expense recorded successfully', 'success');
        this.render(document.getElementById('contentArea'));
    },

    // ---- CHART OF ACCOUNTS TAB ----
    renderAccountsTab() {
        const accounts = DataStore.chartOfAccounts.filter(a => App.activeCompany === 'all' || a.company === 'all' || a.company === App.activeCompany);

        const grouped = {};
        accounts.forEach(a => {
            if (!grouped[a.type]) grouped[a.type] = [];
            grouped[a.type].push(a);
        });

        return `
        <div class="card">
            <div class="card-header">
                <h3>Chart of Accounts</h3>
                <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Account</button>
            </div>
            <div class="card-body">
                ${Object.entries(grouped).map(([type, accts]) => `
                    <div style="margin-bottom:24px">
                        <h4 style="margin-bottom:12px;text-transform:capitalize;color:var(--text-secondary)">${type}s</h4>
                        <div style="margin-left:16px">
                            ${accts.map(a => `
                                <div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border-light)">
                                    <div>
                                        <span class="font-mono" style="color:var(--text-muted);margin-right:12px">${a.code}</span>
                                        <span style="font-weight:500">${a.name}</span>
                                    </div>
                                    <span class="badge-tag badge-${a.company === 'all' ? 'neutral' : a.company}">${a.company}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    },

    // ---- BANK RECONCILIATION TAB ----
    renderReconciliationTab() {
        return `
        <div class="card">
            <div class="card-header"><h3>Bank Reconciliation</h3></div>
            <div class="card-body">
                <div class="grid-3 mb-3">
                    <div style="background:var(--bg);padding:20px;border-radius:var(--radius);text-align:center">
                        <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Book Balance</div>
                        <div style="font-size:24px;font-weight:700;color:var(--secondary)">₱14,250,000.00</div>
                    </div>
                    <div style="background:var(--bg);padding:20px;border-radius:var(--radius);text-align:center">
                        <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Bank Statement</div>
                        <div style="font-size:24px;font-weight:700">₱14,180,000.00</div>
                    </div>
                    <div style="background:var(--bg);padding:20px;border-radius:var(--radius);text-align:center">
                        <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">Difference</div>
                        <div style="font-size:24px;font-weight:700;color:var(--warning)">₱70,000.00</div>
                    </div>
                </div>

                <h4 style="margin-bottom:12px">Outstanding Items</h4>
                ${Utils.buildTable(
                    [
                        { label: 'Date', key: 'date' },
                        { label: 'Reference', key: 'ref' },
                        { label: 'Description', key: 'desc' },
                        { label: 'Debit', key: 'debit' },
                        { label: 'Credit', key: 'credit' },
                        { label: 'Status', key: 'status' }
                    ],
                    [
                        { date: 'Feb 20', ref: 'CHK-4521', desc: 'Check to Steel Corp PH', debit: '₱45,000', credit: '-', status: '<span class="badge-tag badge-warning">Outstanding</span>' },
                        { date: 'Feb 21', ref: 'DEP-8812', desc: 'Deposit from AutoCasa POS', debit: '-', credit: '₱22,500', status: '<span class="badge-tag badge-warning">In Transit</span>' },
                        { date: 'Feb 22', ref: 'CHK-4522', desc: 'Check to Payroll', debit: '₱47,500', credit: '-', status: '<span class="badge-tag badge-warning">Outstanding</span>' }
                    ]
                )}
            </div>
        </div>`;
    }
};

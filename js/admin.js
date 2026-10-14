// ===== Admin Panel JavaScript =====

// ===== Sample Data =====
const sampleOrders = [
  { id: 'SK-2026-1847', name: 'Andi Rahmansyah', phone: '081234567001', email: 'andi@mail.com', university: 'Universitas Indonesia', jurusan: 'Manajemen', service: 'Skripsi', status: 'progress', priority: 'high', deadline: '2026-11-15', price: 2500000, notes: 'Skripsi kuantitatif tentang digital marketing', date: '2026-09-20' },
  { id: 'SK-2026-1846', name: 'Sari Putri Anggraini', phone: '081234567002', email: 'sari@mail.com', university: 'Universitas Brawijaya', jurusan: 'Akuntansi', service: 'Olah Data', status: 'done', priority: 'medium', deadline: '2026-10-05', price: 1500000, notes: 'Olah data SPSS regresi berganda', date: '2026-09-15' },
  { id: 'SK-2026-1845', name: 'Budi Wicaksono', phone: '081234567003', email: 'budi@mail.com', university: 'ITS', jurusan: 'Teknik Informatika', service: 'Coding', status: 'review', priority: 'high', deadline: '2026-10-20', price: 3500000, notes: 'Sistem informasi penjualan berbasis web', date: '2026-09-10' },
  { id: 'SK-2026-1844', name: 'Dewi Lestari', phone: '081234567004', email: 'dewi@mail.com', university: 'UGM', jurusan: 'Psikologi', service: 'Skripsi', status: 'pending', priority: 'medium', deadline: '2026-12-01', price: 2500000, notes: 'Skripsi kualitatif studi kasus', date: '2026-10-01' },
  { id: 'SK-2026-1843', name: 'Rizky Pratama', phone: '081234567005', email: 'rizky@mail.com', university: 'Unpad', jurusan: 'Hukum', service: 'Skripsi', status: 'pending', priority: 'low', deadline: '2026-12-15', price: 1500000, notes: 'Skripsi hukum pidana', date: '2026-10-08' },
  { id: 'SK-2026-1842', name: 'Maya Saphira', phone: '081234567006', email: 'maya@mail.com', university: 'Undip', jurusan: 'Ekonomi', service: 'Tesis', status: 'progress', priority: 'high', deadline: '2026-11-30', price: 5000000, notes: 'Tesis S2 tentang ekonomi digital', date: '2026-09-05' },
  { id: 'SK-2026-1841', name: 'Fajar Nugroho', phone: '081234567007', email: 'fajar@mail.com', university: 'Universitas Airlangga', jurusan: 'Farmasi', service: 'Jurnal', status: 'done', priority: 'medium', deadline: '2026-09-30', price: 3000000, notes: 'Jurnal SINTA 2 farmakologi', date: '2026-08-20' },
  { id: 'SK-2026-1840', name: 'Nadia Fitria', phone: '081234567008', email: 'nadia@mail.com', university: 'UNS', jurusan: 'Pendidikan', service: 'Makalah', status: 'done', priority: 'low', deadline: '2026-09-25', price: 500000, notes: 'Makalah pendidikan karakter', date: '2026-09-12' },
  { id: 'SK-2026-1839', name: 'Hendra Wijaya', phone: '081234567009', email: 'hendra@mail.com', university: 'ITB', jurusan: 'Teknik Sipil', service: 'Skripsi', status: 'progress', priority: 'medium', deadline: '2026-11-10', price: 2500000, notes: 'Skripsi analisis struktur bangunan', date: '2026-09-01' },
  { id: 'SK-2026-1838', name: 'Putri Amelia', phone: '081234567010', email: 'putri@mail.com', university: 'Universitas Hasanuddin', jurusan: 'Ilmu Komunikasi', service: 'Skripsi', status: 'cancelled', priority: 'low', deadline: '2026-10-10', price: 1500000, notes: 'Dibatalkan oleh klien', date: '2026-08-25' },
  { id: 'SK-2026-1837', name: 'Ahmad Fauzi', phone: '081234567011', email: 'ahmad@mail.com', university: 'UIN Jakarta', jurusan: 'Ekonomi Syariah', service: 'Skripsi', status: 'done', priority: 'medium', deadline: '2026-09-20', price: 2500000, notes: 'Skripsi perbankan syariah', date: '2026-08-10' },
  { id: 'SK-2026-1836', name: 'Lina Marlina', phone: '081234567012', email: 'lina@mail.com', university: 'Universitas Padjadjaran', jurusan: 'Sastra Inggris', service: 'Makalah', status: 'done', priority: 'low', deadline: '2026-09-15', price: 750000, notes: 'Research paper tentang sociolinguistics', date: '2026-08-05' }
];

// Load data - merge localStorage with sample
function getOrders() {
  const stored = JSON.parse(localStorage.getItem('skripsipro_orders') || '[]');
  if (!localStorage.getItem('skripsipro_sample_loaded')) {
    const merged = [...sampleOrders, ...stored];
    localStorage.setItem('skripsipro_orders', JSON.stringify(merged));
    localStorage.setItem('skripsipro_sample_loaded', 'true');
    return merged;
  }
  return JSON.parse(localStorage.getItem('skripsipro_orders') || '[]');
}

function saveOrders(orders) {
  localStorage.setItem('skripsipro_orders', JSON.stringify(orders));
}

// ===== State =====
let currentFilter = 'all';
let currentSearchQuery = '';
let currentChartMonths = 12;
let currentPage = 1;
const pageSize = 6;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('skripsipro_admin_logged')) {
    showAdmin();
  }
  loadSavedSettings();
});

// ===== Login =====
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (username === 'admin' && password === 'admin123') {
    sessionStorage.setItem('skripsipro_admin_logged', 'true');
    showAdmin();
  } else {
    const errorEl = document.getElementById('loginError');
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 3000);
  }
}

function handleLogout() {
  if (window.event) window.event.preventDefault();
  sessionStorage.removeItem('skripsipro_admin_logged');
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginPage').style.display = '';
}

function showAdmin() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';
  loadDashboard();
  loadOrders();
  loadClients();
  renderChart(currentChartMonths);
  loadSavedSettings();
}

// ===== Sidebar =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function switchPage(page, el) {
  if (window.event) window.event.preventDefault();
  document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  if (el) el.classList.add('active');

  document.getElementById('sidebar').classList.remove('open');
}

// ===== Dashboard =====
function loadDashboard() {
  const orders = getOrders();
  const done = orders.filter(o => o.status === 'done').length;
  const progress = orders.filter(o => o.status === 'progress').length;
  const pending = orders.filter(o => o.status === 'pending').length;

  const statOrders = document.getElementById('statOrders');
  const statDone = document.getElementById('statDone');
  const statProgress = document.getElementById('statProgress');
  const statRevenue = document.getElementById('statRevenue');

  if (statOrders) statOrders.textContent = orders.length;
  if (statDone) statDone.textContent = done;
  if (statProgress) statProgress.textContent = progress + pending;

  const revenue = orders.filter(o => o.status === 'done').reduce((sum, o) => sum + (o.price || 0), 0);
  if (statRevenue) statRevenue.textContent = formatCurrency(revenue);

  // Recent orders table
  const recent = [...orders].reverse().slice(0, 5);
  const tbody = document.getElementById('recentOrdersBody');
  if (tbody) {
    tbody.innerHTML = recent.map(o => `
      <tr>
        <td><span class="order-id">${o.id}</span></td>
        <td>
          <div class="client-info">
            <div class="client-avatar">${getInitials(o.name)}</div>
            <div>
              <div class="client-name">${o.name}</div>
              <div class="client-univ">${o.university}</div>
            </div>
          </div>
        </td>
        <td>${o.service}</td>
        <td>${statusBadge(o.status)}</td>
        <td>${formatDate(o.deadline)}</td>
        <td style="font-weight:600">${formatCurrency(o.price)}</td>
      </tr>
    `).join('');
  }

  // Update badge
  const activeBadge = orders.filter(o => o.status === 'pending' || o.status === 'progress').length;
  const badgeEl = document.getElementById('orderBadge');
  if (badgeEl) badgeEl.textContent = activeBadge;
}

// Global search from topbar
function handleDashSearch(query) {
  if (!query) {
    loadDashboard();
    return;
  }
  const q = query.toLowerCase();
  const orders = getOrders();
  const filtered = orders.filter(o =>
    o.name.toLowerCase().includes(q) ||
    o.id.toLowerCase().includes(q) ||
    o.university.toLowerCase().includes(q) ||
    o.jurusan.toLowerCase().includes(q) ||
    o.service.toLowerCase().includes(q)
  );

  const tbody = document.getElementById('recentOrdersBody');
  if (tbody) {
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:20px;">Tidak ditemukan data yang cocok dengan "${query}"</td></tr>`;
    } else {
      tbody.innerHTML = filtered.slice(0, 5).map(o => `
        <tr>
          <td><span class="order-id">${o.id}</span></td>
          <td>
            <div class="client-info">
              <div class="client-avatar">${getInitials(o.name)}</div>
              <div>
                <div class="client-name">${o.name}</div>
                <div class="client-univ">${o.university}</div>
              </div>
            </div>
          </td>
          <td>${o.service}</td>
          <td>${statusBadge(o.status)}</td>
          <td>${formatDate(o.deadline)}</td>
          <td style="font-weight:600">${formatCurrency(o.price)}</td>
        </tr>
      `).join('');
    }
  }
}

// ===== Notification Dropdown =====
function toggleAdminNotif() {
  const notifDropdown = document.getElementById('adminNotifDropdown');
  if (notifDropdown) {
    notifDropdown.classList.toggle('show');
  }
}

// Close notif when clicking outside
document.addEventListener('click', (e) => {
  const notifWrap = document.getElementById('adminNotifDropdown');
  const notifBtn = document.getElementById('btnAdminNotif');
  if (notifWrap && notifBtn && !notifWrap.contains(e.target) && !notifBtn.contains(e.target)) {
    notifWrap.classList.remove('show');
  }
});

// ===== Chart =====
function setChartRange(monthsCount) {
  currentChartMonths = monthsCount;
  const btn6 = document.getElementById('chartBtn6');
  const btn12 = document.getElementById('chartBtn12');

  if (monthsCount === 6) {
    if (btn6) { btn6.className = 'btn-sm primary'; }
    if (btn12) { btn12.className = 'btn-sm outline'; }
  } else {
    if (btn6) { btn6.className = 'btn-sm outline'; }
    if (btn12) { btn12.className = 'btn-sm primary'; }
  }
  renderChart(monthsCount);
}

function renderChart(monthsCount = 12) {
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const allData = [8, 12, 10, 15, 18, 14, 20, 16, 22, 19, 15, 24];

  const months = monthsCount === 6 ? allMonths.slice(6, 12) : allMonths;
  const data = monthsCount === 6 ? allData.slice(6, 12) : allData;
  const maxVal = Math.max(...data) || 1;

  const container = document.getElementById('chartBars');
  if (!container) return;

  container.innerHTML = months.map((m, i) => {
    const h = data[i] ? (data[i] / maxVal * 100) : 5;
    const color = i % 2 === 0 ? 'purple' : 'green';
    return `
      <div class="chart-bar ${color}" style="height:${h}%">
        ${data[i] ? `<span class="chart-bar-value">${data[i]}</span>` : ''}
        <span class="chart-bar-label">${m}</span>
      </div>
    `;
  }).join('');
}

// ===== Orders & Pagination =====
function loadOrders() {
  const orders = getOrders();
  let filtered = orders;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(o => o.status === currentFilter);
  }

  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.university.toLowerCase().includes(q) ||
      o.jurusan.toLowerCase().includes(q) ||
      o.service.toLowerCase().includes(q)
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filtered.slice(startIndex, startIndex + pageSize);

  const tbody = document.getElementById('ordersTableBody');
  if (tbody) {
    if (paginatedOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">Tidak ada data order</td></tr>`;
    } else {
      tbody.innerHTML = paginatedOrders.map(o => `
        <tr>
          <td><span class="order-id">${o.id}</span></td>
          <td>
            <div class="client-info">
              <div class="client-avatar">${getInitials(o.name)}</div>
              <div>
                <div class="client-name">${o.name}</div>
                <div class="client-univ">${o.university}</div>
              </div>
            </div>
          </td>
          <td>${o.service}</td>
          <td>
            <select class="status-select-inline" onchange="quickUpdateStatus('${o.id}', this.value)">
              <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Menunggu</option>
              <option value="progress" ${o.status === 'progress' ? 'selected' : ''}>Proses</option>
              <option value="review" ${o.status === 'review' ? 'selected' : ''}>Review</option>
              <option value="done" ${o.status === 'done' ? 'selected' : ''}>Selesai</option>
              <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Batal</option>
            </select>
          </td>
          <td>${priorityBadge(o.priority)}</td>
          <td>${formatDate(o.deadline)}</td>
          <td style="font-weight:600">${formatCurrency(o.price)}</td>
          <td>
            <div class="table-actions">
              <button title="Edit" onclick="editOrder('${o.id}')">✏️</button>
              <button title="WhatsApp Klien" onclick="openWA('${o.phone}')">💬</button>
              <button title="Hapus" class="delete" onclick="deleteOrder('${o.id}')">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // Update info text
  const startNum = totalItems === 0 ? 0 : startIndex + 1;
  const endNum = Math.min(startIndex + pageSize, totalItems);
  const infoEl = document.getElementById('orderTableInfo');
  if (infoEl) {
    infoEl.textContent = `Menampilkan ${startNum}-${endNum} dari ${totalItems} order`;
  }

  // Render Pagination controls
  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  const container = document.getElementById('orderPagination');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">◀</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">▶</button>`;
  container.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  loadOrders();
}

function quickUpdateStatus(orderId, newStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = newStatus;
    saveOrders(orders);
    showAdminToast(`Status order ${orderId} diubah menjadi ${newStatus}!`, 'success');
    loadOrders();
    loadDashboard();
    loadClients();
  }
}

function filterOrderStatus(status, btn) {
  currentFilter = status;
  currentPage = 1;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  loadOrders();
}

function filterOrders(query) {
  currentSearchQuery = query;
  currentPage = 1;
  loadOrders();
}

// ===== CRUD Operations =====
function openAdminModal(mode, orderId) {
  const modal = document.getElementById('adminModal');
  const title = document.getElementById('adminModalTitle');
  const form = document.getElementById('adminOrderForm');

  if (mode === 'add') {
    title.textContent = '➕ Tambah Order Baru';
    form.reset();
    document.getElementById('editOrderId').value = '';
    const d = new Date();
    d.setDate(d.getDate() + 30);
    document.getElementById('aDeadline').value = d.toISOString().split('T')[0];
  } else if (mode === 'edit') {
    title.textContent = '✏️ Edit Order';
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      document.getElementById('editOrderId').value = order.id;
      document.getElementById('aClientName').value = order.name;
      document.getElementById('aClientPhone').value = order.phone;
      document.getElementById('aClientUniv').value = order.university;
      document.getElementById('aClientJurusan').value = order.jurusan;
      document.getElementById('aService').value = order.service;
      document.getElementById('aStatus').value = order.status;
      document.getElementById('aPriority').value = order.priority;
      document.getElementById('aDeadline').value = order.deadline;
      document.getElementById('aPrice').value = order.price;
      document.getElementById('aNotes').value = order.notes || '';
    }
  }

  modal.classList.add('active');
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('active');
}

const adminModalOverlay = document.getElementById('adminModal');
if (adminModalOverlay) {
  adminModalOverlay.addEventListener('click', e => {
    if (e.target === adminModalOverlay) closeAdminModal();
  });
}

function saveOrder(e) {
  e.preventDefault();
  const orders = getOrders();
  const editId = document.getElementById('editOrderId').value;

  const orderData = {
    name: document.getElementById('aClientName').value.trim(),
    phone: document.getElementById('aClientPhone').value.trim(),
    university: document.getElementById('aClientUniv').value.trim(),
    jurusan: document.getElementById('aClientJurusan').value.trim(),
    service: document.getElementById('aService').value,
    status: document.getElementById('aStatus').value,
    priority: document.getElementById('aPriority').value,
    deadline: document.getElementById('aDeadline').value,
    price: parseInt(document.getElementById('aPrice').value) || 0,
    notes: document.getElementById('aNotes').value.trim()
  };

  if (editId) {
    const idx = orders.findIndex(o => o.id === editId);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...orderData };
    }
    showAdminToast('Order berhasil diperbarui!', 'success');
  } else {
    orderData.id = 'SK-' + new Date().getFullYear() + '-' + String(orders.length + 1848).padStart(4, '0');
    orderData.date = new Date().toISOString();
    orderData.email = '';
    orders.unshift(orderData);
    showAdminToast(`Order baru ${orderData.id} berhasil ditambahkan!`, 'success');
  }

  saveOrders(orders);
  closeAdminModal();
  loadOrders();
  loadDashboard();
  loadClients();
}

function editOrder(id) {
  openAdminModal('edit', id);
}

function deleteOrder(id) {
  if (!confirm('Yakin ingin menghapus order ' + id + '?')) return;

  let orders = getOrders();
  orders = orders.filter(o => o.id !== id);
  saveOrders(orders);

  showAdminToast('Order berhasil dihapus!', 'success');
  loadOrders();
  loadDashboard();
  loadClients();
}

// ===== Clients =====
function loadClients() {
  const orders = getOrders();

  const clientMap = {};
  orders.forEach(o => {
    const key = o.phone || o.name;
    if (!clientMap[key]) {
      clientMap[key] = {
        name: o.name,
        phone: o.phone,
        university: o.university,
        jurusan: o.jurusan,
        orders: 0,
        totalPaid: 0
      };
    }
    clientMap[key].orders++;
    if (o.status === 'done') {
      clientMap[key].totalPaid += (o.price || 0);
    }
  });

  const clients = Object.values(clientMap);

  const totalClientsEl = document.getElementById('totalClients');
  const repeatClientsEl = document.getElementById('repeatClients');
  const totalUnivEl = document.getElementById('totalUniv');

  if (totalClientsEl) totalClientsEl.textContent = clients.length;
  if (repeatClientsEl) repeatClientsEl.textContent = clients.filter(c => c.orders > 1).length;
  const univs = new Set(clients.map(c => c.university));
  if (totalUnivEl) totalUnivEl.textContent = univs.size;

  const tbody = document.getElementById('clientsTableBody');
  if (tbody) {
    tbody.innerHTML = clients.map(c => `
      <tr>
        <td>
          <div class="client-info">
            <div class="client-avatar">${getInitials(c.name)}</div>
            <div>
              <div class="client-name">${c.name}</div>
              <div class="client-univ">${c.university}</div>
            </div>
          </div>
        </td>
        <td>${c.phone}</td>
        <td>${c.jurusan}</td>
        <td style="font-weight:700;text-align:center;">${c.orders}</td>
        <td style="font-weight:600">${formatCurrency(c.totalPaid)}</td>
        <td>
          <div class="table-actions">
            <button title="Lihat Order" onclick="viewClientOrders('${c.phone}')">👁️</button>
            <button title="WhatsApp" onclick="openWA('${c.phone}')">💬</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

function filterClients(query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#clientsTableBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

function viewClientOrders(phone) {
  switchPage('orders', document.querySelector('[data-page=orders]'));
  const searchInput = document.getElementById('orderSearch');
  if (searchInput) searchInput.value = phone;
  currentSearchQuery = phone;
  currentPage = 1;
  loadOrders();
}

function openWA(phone) {
  let num = phone.replace(/\D/g, '');
  if (num.startsWith('0')) num = '62' + num.substring(1);
  window.open('https://wa.me/' + num, '_blank');
}

// ===== Settings =====
function loadSavedSettings() {
  const savedWA = localStorage.getItem('skripsipro_wa_number');
  const savedTemplate = localStorage.getItem('skripsipro_wa_template');

  const waNumberInput = document.getElementById('waNumber');
  const waTemplateInput = document.getElementById('waTemplate');

  if (savedWA && waNumberInput) {
    waNumberInput.value = savedWA;
  }
  if (savedTemplate && waTemplateInput) {
    waTemplateInput.value = savedTemplate;
  }
}

function changePassword(e) {
  e.preventDefault();
  const oldPw = document.getElementById('oldPassword').value;
  const newPw = document.getElementById('newPassword').value;

  if (oldPw !== 'admin123') {
    showAdminToast('Password lama salah!', 'error');
    return;
  }

  if (newPw.length < 6) {
    showAdminToast('Password minimal 6 karakter!', 'error');
    return;
  }

  showAdminToast('Password berhasil diubah!', 'success');
  document.getElementById('oldPassword').value = '';
  document.getElementById('newPassword').value = '';
}

function saveWhatsApp(e) {
  e.preventDefault();
  const waNumber = document.getElementById('waNumber').value.trim();
  const waTemplate = document.getElementById('waTemplate').value.trim();

  localStorage.setItem('skripsipro_wa_number', waNumber);
  localStorage.setItem('skripsipro_wa_template', waTemplate);

  showAdminToast('Pengaturan WhatsApp berhasil disimpan!', 'success');
}

// ===== Helpers =====
function getInitials(name) {
  if (!name) return 'KP';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0';
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return 'Rp ' + (jt % 1 === 0 ? jt : jt.toFixed(1)) + ' Jt';
  }
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function statusBadge(status) {
  const labels = {
    pending: 'Menunggu',
    progress: 'Proses',
    review: 'Review',
    done: 'Selesai',
    cancelled: 'Batal'
  };
  return `<span class="status-badge ${status}"><span class="dot"></span>${labels[status] || status}</span>`;
}

function priorityBadge(priority) {
  const labels = { high: 'High', medium: 'Medium', low: 'Low' };
  return `<span class="priority-badge ${priority}">${labels[priority] || priority}</span>`;
}

function showAdminToast(msg, type = 'success') {
  const toast = document.getElementById('adminToast');
  const icon = document.getElementById('adminToastIcon');
  const text = document.getElementById('adminToastMsg');

  if (!toast || !icon || !text) return;

  icon.textContent = type === 'success' ? '✅' : '❌';
  text.textContent = msg;
  toast.className = 'admin-toast show ' + type;

  setTimeout(() => toast.classList.remove('show'), 3000);
}


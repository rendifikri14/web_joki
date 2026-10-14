/**
 * ==========================================================================
 * SKRIPSIPRO - MASTER JAVASCRIPT & INTERACTIVE LOGIC
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAnnouncementBar();
  initNavbar();
  initHamburger();
  initHeroTabs();
  initCalculator();
  // initTitleGenerator(); // Removed: Ide Judul AI section removed
  initOrderTracker();
  initTestimonialFilter();
  initFAQSearch();
  initFAQAccordion();
  // initSocialProofPopups(); // Removed: Social proof toast disabled
  initScrollReveal();
  initModalListeners();
});

/* ===== 1. Announcement Bar ===== */
function initAnnouncementBar() {
  const closeBtn = document.getElementById('announcementClose');
  const bar = document.getElementById('announcementBar');
  if (closeBtn && bar) {
    closeBtn.addEventListener('click', () => {
      bar.style.display = 'none';
    });
  }
}

/* ===== 2. Navbar Scroll & Active State ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ===== 3. Hamburger Mobile Menu ===== */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

/* ===== 4. Hero Visual Interactive Tabs ===== */
function initHeroTabs() {
  const tabBtns = document.querySelectorAll('.hero-tab-btn');
  const tabContents = document.querySelectorAll('.hero-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const activeContent = document.getElementById('tab-content-' + targetTab);
      if (activeContent) {
        activeContent.style.display = 'block';
      }
    });
  });

  // Animate progress bars on load
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(fill => {
      const targetWidth = fill.getAttribute('data-width');
      if (targetWidth) {
        fill.style.width = targetWidth + '%';
      }
    });
  }, 500);
}

/* ===== 5. Interactive Price & Scope Calculator ===== */
const calcState = {
  jenjang: 's1', // d3, s1, s2, s3
  scope: 'full',  // proposal, full, olahdata, jurnal, coding
  urgensi: 'standar', // santai, standar, kilat, super
  addons: {
    ppt: false,
    turnitin: true,
    simulasi: false,
    sourcecode: false
  }
};

const basePrices = {
  d3: { proposal: 900000, full: 1500000, olahdata: 500000, jurnal: 1000000, coding: 1200000 },
  s1: { proposal: 1400000, full: 2500000, olahdata: 750000, jurnal: 1500000, coding: 2000000 },
  s2: { proposal: 2800000, full: 4900000, olahdata: 1500000, jurnal: 3000000, coding: 3500000 },
  s3: { proposal: 5500000, full: 9500000, olahdata: 2500000, jurnal: 6000000, coding: 5000000 }
};

const urgencyMultipliers = {
  santai: 0.9,   // 30 hari diskon 10%
  standar: 1.0,  // 14 hari
  kilat: 1.25,   // 7 hari +25%
  super: 1.5     // 3-4 hari +50%
};

const addonPrices = {
  ppt: 150000,
  turnitin: 0, // Included Free
  simulasi: 250000,
  sourcecode: 300000
};

function initCalculator() {
  // Jenjang selector
  document.querySelectorAll('[data-calc-jenjang]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-calc-jenjang]').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      calcState.jenjang = el.getAttribute('data-calc-jenjang');
      updateCalculatorDisplay();
    });
  });

  // Scope selector
  document.querySelectorAll('[data-calc-scope]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-calc-scope]').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      calcState.scope = el.getAttribute('data-calc-scope');
      updateCalculatorDisplay();
    });
  });

  // Urgency selector
  document.querySelectorAll('[data-calc-urgensi]').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-calc-urgensi]').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      calcState.urgensi = el.getAttribute('data-calc-urgensi');
      updateCalculatorDisplay();
    });
  });

  // Addons toggle
  document.querySelectorAll('[data-calc-addon]').forEach(el => {
    el.addEventListener('click', () => {
      const addonKey = el.getAttribute('data-calc-addon');
      calcState.addons[addonKey] = !calcState.addons[addonKey];
      el.classList.toggle('checked', calcState.addons[addonKey]);
      const checkIcon = el.querySelector('.addon-checkbox');
      if (checkIcon) {
        checkIcon.textContent = calcState.addons[addonKey] ? '✓' : '';
      }
      updateCalculatorDisplay();
    });
  });

  updateCalculatorDisplay();
}

function updateCalculatorDisplay() {
  const base = basePrices[calcState.jenjang][calcState.scope] || 2500000;
  const multiplier = urgencyMultipliers[calcState.urgensi] || 1.0;
  let total = base * multiplier;

  // Add add-ons
  Object.keys(calcState.addons).forEach(key => {
    if (calcState.addons[key]) {
      total += addonPrices[key] || 0;
    }
  });

  // Old price simulation (20% higher)
  const oldPrice = total * 1.25;

  const priceValEl = document.getElementById('calcResultPrice');
  const priceOldEl = document.getElementById('calcResultOldPrice');
  const scopeNameEl = document.getElementById('calcResultScopeName');

  if (priceValEl) {
    priceValEl.textContent = 'Rp ' + (Math.round(total / 10000) * 10).toLocaleString('id-ID') + ' Rb';
  }
  if (priceOldEl) {
    priceOldEl.textContent = 'Rp ' + (Math.round(oldPrice / 10000) * 10).toLocaleString('id-ID') + ' Rb';
  }
  if (scopeNameEl) {
    const jenjangLabel = calcState.jenjang.toUpperCase();
    const scopeNames = {
      proposal: 'Proposal (BAB 1-3)',
      full: 'Full Skripsi (BAB 1-5)',
      olahdata: 'Olah Data Statistik',
      jurnal: 'Jurnal Ilmiah / Publikasi',
      coding: 'Aplikasi / Program TA'
    };
    scopeNameEl.textContent = `Paket ${jenjangLabel} — ${scopeNames[calcState.scope] || 'Kustom'}`;
  }
}

// Function to trigger modal pre-filled with calculator data
window.orderFromCalculator = function() {
  const jenjangMap = { d3: 'D3', s1: 'S1', s2: 'S2', s3: 'S3' };
  const scopeMap = {
    proposal: 'skripsi',
    full: 'skripsi',
    olahdata: 'olahdata',
    jurnal: 'jurnal',
    coding: 'coding'
  };

  openOrderModal({
    service: scopeMap[calcState.scope] || 'skripsi',
    notes: `Estimasi Kalkulator: Jenjang ${jenjangMap[calcState.jenjang]}, Lingkup: ${calcState.scope}, Deadline Urgensi: ${calcState.urgensi}.`
  });
};

/* ===== 6. AI Judul Skripsi Generator Simulator ===== */
const sampleTitlesDatabase = {
  manajemen: [
    {
      title: "Pengaruh Live Shopping TikTok dan FOMO terhadap Keputusan Pembelian Impulsif Generasi Z dengan Brand Trust sebagai Variabel Mediasi",
      metode: "Kuantitatif • Analisis SEM-PLS • Variabel: Live Shopping, FOMO, Brand Trust, Keputusan Pembelian",
      tag: "Manajemen Pemasaran"
    },
    {
      title: "Strategi Manajemen Resiko Rantai Pasok dalam Menghadapi Fluktuasi Inflasi pada Sektor UMKM Makanan & Minuman",
      metode: "Kualitatif Deskriptif • Triangulasi Sumber Data • Variabel: Supply Chain Resilience & Cost Mitigation",
      tag: "Manajemen Operasional"
    },
    {
      title: "Pengaruh Flexible Working Arrangement (FWA) terhadap Employee Engagement dan Kinerja Karyawan Tech Startup",
      metode: "Kuantitatif • SPSS Regresi Linear Berganda • Variabel: FWA, Job Satisfaction, Performance",
      tag: "Manajemen SDM"
    }
  ],
  informatika: [
    {
      title: "Penerapan Algoritma Deep Learning YOLOv8 untuk Deteksi Hama Tanaman Padi Berbasis Computer Vision dan Mobile App",
      metode: "R&D / Eksperimen IT • Framework: PyTorch, Flutter & FastAPI • Akurasi mAP > 92%",
      tag: "Artificial Intelligence"
    },
    {
      title: "Rancang Bangun Sistem Informasi Rekam Medis Elektronik Terintegrasi Blockchain untuk Keamanan Data Pasien",
      metode: "Metode Scrum / Agile • Solidity Smart Contract & Next.js • Enkripsi AES-256",
      tag: "Web & Cyber Security"
    },
    {
      title: "Analisis Sentimen Opini Publik terhadap Kebijakan Transportasi Listrik Menggunakan Model IndoBERT",
      metode: "Data Science & NLP • Python, HuggingFace, Twitter/X API Scraping • F1-Score Evaluation",
      tag: "Data Science"
    }
  ],
  akuntansi: [
    {
      title: "Pengaruh Penerapan Green Accounting dan Carbon Emission Disclosure terhadap Nilai Perusahaan dengan Profitabilitas sebagai Pemoderasi",
      metode: "Kuantitatif Data Sekunder • Regresi Data Panel (EViews) • Sampel: IDX ESG Leaders 2022-2025",
      tag: "Akuntansi Keuangan"
    },
    {
      title: "Analisis Efektivitas Sistem Pengendalian Internal Berbasis COSO Framework dalam Pencegahan Fraud Pengadaan Barang",
      metode: "Kualitatif Studi Kasus • Observasi & Wawancara Mendalam • Audit Internal",
      tag: "Audit & Forensic"
    },
    {
      title: "Faktor-Faktor yang Mempengaruhi Kepatuhan Wajib Pajak Pasca Implementasi Core Tax Administration System",
      metode: "Kuantitatif • SmartPLS 4 • TAM (Technology Acceptance Model)",
      tag: "Perpajakan"
    }
  ],
  hukum: [
    {
      title: "Perlindungan Hukum terhadap Korban Kebocoran Data Pribadi Finansial Menurut UU No. 27 Tahun 2022",
      metode: "Yuridis Normatif • Pendekatan Perundang-Undangan & Komparatif Internasional (GDPR)",
      tag: "Hukum Siber & Privasi"
    },
    {
      title: "Tinjauan Yuridis Kedudukan Smart Contracts dalam Hukum Perjanjian Konvensional di Indonesia",
      metode: "Yuridis Doktrinal • Analisis Asas Kebebasan Berkontrak Pasal 1338 KUHPerdata",
      tag: "Hukum Perdata Bisnis"
    },
    {
      title: "Rekonstruksi Pertanggungjawaban Pidana Korporasi dalam Tindak Pidana Pencucian Uang Lintas Negara",
      metode: "Yuridis Sosiologis • Pendekatan Kasus & Viktimologi",
      tag: "Hukum Pidana Khusus"
    }
  ],
  kesehatan: [
    {
      title: "Hubungan Pola Tidur dan Stres Akademik terhadap Derajat Hipertensi Usia Dewasa Muda: Studi Cross-Sectional",
      metode: "Kuantitatif Analitik • Uji Chi-Square & Regresi Logistik • Sampel: 150 Mahasiswa",
      tag: "Keperawatan / Kesmas"
    },
    {
      title: "Efektivitas Edukasi Berbasis Video Animasi terhadap Tingkat Pengetahuan Ibu Mengenai Pencegahan Stunting Balita",
      metode: "Quasi-Experimental (Pre & Post Test Control Group Design) • Uji Wilcoxon",
      tag: "Gizi & Promkes"
    },
    {
      title: "Analisis Kepatuhan Perawat dalam Penerapan Five Moments Hand Hygiene terhadap Angka HAIs di Ruang Rawat Inap",
      metode: "Observasional Analitik • SPSS Chi-Square • Clinical Audit",
      tag: "Manajemen Keperawatan"
    }
  ],
  psikologi: [
    {
      title: "Pengaruh Fear of Missing Out (FOMO) dan Social Comparison terhadap Psychological Well-Being Dimediasi oleh Self-Esteem",
      metode: "Kuantitatif • Path Analysis (SmartPLS) • Skala Likert Terstandar",
      tag: "Psikologi Sosial & Media"
    },
    {
      title: "Hubungan antara Work-Life Balance dan Burnout pada Karyawan Generasi Milenial dengan Resiliensi Diri sebagai Moderator",
      metode: "Kuantitatif Korelasional • Moderated Regression Analysis (MRA) • SPSS Process Hayes",
      tag: "Psikologi Industri (PIO)"
    },
    {
      title: "Studi Fenomenologis Pengalaman Quarter-Life Crisis pada Mahasiswa Tingkat Akhir yang Mengalami Hambatan Skripsi",
      metode: "Kualitatif Fenomenologi IPA (Interpretative Phenomenological Analysis)",
      tag: "Psikologi Klinis & Perkembangan"
    }
  ]
};

function initTitleGenerator() {
  const majorSelect = document.getElementById('genMajorSelect');
  const genBtn = document.getElementById('genTitleBtn');
  const resultsContainer = document.getElementById('genResultsGrid');

  if (!majorSelect || !genBtn || !resultsContainer) return;

  genBtn.addEventListener('click', () => {
    const selectedMajor = majorSelect.value;
    const titlesList = sampleTitlesDatabase[selectedMajor] || sampleTitlesDatabase.manajemen;

    // Button loading state
    genBtn.innerHTML = '⚡ Menganalisis Topik...';
    genBtn.disabled = true;

    setTimeout(() => {
      renderGeneratedTitles(titlesList);
      genBtn.innerHTML = '✨ Generate Judul Lainnya';
      genBtn.disabled = false;
    }, 450);
  });

  // Initial render
  renderGeneratedTitles(sampleTitlesDatabase.manajemen);
}

function renderGeneratedTitles(titles) {
  const container = document.getElementById('genResultsGrid');
  if (!container) return;

  container.innerHTML = '';
  titles.forEach(item => {
    const card = document.createElement('div');
    card.className = 'title-card reveal visible';
    card.innerHTML = `
      <div>
        <span class="title-category-badge">🎯 ${item.tag}</span>
        <h4>${item.title}</h4>
        <p class="metode-info">${item.metode}</p>
      </div>
      <button class="title-use-btn" onclick="useGeneratedTitle('${encodeURIComponent(item.title)}')">
        📝 Gunakan Judul Ini & Konsultasikan →
      </button>
    `;
    container.appendChild(card);
  });
}

window.useGeneratedTitle = function(encodedTitle) {
  const title = decodeURIComponent(encodedTitle);
  openOrderModal({
    notes: `Saya tertarik dengan judul ini: "${title}". Mohon bantu proses konsultasi dan pengerjaannya.`
  });
};

/* ===== 7. Interactive Order / Resi Tracker ===== */
const sampleTrackingData = {
  'SK-2026-1847': {
    name: 'Andi Rahmansyah',
    univ: 'Universitas Indonesia',
    jurusan: 'Manajemen',
    package: 'Paket Skripsi Pro',
    activeStep: 4, // 1 to 5
    progress: '85%',
    turnitin: '4%',
    statusText: 'Bab 4 & Olah Data SPSS Selesai — Review Bab 5',
    lastUpdate: 'Hari ini, 09:30 WIB'
  },
  'SK-2026-1920': {
    name: 'Citra Kirana',
    univ: 'Universitas Gadjah Mada',
    jurusan: 'Ilmu Hukum',
    package: 'Paket Skripsi Basic',
    activeStep: 5,
    progress: '100%',
    turnitin: '6%',
    statusText: 'Full Draft Bab 1-5 ACC & PPT Sidang Siap',
    lastUpdate: 'Kemarin, 16:45 WIB'
  },
  'SK-2026-2005': {
    name: 'Dimas Aditya',
    univ: 'Institut Teknologi Bandung',
    jurusan: 'Teknik Informatika',
    package: 'Paket Coding & Skripsi',
    activeStep: 3,
    progress: '60%',
    turnitin: '3%',
    statusText: 'Implementasi API & Bab 3 Metodologi',
    lastUpdate: '2 jam lalu'
  }
};

function initOrderTracker() {
  const trackBtn = document.getElementById('btnSearchTrack');
  const trackInput = document.getElementById('inputTrackId');

  if (trackBtn && trackInput) {
    trackBtn.addEventListener('click', () => {
      const id = trackInput.value.trim().toUpperCase();
      searchTrack(id);
    });

    trackInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchTrack(trackInput.value.trim().toUpperCase());
      }
    });
  }

  // Load initial demo
  searchTrack('SK-2026-1847');
}

window.trackQuickId = function(id) {
  const trackInput = document.getElementById('inputTrackId');
  if (trackInput) trackInput.value = id;
  searchTrack(id);
};

window.copyTrackingId = function(id) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(id).then(() => {
      showToastNotice(`📋 ID ${id} berhasil disalin ke clipboard!`);
    });
  } else {
    showToastNotice(`📋 ID Order: ${id}`);
  }
};

function searchTrack(id) {
  const resultDisplay = document.getElementById('trackerResultContent');
  if (!resultDisplay) return;

  // 1. Check in localStorage orders first
  const storedOrders = JSON.parse(localStorage.getItem('skripsipro_orders') || '[]');
  const foundOrder = storedOrders.find(o => o.id && o.id.toUpperCase() === id.toUpperCase());

  let data = null;

  if (foundOrder) {
    const statusStepMap = {
      pending: { step: 1, progress: '20%', turnitin: 'Antrean Cek', text: 'Konsultasi Judul & Matrix Variabel' },
      progress: { step: 3, progress: '65%', turnitin: '4% (Aman)', text: 'Pengerjaan Metodologi, Bab 3 & Olah Data' },
      review: { step: 4, progress: '85%', turnitin: '4% (Lolos)', text: 'Review Pembahasan Bab 4 & 5 + PPT' },
      done: { step: 5, progress: '100%', turnitin: '4% (ACC Kampus)', text: 'Draft Lengkap Selesai & Siap Sidang' },
      cancelled: { step: 1, progress: '0%', turnitin: '-', text: 'Order Dibatalkan' }
    };

    const mapped = statusStepMap[foundOrder.status] || statusStepMap.pending;

    data = {
      name: foundOrder.name,
      univ: foundOrder.university,
      jurusan: foundOrder.jurusan,
      package: (foundOrder.package ? `Paket ${foundOrder.package.toUpperCase()}` : foundOrder.service),
      activeStep: mapped.step,
      progress: mapped.progress,
      turnitin: mapped.turnitin,
      statusText: foundOrder.notes ? `${mapped.text} (${foundOrder.notes})` : mapped.text,
      lastUpdate: 'Diperbarui via Sistem SkripsiPro'
    };
  } else if (sampleTrackingData[id]) {
    data = sampleTrackingData[id];
  } else {
    data = {
      name: 'Klien #' + id,
      univ: 'Universitas Partner',
      jurusan: 'Karya Ilmiah',
      package: 'Paket Skripsi Reguler',
      activeStep: 2,
      progress: '40%',
      turnitin: 'Turnitin In-Progress',
      statusText: 'Pengerjaan Bab 2 Tinjauan Pustaka',
      lastUpdate: 'Sedang dikerjakan oleh Tim Ahli'
    };
  }

  const steps = [
    { title: 'Konsultasi & ACC Judul', desc: 'Briefing & Matrix Variabel' },
    { title: 'Draft Proposal Bab 1-3', desc: 'Latar Belakang & Teori' },
    { title: 'Cek Turnitin & Olah Data', desc: 'SPSS / SmartPLS Validasi' },
    { title: 'Pembahasan Bab 4 & 5', desc: 'Kesimpulan & Saran' },
    { title: 'Finishing & PPT Sidang', desc: 'Garansi Siap Sidang ACC' }
  ];

  let stepsHTML = '';
  steps.forEach((step, idx) => {
    const stepNum = idx + 1;
    let statusClass = '';
    let icon = stepNum;

    if (stepNum < data.activeStep) {
      statusClass = 'completed';
      icon = '✓';
    } else if (stepNum === data.activeStep) {
      statusClass = 'active';
      icon = '⚡';
    }

    stepsHTML += `
      <div class="step-node ${statusClass}">
        <div class="step-dot">${icon}</div>
        <h5>${step.title}</h5>
        <p>${step.desc}</p>
      </div>
    `;
  });

  resultDisplay.innerHTML = `
    <div style="background:rgba(0,0,0,0.3); border-radius:16px; padding:24px; border:1px solid rgba(167,139,250,0.2); margin-bottom:28px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:var(--primary-light); font-weight:700;">TRACKING ID: ${id}</span>
            <button onclick="copyTrackingId('${id}')" style="background:rgba(167,139,250,0.15); border:1px solid rgba(167,139,250,0.3); color:var(--primary-light); border-radius:4px; font-size:0.7rem; padding:2px 6px; cursor:pointer;" title="Salin ID">📋 Salin</button>
          </div>
          <h4 style="font-size:1.15rem; font-weight:800; color:#FFF; margin-top:2px;">${data.name} — ${data.univ}</h4>
          <p style="font-size:0.82rem; color:var(--text-secondary);">${data.jurusan} • ${data.package}</p>
        </div>
        <div style="text-align:right;">
          <span style="background:rgba(16,185,129,0.15); color:var(--emerald); border:1px solid rgba(16,185,129,0.3); padding:4px 12px; border-radius:999px; font-size:0.78rem; font-weight:800;">
            Turnitin: ${data.turnitin}
          </span>
          <div style="font-size:0.74rem; color:var(--text-muted); margin-top:4px;">Update: ${data.lastUpdate}</div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.04); border-radius:8px; padding:12px 16px; font-size:0.86rem; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
        <span>📌</span> <strong>Status Saat Ini:</strong> ${data.statusText}
      </div>
    </div>
    <div class="stepper-track">
      ${stepsHTML}
    </div>
  `;
}

/* ===== 8. Testimonial Filter ===== */
function initTestimonialFilter() {
  const filterBtns = document.querySelectorAll('.testi-filter-btn');
  const cards = document.querySelectorAll('.testimonial-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===== 9. FAQ Search & Accordion ===== */
function initFAQSearch() {
  const searchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    faqItems.forEach(item => {
      const questionText = item.querySelector('.faq-question-btn span')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.faq-answer-body p')?.textContent.toLowerCase() || '';

      if (questionText.includes(query) || answerText.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

function initFAQAccordion() {
  document.querySelectorAll('.faq-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ===== 10. Social Proof Popups (Periodic Live Toast) ===== */
const socialProofData = [
  { name: 'Rian S.', campus: 'Universitas Indonesia', action: 'Baru saja order Paket Skripsi Pro', time: '2 menit lalu', icon: '🎓' },
  { name: 'Nabila K.', campus: 'Univ Gadjah Mada', action: 'ACC Bab 4 & 5 Nilai A!', time: '5 menit lalu', icon: '🎉' },
  { name: 'Bagas W.', campus: 'Institut Teknologi Bandung', action: 'Order Layanan Olah Data SPSS & SmartPLS', time: '8 menit lalu', icon: '📊' },
  { name: 'Putri A.', campus: 'Universitas Brawijaya', action: 'Turnitin Lolos Similarity 5%', time: '14 menit lalu', icon: '🛡️' },
  { name: 'Fikri H.', campus: 'Universitas Diponegoro', action: 'Baru saja konsultasi Proposal Tesis', time: '20 menit lalu', icon: '📝' }
];

function initSocialProofPopups() {
  const toast = document.getElementById('socialProofToast');
  if (!toast) return;

  let index = 0;

  function showNextPopup() {
    const current = socialProofData[index];
    toast.innerHTML = `
      <div class="social-proof-avatar">${current.icon}</div>
      <div class="social-proof-text">
        <h5>${current.name} (${current.campus})</h5>
        <p>${current.action}</p>
        <span class="social-proof-time">🕒 ${current.time}</span>
      </div>
    `;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);

    index = (index + 1) % socialProofData.length;
  }

  // Initial trigger after 4s, then repeat every 14s
  setTimeout(() => {
    showNextPopup();
    setInterval(showNextPopup, 14000);
  }, 4000);
}

/* ===== 11. Scroll Reveal Animations ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ===== 12. Modal Order & Synchronization ===== */
function getBusinessWhatsAppNumber() {
  let savedWA = localStorage.getItem('skripsipro_wa_number');
  if (savedWA) {
    let clean = savedWA.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.substring(1);
    return clean;
  }
  return '6281234567890';
}

function initModalListeners() {
  const overlay = document.getElementById('orderModal');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOrderModal();
    }
  });

  const form = document.getElementById('orderModalForm');
  if (form) {
    form.addEventListener('submit', handleOrderSubmit);
  }

  // Set minimum date to today
  const deadlineInput = document.getElementById('modalDeadline');
  if (deadlineInput) {
    const today = new Date().toISOString().split('T')[0];
    deadlineInput.setAttribute('min', today);
  }
}

window.openOrderModal = function(initialData = {}) {
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  if (initialData.service) {
    const svcEl = document.getElementById('modalService');
    if (svcEl) svcEl.value = initialData.service;
  }
  if (initialData.package) {
    const pkgEl = document.getElementById('modalPackage');
    if (pkgEl) pkgEl.value = initialData.package;
  }
  if (initialData.notes) {
    const notesEl = document.getElementById('modalNotes');
    if (notesEl) notesEl.value = initialData.notes;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeOrderModal = function() {
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
};

function handleOrderSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('modalName').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const email = document.getElementById('modalEmail')?.value.trim() || '';
  const univ = document.getElementById('modalUniv').value.trim();
  const jurusan = document.getElementById('modalJurusan').value.trim();
  const service = document.getElementById('modalService').value;
  const packageTier = document.getElementById('modalPackage').value;
  const deadline = document.getElementById('modalDeadline')?.value || '';
  const notes = document.getElementById('modalNotes')?.value.trim() || '';

  // Calculate approximate price
  const priceMap = { basic: 1500000, pro: 2500000, premium: 5000000, custom: 0 };
  const price = priceMap[packageTier] || 2500000;

  const orders = JSON.parse(localStorage.getItem('skripsipro_orders') || '[]');
  const orderId = 'SK-' + new Date().getFullYear() + '-' + String(orders.length + 1848).padStart(4, '0');

  const newOrder = {
    id: orderId,
    name,
    phone,
    email,
    university: univ,
    jurusan,
    service,
    package: packageTier,
    deadline,
    notes,
    price,
    status: 'pending',
    priority: 'medium',
    date: new Date().toISOString()
  };

  orders.unshift(newOrder);
  localStorage.setItem('skripsipro_orders', JSON.stringify(orders));

  const waNumber = getBusinessWhatsAppNumber();
  const waMsg = `Halo Admin SkripsiPro!%0A%0ASaya ingin konsultasi order skripsi:%0A*ID Order:* ${orderId}%0A*Nama:* ${encodeURIComponent(name)}%0A*Kampus:* ${encodeURIComponent(univ)}%0A*Jurusan:* ${encodeURIComponent(jurusan)}%0A*Layanan:* ${encodeURIComponent(service)} (${encodeURIComponent(packageTier)})%0A*Deadline:* ${encodeURIComponent(deadline || 'Fleksibel')}%0A*Catatan:* ${encodeURIComponent(notes || '-')}%0A%0AMohon info estimasi dan langkah selanjutnya ya kak. Terima kasih!`;

  document.getElementById('orderModalForm').reset();
  closeOrderModal();

  showToastNotice(`✅ Order ${orderId} berhasil dikirim! Membuka WhatsApp...`);

  // Also auto-track this order in the tracker if user is on the page
  setTimeout(() => {
    trackQuickId(orderId);
  }, 500);

  setTimeout(() => {
    window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank');
  }, 1200);
}

function showToastNotice(msg) {
  const toast = document.getElementById('toastNotice');
  if (!toast) return;

  const msgEl = document.getElementById('toastNoticeMsg');
  if (msgEl) msgEl.textContent = msg;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ===== 13. Theme Toggle (Light / Dark Mode) ===== */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('skripsipro-theme');
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  // Apply saved theme on load
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.textContent = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = '🌙';
  }

  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('skripsipro-theme', newTheme);

    if (themeIcon) {
      themeIcon.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
        themeIcon.style.transform = 'rotate(0deg)';
      }, 200);
    }
  });
}

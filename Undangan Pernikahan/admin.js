// ==========================================================================
// WEDDING ADMIN CONTROLLER (admin.js)
// Mengatur Logika Panel Pengelola Undangan, Keamanan PIN, Foto, Kata-Kata,
// Generator Link Tamu, WhatsApp Sender, dan Moderasi Ucapan
// ==========================================================================

let currentSettings = null;
let currentGuests = [];
let currentUcapans = [];
let localAudioPreview = null;

// Salinan sementara foto galeri untuk diedit sebelum disimpan
let editingGaleriFotos = [];
let tempFotoCover = null;
let tempFotoPria = null;
let tempFotoWanita = null;

document.addEventListener("DOMContentLoaded", function () {
    // 1. Cek Sesi Autentikasi PIN
    cekSesiAdmin();

    // 2. Dengarkan Status Database Firebase
    cekStatusKoneksiDb();

    // 3. Inisialisasi Data Settings
    if (typeof WeddingSettings !== 'undefined') {
        WeddingSettings.onSettingsChange(onSettingsLoaded);
    }

    // 4. Inisialisasi Data Tamu
    if (typeof TamuDB !== 'undefined') {
        TamuDB.onTamuChange(onTamuLoaded);
    }

    // 5. Inisialisasi Data Ucapan / RSVP
    if (typeof UcapanDB !== 'undefined') {
        UcapanDB.onUcapanChange(onUcapanLoaded);
    }

    // 6. Inisialisasi Live Link Preview
    updateLiveLinkPreview();
});

// --------------------------------------------------------------------------
// 1. KEAMANAN PIN & AUTENTIKASI
// --------------------------------------------------------------------------
function cekSesiAdmin() {
    const isAuth = sessionStorage.getItem('wedding_admin_auth') === 'true';
    const lockScreen = document.getElementById('lock-screen');
    if (isAuth && lockScreen) {
        lockScreen.classList.add('hidden');
    }
}

function verifikasiPin(event) {
    if (event) event.preventDefault();
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');
    const inputVal = pinInput ? pinInput.value.trim() : '';

    const settings = currentSettings || WeddingSettings.get();
    const correctPin = settings.adminPin || "1234";

    if (inputVal === correctPin) {
        sessionStorage.setItem('wedding_admin_auth', 'true');
        const lockScreen = document.getElementById('lock-screen');
        if (lockScreen) {
            lockScreen.classList.add('hidden');
        }
        showToast("Selamat datang di Panel Admin!", "success");
    } else {
        if (pinError) {
            pinError.innerText = "PIN salah. Silakan coba lagi.";
        }
        if (pinInput) {
            pinInput.value = '';
            pinInput.focus();
        }
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('wedding_admin_auth');
    const lockScreen = document.getElementById('lock-screen');
    const pinInput = document.getElementById('pin-input');
    const pinError = document.getElementById('pin-error');

    if (pinError) pinError.innerText = '';
    if (pinInput) pinInput.value = '';
    if (lockScreen) lockScreen.classList.remove('hidden');
    showToast("Panel admin berhasil dikunci.", "info");
}

function gantiPinAdmin(event) {
    event.preventDefault();
    const pinBaru = document.getElementById('pin-baru').value.trim();
    const pinKonfirmasi = document.getElementById('pin-konfirmasi').value.trim();

    if (pinBaru.length < 4) {
        showToast("PIN minimal 4 digit angka.", "danger");
        return;
    }

    if (pinBaru !== pinKonfirmasi) {
        showToast("Konfirmasi PIN tidak cocok.", "danger");
        return;
    }

    WeddingSettings.save({ adminPin: pinBaru }).then(() => {
        showToast("PIN Admin berhasil diperbarui!", "success");
        document.getElementById('pin-baru').value = '';
        document.getElementById('pin-konfirmasi').value = '';
    });
}

// --------------------------------------------------------------------------
// 2. NAVIGASI TAB
// --------------------------------------------------------------------------
function switchTab(tabName) {
    // Matikan preview audio jika sedang menyala saat pindah tab
    if (localAudioPreview && !localAudioPreview.paused) {
        localAudioPreview.pause();
        const icon = document.getElementById('icon-preview-lagu');
        if (icon) icon.className = 'fa-solid fa-play';
    }

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const targetContent = document.getElementById(`tab-${tabName}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // Aktifkan tombol yang sesuai
    const clickedBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => 
        b.getAttribute('onclick')?.includes(`'${tabName}'`)
    );
    if (clickedBtn) clickedBtn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function focusTambahTamu() {
    setTimeout(() => {
        const input = document.getElementById('tamu-nama');
        if (input) input.focus();
    }, 100);
}

// --------------------------------------------------------------------------
// 3. STATUS KONEKSI DATABASE
// --------------------------------------------------------------------------
function cekStatusKoneksiDb() {
    const dot = document.getElementById('db-status-dot');
    const text = document.getElementById('db-status-text');

    if (typeof db !== 'undefined' && db) {
        if (dot) dot.style.backgroundColor = 'var(--success)';
        if (text) text.innerText = 'Firebase Realtime Online';
    } else {
        if (dot) dot.style.backgroundColor = 'var(--warning)';
        if (text) text.innerText = 'Penyimpanan Lokal (Offline)';
    }
}

// --------------------------------------------------------------------------
// 4. PEMUATAN PENGATURAN (SETTINGS) & POPULASI FORM
// --------------------------------------------------------------------------
function onSettingsLoaded(settings) {
    currentSettings = settings;

    // Perbarui judul navbar
    const navText = document.getElementById('nav-mempelai-text');
    if (navText && settings.pria && settings.wanita) {
        navText.innerText = `The Wedding of ${settings.pria.panggilan} & ${settings.wanita.panggilan}`;
    }

    // TAB 3: Populasi Form Kata-Kata
    setVal('text-sub-title', settings.subTitle);
    setVal('text-ayat', settings.ayat);
    setVal('text-surah', settings.surah);
    setVal('text-salam-pembuka', settings.salamPembuka);

    // Mempelai Pria
    setVal('pria-panggilan', settings.pria?.panggilan);
    setVal('pria-nama-lengkap', settings.pria?.namaLengkap);
    setVal('pria-orang-tua', settings.pria?.orangTua);
    setVal('pria-instagram', settings.pria?.instagram);

    // Mempelai Wanita
    setVal('wanita-panggilan', settings.wanita?.panggilan);
    setVal('wanita-nama-lengkap', settings.wanita?.namaLengkap);
    setVal('wanita-orang-tua', settings.wanita?.orangTua);
    setVal('wanita-instagram', settings.wanita?.instagram);

    // Countdown Date
    if (settings.countdownDate) {
        const dt = new Date(settings.countdownDate);
        if (!isNaN(dt.getTime())) {
            const pad = (n) => String(n).padStart(2, '0');
            const formatted = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
            setVal('countdown-date-input', formatted);
        }
    }

    // Acara 1
    setVal('acara1-judul', settings.acara1?.judul);
    setVal('acara1-tanggal', settings.acara1?.tanggal);
    setVal('acara1-jam', settings.acara1?.jam);
    setVal('acara1-lokasi', settings.acara1?.lokasi);

    // Acara 2
    setVal('acara2-judul', settings.acara2?.judul);
    setVal('acara2-tanggal', settings.acara2?.tanggal);
    setVal('acara2-jam', settings.acara2?.jam);
    setVal('acara2-lokasi', settings.acara2?.lokasi);

    // Acara 3
    setVal('acara3-judul', settings.acara3?.judul);
    setVal('acara3-tanggal', settings.acara3?.tanggal);
    setVal('acara3-jam', settings.acara3?.jam);
    setVal('acara3-lokasi', settings.acara3?.lokasi);

    // Maps
    setVal('maps-url', settings.mapsUrl);
    setVal('maps-embed', settings.mapsEmbed);

    // Penutup
    setVal('text-penutup', settings.teksPenutup);
    setVal('text-hormat', settings.hormat);

    // TAB 4: Foto Preview
    tempFotoCover = settings.coverFoto;
    tempFotoPria = settings.pria?.foto;
    tempFotoWanita = settings.wanita?.foto;

    setImgSrc('preview-cover-foto', tempFotoCover);
    setVal('input-url-cover', tempFotoCover);

    setImgSrc('preview-pria-foto', tempFotoPria);
    setVal('input-url-pria', tempFotoPria);

    setImgSrc('preview-wanita-foto', tempFotoWanita);
    setVal('input-url-wanita', tempFotoWanita);

    // Galeri Foto
    editingGaleriFotos = [...(settings.galeriFotos || [])];
    renderGaleriAdminGrid();

    // TAB 6: Pengaturan Musik
    setVal('setting-music-url', settings.musicUrl || 'assets/lagu.mp3');

    // Update live link preview jika nama tamu terisi
    updateLiveLinkPreview();
}

function setVal(elementId, value) {
    const el = document.getElementById(elementId);
    if (el && value !== undefined && value !== null) {
        el.value = value;
    }
}

function setImgSrc(elementId, src) {
    const el = document.getElementById(elementId);
    if (el && src) {
        el.src = src;
    }
}

// --------------------------------------------------------------------------
// 5. SIMPAN KATA-KATA (TAB 3)
// --------------------------------------------------------------------------
function simpanKataKata(event) {
    event.preventDefault();

    const countdownVal = document.getElementById('countdown-date-input').value;
    let formattedCountdown = countdownVal;
    if (countdownVal) {
        formattedCountdown = new Date(countdownVal).toISOString();
    }

    const payload = {
        subTitle: document.getElementById('text-sub-title').value.trim(),
        ayat: document.getElementById('text-ayat').value.trim(),
        surah: document.getElementById('text-surah').value.trim(),
        salamPembuka: document.getElementById('text-salam-pembuka').value.trim(),
        pria: {
            panggilan: document.getElementById('pria-panggilan').value.trim(),
            namaLengkap: document.getElementById('pria-nama-lengkap').value.trim(),
            orangTua: document.getElementById('pria-orang-tua').value.trim(),
            instagram: document.getElementById('pria-instagram').value.trim(),
            foto: tempFotoPria || currentSettings.pria?.foto
        },
        wanita: {
            panggilan: document.getElementById('wanita-panggilan').value.trim(),
            namaLengkap: document.getElementById('wanita-nama-lengkap').value.trim(),
            orangTua: document.getElementById('wanita-orang-tua').value.trim(),
            instagram: document.getElementById('wanita-instagram').value.trim(),
            foto: tempFotoWanita || currentSettings.wanita?.foto
        },
        countdownDate: formattedCountdown || currentSettings.countdownDate,
        acara1: {
            judul: document.getElementById('acara1-judul').value.trim(),
            tanggal: document.getElementById('acara1-tanggal').value.trim(),
            jam: document.getElementById('acara1-jam').value.trim(),
            lokasi: document.getElementById('acara1-lokasi').value.trim()
        },
        acara2: {
            judul: document.getElementById('acara2-judul').value.trim(),
            tanggal: document.getElementById('acara2-tanggal').value.trim(),
            jam: document.getElementById('acara2-jam').value.trim(),
            lokasi: document.getElementById('acara2-lokasi').value.trim()
        },
        acara3: {
            judul: document.getElementById('acara3-judul').value.trim(),
            tanggal: document.getElementById('acara3-tanggal').value.trim(),
            jam: document.getElementById('acara3-jam').value.trim(),
            lokasi: document.getElementById('acara3-lokasi').value.trim()
        },
        mapsUrl: document.getElementById('maps-url').value.trim(),
        mapsEmbed: document.getElementById('maps-embed').value.trim(),
        teksPenutup: document.getElementById('text-penutup').value.trim(),
        hormat: document.getElementById('text-hormat').value.trim()
    };

    WeddingSettings.save(payload).then(() => {
        showToast("Perubahan kata-kata berhasil disimpan ke website!", "success");
    }).catch(err => {
        console.error(err);
        showToast("Gagal menyimpan perubahan kata-kata.", "danger");
    });
}

// --------------------------------------------------------------------------
// 6. KELOLA FOTO & GALERI (TAB 4)
// --------------------------------------------------------------------------
async function handleUploadFotoTunggal(event, previewId, fieldKey) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        showToast("Mengompres & memproses foto...", "info");
        const base64 = await kompresGambar(file, 1200, 0.82);
        setImgSrc(previewId, base64);
        tempFotoCover = base64;
        showToast("Foto berhasil dimuat. Klik Simpan Pengaturan Foto di bawah untuk menerapkan.", "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal memproses gambar.", "danger");
    }
}

async function handleUploadFotoMempelai(event, gender) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        showToast("Mengompres foto profil...", "info");
        const base64 = await kompresGambar(file, 800, 0.85);
        if (gender === 'pria') {
            tempFotoPria = base64;
            setImgSrc('preview-pria-foto', base64);
        } else {
            tempFotoWanita = base64;
            setImgSrc('preview-wanita-foto', base64);
        }
        showToast("Foto profil diperbarui. Klik Simpan Pengaturan Foto untuk menerapkan.", "success");
    } catch (err) {
        console.error(err);
        showToast("Gagal memproses gambar.", "danger");
    }
}

function updateFotoMempelaiUrl(gender, url) {
    if (!url) return;
    if (gender === 'pria') {
        tempFotoPria = url;
        setImgSrc('preview-pria-foto', url);
    } else {
        tempFotoWanita = url;
        setImgSrc('preview-wanita-foto', url);
    }
}

function updatePreviewFoto(previewId, url, fieldKey) {
    if (!url) return;
    setImgSrc(previewId, url);
    if (fieldKey === 'coverFoto') tempFotoCover = url;
}

// Galeri Array Handlers
function renderGaleriAdminGrid() {
    const grid = document.getElementById('galeri-admin-grid');
    const badge = document.getElementById('galeri-count-badge');
    if (badge) badge.innerText = editingGaleriFotos.length;
    if (!grid) return;

    if (editingGaleriFotos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 30px;">
                Belum ada foto di galeri. Klik tombol "Tambah Foto" di atas.
            </div>
        `;
        return;
    }

    grid.innerHTML = editingGaleriFotos.map((foto, idx) => `
        <div class="gallery-admin-card">
            <img src="${foto}" alt="Foto Galeri ${idx + 1}" onerror="this.src='assets/pasangan.jpeg'">
            <button type="button" class="gallery-admin-delete" onclick="hapusFotoGaleri(${idx})" title="Hapus foto ini">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}

async function handleTambahGaleriFile(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    showToast(`Memproses ${files.length} foto galeri...`, "info");
    for (const file of files) {
        try {
            const base64 = await kompresGambar(file, 1000, 0.8);
            editingGaleriFotos.push(base64);
        } catch (e) {
            console.error("Gagal kompres foto:", e);
        }
    }
    renderGaleriAdminGrid();
    showToast(`${files.length} foto ditambahkan ke galeri. Klik Simpan Pengaturan Foto.`, "success");
    event.target.value = '';
}

function tambahGaleriDariUrl() {
    const input = document.getElementById('input-tambah-galeri-url');
    const url = input ? input.value.trim() : '';
    if (!url) {
        showToast("Masukkan URL atau path foto terlebih dahulu.", "warning");
        return;
    }
    editingGaleriFotos.push(url);
    input.value = '';
    renderGaleriAdminGrid();
    showToast("Foto ditambahkan ke galeri.", "success");
}

function hapusFotoGaleri(index) {
    if (confirm("Hapus foto ini dari galeri?")) {
        editingGaleriFotos.splice(index, 1);
        renderGaleriAdminGrid();
        showToast("Foto dihapus dari galeri.", "info");
    }
}

function resetGaleriBawaan() {
    if (confirm("Kembalikan daftar galeri ke foto-foto bawaan awal?")) {
        editingGaleriFotos = [...(DEFAULT_SETTINGS.galeriFotos || [])];
        renderGaleriAdminGrid();
        showToast("Galeri dikembalikan ke preset bawaan.", "success");
    }
}

function simpanPengaturanFoto() {
    const payload = {
        coverFoto: tempFotoCover || currentSettings.coverFoto,
        pria: {
            ...currentSettings.pria,
            foto: tempFotoPria || currentSettings.pria?.foto
        },
        wanita: {
            ...currentSettings.wanita,
            foto: tempFotoWanita || currentSettings.wanita?.foto
        },
        galeriFotos: editingGaleriFotos,
        sliderFotos: editingGaleriFotos.slice(0, 15) // Sinkronkan juga slider beranda
    };

    WeddingSettings.save(payload).then(() => {
        showToast("Pengaturan foto dan galeri berhasil disimpan!", "success");
    }).catch(err => {
        console.error(err);
        showToast("Gagal menyimpan foto.", "danger");
    });
}

// --------------------------------------------------------------------------
// 7. TUJUAN UNDANGAN (TAMU & GENERATOR LINK)
// --------------------------------------------------------------------------
function updateLiveLinkPreview() {
    const inputNama = document.getElementById('tamu-nama');
    const previewEl = document.getElementById('live-link-preview');
    if (!previewEl) return;

    const val = inputNama ? inputNama.value.trim() : '';
    if (val) {
        previewEl.innerText = getGuestLink(val);
    } else {
        previewEl.innerText = '- Ketik nama tamu di atas -';
    }
}

function salinLiveLink() {
    const inputNama = document.getElementById('tamu-nama');
    const val = inputNama ? inputNama.value.trim() : '';
    if (!val) {
        showToast("Ketik nama tamu terlebih dahulu.", "warning");
        return;
    }
    const link = getGuestLink(val);
    salinKeClipboard(link, "Tautan khusus tamu berhasil disalin!");
}

function bukaLivePreview() {
    const inputNama = document.getElementById('tamu-nama');
    const val = inputNama ? inputNama.value.trim() : '';
    if (!val) {
        showToast("Ketik nama tamu terlebih dahulu.", "warning");
        return;
    }
    window.open(getGuestLink(val), '_blank');
}

async function tambahTamu(event) {
    event.preventDefault();
    const namaInput = document.getElementById('tamu-nama');
    const kategoriInput = document.getElementById('tamu-kategori');
    const teleponInput = document.getElementById('tamu-telepon');

    const nama = namaInput ? namaInput.value.trim() : '';
    const kategori = kategoriInput ? kategoriInput.value : 'Umum';
    const telepon = teleponInput ? teleponInput.value.trim() : '';

    if (!nama) {
        showToast("Nama tamu wajib diisi.", "warning");
        return;
    }

    await TamuDB.tambah({ nama, kategori, telepon });
    showToast(`Tamu "${nama}" berhasil ditambahkan!`, "success");

    namaInput.value = '';
    if (teleponInput) teleponInput.value = '';
    updateLiveLinkPreview();
    namaInput.focus();
}

function kirimWaTamuForm() {
    const namaInput = document.getElementById('tamu-nama');
    const teleponInput = document.getElementById('tamu-telepon');
    const nama = namaInput ? namaInput.value.trim() : '';
    const telepon = teleponInput ? teleponInput.value.trim() : '';

    if (!nama) {
        showToast("Ketik nama tamu terlebih dahulu.", "warning");
        return;
    }

    const dummyTamu = { nama, telepon };
    const pesan = generateWhatsAppMessage(dummyTamu, currentSettings);
    const waUrl = generateWhatsAppUrl(telepon, pesan);
    window.open(waUrl, '_blank');
}

async function importBanyakTamu(event) {
    event.preventDefault();
    const bulkInput = document.getElementById('bulk-nama-input');
    const kategoriInput = document.getElementById('bulk-kategori');

    const text = bulkInput ? bulkInput.value : '';
    const kategori = kategoriInput ? kategoriInput.value : 'Umum';

    const baris = text.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    if (baris.length === 0) {
        showToast("Masukkan setidaknya satu nama tamu.", "warning");
        return;
    }

    await TamuDB.bulkTambah(baris, kategori);
    showToast(`Berhasil membuat link untuk ${baris.length} tamu!`, "success");
    bulkInput.value = '';
}

function onTamuLoaded(list) {
    currentGuests = list;
    const badge = document.getElementById('tamu-count-badge');
    const dashBadge = document.getElementById('dash-total-tamu');

    if (badge) badge.innerText = list.length;
    if (dashBadge) dashBadge.innerText = list.length;

    renderTabelTamu();
}

function renderTabelTamu() {
    const tbody = document.getElementById('tamu-table-body');
    if (!tbody) return;

    const query = (document.getElementById('cari-tamu')?.value || '').toLowerCase().trim();
    const kategoriFilter = document.getElementById('filter-kategori')?.value || 'Semua';

    const filtered = currentGuests.filter(t => {
        const matchNama = (t.nama || '').toLowerCase().includes(query);
        const matchKat = kategoriFilter === 'Semua' || t.kategori === kategoriFilter;
        return matchNama && matchKat;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    <i class="fa-solid fa-user-xmark" style="font-size: 1.5rem; display: block; margin-bottom: 6px; opacity: 0.5;"></i>
                    Tidak ada data tamu yang cocok.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map((tamu, idx) => {
        const link = getGuestLink(tamu.nama);
        const waMsg = generateWhatsAppMessage(tamu, currentSettings);
        const waUrl = generateWhatsAppUrl(tamu.telepon, waMsg);

        let badgeClass = 'badge-umum';
        if (tamu.kategori === 'Keluarga') badgeClass = 'badge-keluarga';
        else if (tamu.kategori === 'Sahabat') badgeClass = 'badge-sahabat';
        else if (tamu.kategori === 'Rekan Kerja') badgeClass = 'badge-kerja';
        else if (tamu.kategori === 'VIP') badgeClass = 'badge-vip';

        return `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${escapeHtml(tamu.nama)}</strong></td>
                <td><span class="badge ${badgeClass}">${escapeHtml(tamu.kategori || 'Umum')}</span></td>
                <td>${tamu.telepon ? escapeHtml(tamu.telepon) : '<span style="color:#aaa;">-</span>'}</td>
                <td>
                    <div class="guest-link-cell" title="${escapeHtml(link)}">${escapeHtml(link)}</div>
                </td>
                <td>
                    <div class="action-buttons-cell">
                        <button class="btn-icon btn-icon-copy" onclick="salinKeClipboard('${escapeHtml(link)}', 'Tautan untuk ${escapeHtml(tamu.nama)} berhasil disalin!')" title="Salin Tautan">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                        <a href="${waUrl}" target="_blank" class="btn-icon btn-icon-wa" title="Kirim via WhatsApp">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                        <a href="${link}" target="_blank" class="btn-icon btn-icon-view" title="Buka Undangan">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <button class="btn-icon btn-icon-delete" onclick="hapusTamuById('${tamu.id}', '${escapeHtml(tamu.nama)}')" title="Hapus Tamu">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function hapusTamuById(id, nama) {
    if (confirm(`Yakin ingin menghapus tamu "${nama}" dari daftar?`)) {
        await TamuDB.hapus(id);
        showToast(`Tamu "${nama}" telah dihapus.`, "info");
    }
}

function eksporTamuCSV() {
    if (currentGuests.length === 0) {
        showToast("Daftar tamu masih kosong.", "warning");
        return;
    }

    let csv = "No,Nama Tamu,Kategori,Nomor WhatsApp,Tautan Undangan Digital\n";
    currentGuests.forEach((t, i) => {
        const link = getGuestLink(t.nama);
        csv += `"${i + 1}","${(t.nama || '').replace(/"/g, '""')}","${t.kategori || 'Umum'}","${t.telepon || ''}","${link}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Daftar_Tamu_Undangan_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("File CSV daftar tamu berhasil diunduh!", "success");
}

// --------------------------------------------------------------------------
// 8. BUKU TAMU & MODERASI RSVP (TAB 5)
// --------------------------------------------------------------------------
function onUcapanLoaded(list) {
    currentUcapans = Array.isArray(list) ? list : [];

    // Hitung statistik dashboard
    let countHadir = 0;
    let countTidak = 0;
    let countRagu = 0;

    currentUcapans.forEach(item => {
        if (item.status === 'Hadir') countHadir++;
        else if (item.status === 'Tidak Hadir') countTidak++;
        else if (item.status === 'Ragu-ragu') countRagu++;
    });

    setInnerText('dash-hadir', countHadir);
    setInnerText('dash-tidak-hadir', countTidak);
    setInnerText('dash-ragu', countRagu);
    setInnerText('dash-total-ucapan', currentUcapans.length);

    renderRecentUcapanDashboard();
    renderDaftarRsvpAdmin();
}

function setInnerText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

function renderRecentUcapanDashboard() {
    const container = document.getElementById('dash-recent-ucapan');
    if (!container) return;

    if (currentUcapans.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; padding: 10px 0;">Belum ada ucapan doa dari tamu.</p>`;
        return;
    }

    const recent = currentUcapans.slice(0, 3);
    container.innerHTML = recent.map(item => `
        <div style="background: #f8fafc; border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div>
                <strong style="color: var(--primary); font-size: 0.88rem;">${escapeHtml(item.nama)}</strong>
                <span class="badge ${item.status === 'Hadir' ? 'badge-hadir' : (item.status === 'Tidak Hadir' ? 'badge-tidak' : 'badge-ragu')}" style="margin-left: 6px;">
                    ${escapeHtml(item.status || 'Hadir')}
                </span>
                <p style="font-size: 0.82rem; color: #4a5568; margin-top: 3px;">"${escapeHtml(item.pesan)}"</p>
            </div>
            <span style="font-size: 0.74rem; color: var(--text-muted); white-space: nowrap;">
                ${escapeHtml(item.tanggal || 'Baru saja')}
            </span>
        </div>
    `).join('');
}

function renderDaftarRsvpAdmin() {
    const container = document.getElementById('rsvp-admin-list');
    if (!container) return;

    const filterStatus = document.getElementById('filter-rsvp-status')?.value || 'Semua';

    const filtered = currentUcapans.filter(item => {
        if (filterStatus === 'Semua') return true;
        return item.status === filterStatus;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 35px;">
                <i class="fa-regular fa-comment-dots" style="font-size: 2rem; opacity: 0.4; margin-bottom: 8px; display: block;"></i>
                Tidak ada ucapan pada filter ini.
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        let badgeClass = 'badge-hadir';
        if (item.status === 'Tidak Hadir') badgeClass = 'badge-tidak';
        else if (item.status === 'Ragu-ragu') badgeClass = 'badge-ragu';

        return `
            <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 14px 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                        <span style="font-weight: 700; color: var(--primary); font-size: 0.92rem;">${escapeHtml(item.nama)}</span>
                        <span class="badge ${badgeClass}">${escapeHtml(item.status || 'Hadir')}</span>
                        <span style="font-size: 0.74rem; color: var(--text-muted);">
                            <i class="fa-regular fa-clock"></i> ${escapeHtml(item.tanggal || 'Baru saja')}
                        </span>
                    </div>
                    <div style="font-size: 0.85rem; color: #4a5568; line-height: 1.4; word-break: break-word;">
                        ${escapeHtml(item.pesan)}
                    </div>
                </div>
                <button type="button" class="btn-icon btn-icon-delete" onclick="hapusUcapanById('${item.id}')" title="Hapus Ucapan Ini">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

async function hapusUcapanById(id) {
    if (confirm("Yakin ingin menghapus ucapan ini dari buku tamu undangan?")) {
        try {
            await UcapanDB.hapus(id);
            showToast("Ucapan berhasil dihapus.", "success");
        } catch (e) {
            console.error(e);
            showToast("Gagal menghapus ucapan.", "danger");
        }
    }
}

// --------------------------------------------------------------------------
// 9. PENGATURAN MUSIK & BACKUP / RESTORE (TAB 6)
// --------------------------------------------------------------------------
function tesLaguPreview() {
    const url = document.getElementById('setting-music-url')?.value.trim() || 'assets/lagu.mp3';
    const icon = document.getElementById('icon-preview-lagu');

    if (!localAudioPreview) {
        localAudioPreview = new Audio(url);
    } else if (!localAudioPreview.src.includes(url)) {
        localAudioPreview.pause();
        localAudioPreview = new Audio(url);
    }

    if (localAudioPreview.paused) {
        localAudioPreview.play().then(() => {
            if (icon) icon.className = 'fa-solid fa-pause';
        }).catch(e => {
            showToast("Gagal memutar audio: format URL tidak didukung.", "danger");
        });
    } else {
        localAudioPreview.pause();
        if (icon) icon.className = 'fa-solid fa-play';
    }
}

function simpanMusik() {
    const url = document.getElementById('setting-music-url')?.value.trim();
    if (!url) {
        showToast("Masukkan URL atau path audio.", "warning");
        return;
    }
    WeddingSettings.save({ musicUrl: url }).then(() => {
        showToast("Pengaturan lagu latar berhasil disimpan!", "success");
    });
}

function eksporBackupJson() {
    const backupData = {
        app: "UndanganPernikahan",
        version: "2.0",
        exportDate: new Date().toISOString(),
        settings: currentSettings || WeddingSettings.get(),
        tamu: currentGuests || [],
        ucapan: currentUcapans || []
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Undangan_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Salinan cadangan JSON berhasil diunduh!", "success");
}

function imporBackupJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.settings && !data.tamu) {
                showToast("Format file JSON cadangan tidak valid.", "danger");
                return;
            }

            if (confirm("Pulihkan data dari cadangan ini? Pengaturan saat ini akan ditimpa.")) {
                if (data.settings) await WeddingSettings.save(data.settings);
                if (Array.isArray(data.tamu)) await TamuDB.simpanSemua(data.tamu);
                showToast("Data undangan berhasil dipulihkan dari cadangan!", "success");
                setTimeout(() => location.reload(), 800);
            }
        } catch (err) {
            console.error(err);
            showToast("Gagal membaca file JSON.", "danger");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function konfirmasiResetPabrik() {
    const pesan = "PERINGATAN!\n\nApakah Anda yakin ingin mereset seluruh kata-kata dan foto kembali ke pengaturan awal bawaan pabrik?";
    if (confirm(pesan)) {
        WeddingSettings.reset().then(() => {
            showToast("Semua pengaturan dikembalikan ke default.", "info");
            setTimeout(() => location.reload(), 600);
        });
    }
}

// --------------------------------------------------------------------------
// 10. HELPER TOAST NOTIFIKASI & CLIPBOARD
// --------------------------------------------------------------------------
function salinKeClipboard(text, customToastMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(customToastMsg || "Berhasil disalin ke clipboard!", "success");
        }).catch(() => fallbackCopy(text, customToastMsg));
    } else {
        fallbackCopy(text, customToastMsg);
    }
}

function fallbackCopy(text, customToastMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(customToastMsg || "Berhasil disalin ke clipboard!", "success");
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-circle-check';
    if (type === 'danger') icon = 'fa-circle-xmark';
    else if (type === 'info') icon = 'fa-circle-info';
    else if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="font-size: 1.1rem;"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

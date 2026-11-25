// ==========================================================================
// WEDDING DATA LAYER & CENTRAL CONFIGURATION
// Mengelola Pengaturan Website, Foto, Kata-Kata, dan Daftar Tamu Undangan
// Mendukung Firebase Realtime Database & Penyimpanan Lokal (LocalStorage)
// ==========================================================================

const DEFAULT_SETTINGS = {
    // Mempelai Pria
    pria: {
        panggilan: "Tandi",
        namaLengkap: "Tandipuang, S.T",
        orangTua: "Putra dari Pasangan Bpk. Bamba & Ibu Sarah\n(Ambe' Limbong Karaeng & Indo' Limbong Karaeng)",
        instagram: "https://www.instagram.com/tandi_puang?hvrq=MW1xMWl3Ym8wOGUwZA==",
        foto: "assets/pria.jpeg"
    },
    // Mempelai Wanita
    wanita: {
        panggilan: "Jeni",
        namaLengkap: "Jeniati, S.Pd, Gr.",
        orangTua: "Putri dari Pasangan Bpk. Alm. Benyamin & Ibu Lena\n(Alm. Papa Minggu & Mama Minggu)",
        instagram: "https://www.instagram.com/jenhy_tangkelangi?rpxt=d2gzN3ZtZmthcGk1",
        foto: "assets/wanita.jpeg"
    },
    // Cover & Salam
    subTitle: "THE WEDDING OF",
    coverFoto: "assets/pasangan.jpeg",
    ayat: "\"Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.\"",
    surah: "(Matius 19:6)",
    salamPembuka: "Atas Kasih dan Karunia Tuhan Yesus Kristus, kami bermaksud menyelenggarakan Pemberkatan Pernikahan putra-putri kami:",
    
    // Acara 1: Ibadah Persiapan
    acara1: {
        judul: "IBADAH PERSIAPAN",
        tanggal: "Kamis, 31 Desember 2026",
        jam: "Pukul 16.00 WITA - Selesai",
        lokasi: "Rumah Kediaman Mempelai Perempuan, Ka'da Male'deng Desa Orobua Kec. Sesenapadang"
    },
    // Acara 2: Pemberkatan
    acara2: {
        judul: "PEMBERKATAN PERKAWINAN",
        tanggal: "Kamis, 31 Desember 2026",
        jam: "Pukul 08.00 WITA - Selesai",
        lokasi: "Gedung Gereja Jemaat Bahtera Pongka"
    },
    // Acara 3: Resepsi
    acara3: {
        judul: "RESEPSI PERNIKAHAN",
        tanggal: "Kamis, 31 Desember 2026",
        jam: "Pukul 12.00 WITA - Selesai",
        lokasi: "Rumah Kediaman Mempelai Perempuan, Ka'da Male'deng Desa Orobua Kec. Sesenapadang"
    },
    // Countdown Target
    countdownDate: "2026-12-31T08:00:00",
    
    // Masa Berlaku & Penonaktifan Otomatis Website
    autoDeactivate: true, // Nonaktifkan otomatis saat waktu habis
    deactivateDate: "2026-12-31T23:59:59", // Batas akhir website dapat diakses (default: akhir hari H)
    isManuallyDeactivated: false, // Override manual untuk menutup website sewaktu-waktu
    deactivateTitle: "Masa Berlaku Undangan Telah Berakhir",
    deactivateMessage: "Terima kasih yang sebesar-besarnya atas segala doa restu, ucapan hangat, dan kehadiran Bapak/Ibu/Saudara/i dalam mengiringi hari bahagia kami.\n\nDemi menjaga privasi serta keamanan data pribadi keluarga dan mempelai (lokasi tempat tinggal, dokumentasi foto, dan informasi kontak), halaman undangan ini telah dinonaktifkan secara otomatis.",
    
    // Peta Lokasi
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.29658254425!2d119.82424!3d-3.04419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d93e84605995535%3A0xe510c41031cba587!2sKabupaten%20Mamasa%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1698000000000!5m2!1sid!2sid",
    mapsUrl: "https://maps.google.com",
    
    // Penutup
    teksPenutup: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
    hormat: "Tuhan Yesus Memberkati,",

    // Slider Beranda
    sliderFotos: [
        "assets/pasangan.jpeg",
        "assets/1.jpeg",
        "assets/2.jpeg",
        "assets/3.jpeg",
        "assets/4.jpeg",
        "assets/5.jpeg",
        "assets/6.jpeg",
        "assets/7.jpeg",
        "assets/8.jpeg",
        "assets/9.jpeg",
        "assets/10.jpeg",
        "assets/11.jpeg",
        "assets/12.jpeg"
    ],
    // Galeri Foto
    galeriFotos: [
        "assets/pasangan.jpeg",
        "assets/1.jpeg",
        "assets/2.jpeg",
        "assets/3.jpeg",
        "assets/4.jpeg",
        "assets/5.jpeg",
        "assets/6.jpeg",
        "assets/7.jpeg",
        "assets/8.jpeg",
        "assets/9.jpeg",
        "assets/10.jpeg",
        "assets/11.jpeg",
        "assets/12.jpeg"
    ],
    
    // Musik & Keamanan Kriptografis
    musicUrl: "assets/lagu.mp3",
    adminPin: "1234",
    // Hash SHA-256 untuk default PIN '1234' dengan salt
    adminPinHash: "b6c0331867dc75a921770355164bdce5444cbda53e63f90aaa63db49bd7ee9b1",

    // Pengaturan Tautan Undangan & URL Shortener
    shortenerService: "tinyurl", // 'tinyurl' | 'custom' | 'clean'
    invitationBaseUrl: "", // Domain / Hosting Publik (contoh: https://tandi-jeni.my.id)
    customShortUrl: "" // URL Pendek s.id / bit.ly kustom (contoh: https://s.id/tandi-jeni)
};

// --------------------------------------------------------------------------
// HELPER KRIPTOGRAFI KEAMANAN (SHA-256 DENGAN SALT)
// --------------------------------------------------------------------------
const SECURITY_SALT = "wedding_secret_salt_2026";

async function hashPin(pin) {
    if (!pin) return "";
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(SECURITY_SALT + String(pin));
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
        // Fallback hashing jika subtle crypto tidak tersedia
        let h = 0;
        const str = SECURITY_SALT + String(pin);
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(31, h) + str.charCodeAt(i) | 0;
        }
        return "fallback_" + Math.abs(h);
    }
}

// Helper deep merge
function mergeDeep(target, source) {
    if (!source || typeof source !== 'object') return target;
    const output = Object.assign({}, target);
    Object.keys(source).forEach(key => {
        if (Array.isArray(source[key])) {
            output[key] = [...source[key]];
        } else if (source[key] && typeof source[key] === 'object') {
            output[key] = mergeDeep(target[key] || {}, source[key]);
        } else if (source[key] !== undefined) {
            output[key] = source[key];
        }
    });
    return output;
}

// --------------------------------------------------------------------------
// WEDDING SETTINGS SERVICE
// --------------------------------------------------------------------------
const WeddingSettings = {
    get() {
        try {
            const raw = localStorage.getItem('wedding_settings');
            if (raw) {
                const parsed = JSON.parse(raw);
                return mergeDeep(DEFAULT_SETTINGS, parsed);
            }
        } catch (e) {
            console.error("Gagal membaca settings dari localStorage:", e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    },

    /**
     * Memeriksa apakah website undangan sudah kedaluwarsa / dinonaktifkan
     * @param {Object} [settings] Objek pengaturan (opsional)
     * @returns {{ isExpired: boolean, reason: 'manual'|'time'|'disabled'|'active', targetTime?: number, remainingMs?: number }}
     */
    checkExpiry(settings) {
        const s = settings || this.get();
        // 1. Jika dinonaktifkan secara manual oleh admin
        if (s.isManuallyDeactivated === true) {
            return { isExpired: true, reason: 'manual' };
        }
        // 2. Jika fitur auto-deactivate dimatikan
        if (s.autoDeactivate === false) {
            return { isExpired: false, reason: 'disabled' };
        }
        // 3. Periksa waktu target penonaktifan (prioritaskan deactivateDate, fallback ke countdownDate)
        const targetStr = s.deactivateDate || s.countdownDate;
        if (!targetStr) {
            return { isExpired: false, reason: 'active' };
        }
        const targetTime = new Date(targetStr).getTime();
        if (isNaN(targetTime)) {
            return { isExpired: false, reason: 'active' };
        }
        const now = Date.now();
        if (now >= targetTime) {
            return { isExpired: true, reason: 'time', targetTime: targetTime, remainingMs: 0 };
        }
        return { isExpired: false, reason: 'active', targetTime: targetTime, remainingMs: targetTime - now };
    },

    async save(newSettings) {
        if (newSettings.adminPin) {
            newSettings.adminPinHash = await hashPin(newSettings.adminPin);
        }
        const merged = mergeDeep(this.get(), newSettings);
        try {
            localStorage.setItem('wedding_settings', JSON.stringify(merged));
            window.dispatchEvent(new CustomEvent('wedding_settings_updated', { detail: merged }));
        } catch (e) {
            console.error("Gagal menyimpan ke localStorage:", e);
        }

        if (typeof db !== 'undefined' && db) {
            try {
                await db.ref('settings').set(merged);
            } catch (err) {
                console.warn("Gagal simpan settings ke Firebase:", err);
            }
        }
        return merged;
    },

    async reset() {
        localStorage.removeItem('wedding_settings');
        window.dispatchEvent(new CustomEvent('wedding_settings_updated', { detail: DEFAULT_SETTINGS }));

        if (typeof db !== 'undefined' && db) {
            try {
                await db.ref('settings').remove();
            } catch (err) {
                console.warn("Gagal mereset settings di Firebase:", err);
            }
        }
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    },

    onSettingsChange(callback) {
        // Panggil callback awal
        callback(this.get());

        // Dengarkan event local
        window.addEventListener('wedding_settings_updated', (e) => {
            callback(e.detail);
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'wedding_settings') {
                callback(this.get());
            }
        });

        // Dengarkan Firebase jika tersedia
        if (typeof db !== 'undefined' && db) {
            try {
                db.ref('settings').on('value', (snapshot) => {
                    const val = snapshot.val();
                    if (val) {
                        const merged = mergeDeep(DEFAULT_SETTINGS, val);
                        localStorage.setItem('wedding_settings', JSON.stringify(merged));
                        callback(merged);
                    }
                });
            } catch (e) {
                console.warn("Gagal listen Firebase settings:", e);
            }
        }
    }
};

// --------------------------------------------------------------------------
// TAMU UNDANGAN (GUEST LIST & LINK GENERATOR) SERVICE
// --------------------------------------------------------------------------
const TamuDB = {
    getAll() {
        try {
            const list = JSON.parse(localStorage.getItem('wedding_guests') || '[]');
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return [];
        }
    },

    async simpanSemua(list) {
        localStorage.setItem('wedding_guests', JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('wedding_guests_updated', { detail: list }));

        if (typeof db !== 'undefined' && db) {
            try {
                // Simpan daftar tamu ke Firebase
                const tamuObj = {};
                list.forEach(t => {
                    tamuObj[t.id] = t;
                });
                await db.ref('tamu').set(tamuObj);
            } catch (err) {
                console.warn("Gagal simpan tamu ke Firebase:", err);
            }
        }
        return list;
    },

    async tambah(tamuBaru) {
        const list = this.getAll();
        const item = {
            id: 'tamu_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            nama: tamuBaru.nama.trim(),
            kategori: tamuBaru.kategori || 'Umum',
            telepon: tamuBaru.telepon ? tamuBaru.telepon.replace(/\D/g, '') : '',
            shortUrl: tamuBaru.shortUrl || '',
            status: tamuBaru.status || 'Belum Terkirim',
            createdAt: Date.now()
        };
        list.unshift(item);
        await this.simpanSemua(list);
        return item;
    },

    async perbaruiShortUrl(id, shortUrl) {
        const list = this.getAll();
        const target = list.find(t => t.id === id);
        if (target) {
            target.shortUrl = shortUrl;
            await this.simpanSemua(list);
        }
        return target;
    },

    async bulkTambah(namaArray, kategori = 'Umum') {
        const list = this.getAll();
        const items = [];
        namaArray.forEach(rawNama => {
            const trimmed = rawNama.trim();
            if (trimmed) {
                const item = {
                    id: 'tamu_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + items.length,
                    nama: trimmed,
                    kategori: kategori,
                    telepon: '',
                    shortUrl: '',
                    status: 'Belum Terkirim',
                    createdAt: Date.now()
                };
                items.push(item);
                list.unshift(item);
            }
        });
        await this.simpanSemua(list);
        return items;
    },

    async hapus(id) {
        const list = this.getAll().filter(t => t.id !== id);
        await this.simpanSemua(list);
        if (typeof db !== 'undefined' && db) {
            try {
                await db.ref('tamu/' + id).remove();
            } catch (e) {}
        }
        return list;
    },

    async updateStatus(id, statusBaru) {
        const list = this.getAll();
        const target = list.find(t => t.id === id);
        if (target) {
            target.status = statusBaru;
            await this.simpanSemua(list);
        }
    },

    onTamuChange(callback) {
        callback(this.getAll());

        window.addEventListener('wedding_guests_updated', (e) => {
            callback(e.detail);
        });

        window.addEventListener('storage', (e) => {
            if (e.key === 'wedding_guests') {
                callback(this.getAll());
            }
        });

        if (typeof db !== 'undefined' && db) {
            try {
                db.ref('tamu').on('value', (snapshot) => {
                    const val = snapshot.val();
                    if (val) {
                        const list = Object.values(val);
                        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                        localStorage.setItem('wedding_guests', JSON.stringify(list));
                        callback(list);
                    }
                });
            } catch (e) {
                console.warn("Gagal listen Firebase tamu:", e);
            }
        }
    }
};

// --------------------------------------------------------------------------
// URL SHORTENER SERVICE & HELPER GENERATOR TAUTAN
// --------------------------------------------------------------------------
const ShortenerService = {
    /**
     * Memendekkan tautan panjang via API publik (spoo.me / TinyURL)
     * @param {string} longUrl URL panjang
     * @returns {Promise<string>} URL pendek
     */
    async shorten(longUrl) {
        if (!longUrl || typeof longUrl !== 'string') return '';
        const trimmed = longUrl.trim();

        // Jika sudah link pendek, kembalikan langsung
        if (/^https?:\/\/(tinyurl\.com|s\.id|bit\.ly|spoo\.me|t\.ly)\//i.test(trimmed)) {
            return trimmed;
        }

        // 1. Coba spoo.me (mendukung open CORS untuk fetch browser)
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch('https://spoo.me/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `url=${encodeURIComponent(trimmed)}`,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const data = await res.json();
                if (data && data.short_url) {
                    return data.short_url.replace(/^http:\/\//i, 'https://');
                }
            }
        } catch (e) {}

        // 2. Coba TinyURL API publik
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(trimmed)}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const text = await res.text();
                if (text && text.trim().startsWith('http')) {
                    return text.trim();
                }
            }
        } catch (e) {}

        // Fallback: kembalikan URL asli jika offline / dibatasi
        return trimmed;
    }
};

function getBaseInvitationUrl(settings = null) {
    const s = settings || (typeof WeddingSettings !== 'undefined' ? WeddingSettings.get() : null);

    // 1. Jika pengguna telah menentukan URL / domain publik (misal: https://tandi-jeni.my.id)
    if (s && s.invitationBaseUrl && s.invitationBaseUrl.trim()) {
        let customBase = s.invitationBaseUrl.trim();
        customBase = customBase.replace(/\/index\.html\/?$/i, '').replace(/\/+$/, '');
        return customBase;
    }

    // 2. Deteksi otomatis dari browser saat ini
    const path = window.location.pathname;
    let base = window.location.origin + path;
    if (base.endsWith('admin.html')) {
        base = base.replace(/admin\.html$/, '');
    } else if (base.endsWith('index.html')) {
        base = base.replace(/index\.html$/, '');
    }
    // Hapus trailing slash agar bersih
    return base.replace(/\/+$/, '');
}

function getGuestLink(nama, tamuObj = null, settings = null) {
    const s = settings || (typeof WeddingSettings !== 'undefined' ? WeddingSettings.get() : null);

    // 1. Jika tamu sudah memiliki link pendek yang tersimpan, gunakan itu
    if (tamuObj && tamuObj.shortUrl) {
        return tamuObj.shortUrl;
    }

    const trimmedNama = (nama || '').trim();

    // 2. Jika mode custom shortener aktif (misal s.id / bit.ly)
    if (s && s.shortenerService === 'custom' && s.customShortUrl && s.customShortUrl.trim()) {
        const shortBase = s.customShortUrl.trim().replace(/\/+$/, '');
        if (trimmedNama) {
            return `${shortBase}?to=${encodeURIComponent(trimmedNama)}`;
        }
        return shortBase;
    }

    // 3. Tautan langsung bersih (Clean URL tanpa file /index.html)
    const base = getBaseInvitationUrl(s);
    if (!trimmedNama) {
        return base || window.location.origin;
    }
    return `${base}/?to=${encodeURIComponent(trimmedNama)}`;
}

function generateWhatsAppMessage(tamu, settings = null) {
    const s = settings || WeddingSettings.get();
    const pria = s.pria.panggilan || "Tandi";
    const wanita = s.wanita.panggilan || "Jeni";
    const guestName = tamu ? tamu.nama : '';
    // Gunakan link pendek jika ada, atau panggil getGuestLink
    const link = (tamu && tamu.shortUrl) ? tamu.shortUrl : getGuestLink(guestName, tamu, s);

    return `Kepada Yth. Bapak/Ibu/Saudara/i ${guestName},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:

💍 The Wedding of ${pria} & ${wanita} 💍

Untuk rincian acara, jadwal, lokasi, serta konfirmasi kehadiran (RSVP), silakan akses tautan undangan digital berikut:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kami.

Terima kasih atas perhatian dan doa restunya.
Tuhan Memberkati.

Salam hangat,
${pria} & ${wanita}`;
}

function generateWhatsAppUrl(telepon, pesan) {
    let phone = (telepon || '').replace(/\D/g, '');
    if (phone.startsWith('0')) {
        phone = '62' + phone.slice(1);
    }
    const encoded = encodeURIComponent(pesan);
    if (phone) {
        return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
    }
    return `https://api.whatsapp.com/send?text=${encoded}`;
}

// --------------------------------------------------------------------------
// HELPER KOMPRESI GAMBAR (CANVAS RESIZER BASE64)
// --------------------------------------------------------------------------
function kompresGambar(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error("File bukan gambar"));
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => reject(new Error("Gagal membaca elemen gambar"));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error("Gagal membaca file"));
        reader.readAsDataURL(file);
    });
}

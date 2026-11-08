// ==========================================================================
// PENGATURAN GLOBAL & INISIALISASI
// ==========================================================================
let slideIntervalId = null;
let countdownIntervalId = null;
let activeWeddingDate = new Date("Dec 31, 2026 08:00:00").getTime();

document.addEventListener("DOMContentLoaded", function () {
    // 1. Ambil nama dari parameter URL (?to=Nama)
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');
    const elemenNama = document.getElementById('nama-tamu');

    if (namaTamu && elemenNama) {
        elemenNama.innerText = decodeURIComponent(namaTamu);
    }

    // 2. Animasi Pergerakan Muncul Per Baris (Reveal Text on Scroll)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach(el => observer.observe(el));

    // 3. Inisialisasi Slideshow Foto Utama
    initSlideshow();

    // 4. Inisialisasi Countdown Timer Aktif
    initCountdown();

    // 5. Smooth Scroll untuk Menu Navigasi Bawah
    document.querySelectorAll('.bottom-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 6. Inisialisasi Lightbox Galeri dengan Navigasi Next/Prev & Swipe
    initLightbox();

    // 7. Dengarkan Pengaturan Dinamis dari Admin (LocalStorage & Firebase)
    if (typeof WeddingSettings !== 'undefined') {
        WeddingSettings.onSettingsChange(terapkanPengaturanUndangan);
    }

    // 8. Inisialisasi Realtime Database Ucapan & RSVP
    if (typeof UcapanDB !== 'undefined') {
        UcapanDB.onUcapanChange(renderDaftarUcapan);
    }
});

// --------------------------------------------------------------------------
// SLIDESHOW FOTO UTAMA
// --------------------------------------------------------------------------
function initSlideshow() {
    if (slideIntervalId) clearInterval(slideIntervalId);
    let currentSlide = 0;
    const slides = document.querySelectorAll('.foto-slider');
    if (slides.length > 0) {
        slides.forEach((s, idx) => {
            if (idx === 0) s.classList.add('active');
            else s.classList.remove('active');
        });
        slideIntervalId = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3500);
    }
}

// --------------------------------------------------------------------------
// COUNTDOWN TIMER
// --------------------------------------------------------------------------
function initCountdown(targetDateStr) {
    if (targetDateStr) {
        const parsed = new Date(targetDateStr).getTime();
        if (!isNaN(parsed)) {
            activeWeddingDate = parsed;
        }
    }
    if (countdownIntervalId) clearInterval(countdownIntervalId);

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = activeWeddingDate - now;

        const elDays = document.getElementById('days');
        const elHours = document.getElementById('hours');
        const elMinutes = document.getElementById('minutes');
        const elSeconds = document.getElementById('seconds');

        if (distance < 0) {
            if (elDays) elDays.innerText = '0';
            if (elHours) elHours.innerText = '0';
            if (elMinutes) elMinutes.innerText = '0';
            if (elSeconds) elSeconds.innerText = '0';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elDays) elDays.innerText = days;
        if (elHours) elHours.innerText = hours;
        if (elMinutes) elMinutes.innerText = minutes;
        if (elSeconds) elSeconds.innerText = seconds;
    };

    updateTimer();
    countdownIntervalId = setInterval(updateTimer, 1000);
}

// --------------------------------------------------------------------------
// LIGHTBOX GALERI DENGAN NAVIGASI
// --------------------------------------------------------------------------
function initLightbox() {
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const galleryImages = document.querySelectorAll(".galeri-item img");
    let currentIndex = 0;

    function showImage(index) {
        if (index < 0) {
            currentIndex = galleryImages.length - 1;
        } else if (index >= galleryImages.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        if (modalImg && galleryImages[currentIndex]) {
            modalImg.src = galleryImages[currentIndex].src;
        }
    }

    if (modal && galleryImages.length > 0) {
        galleryImages.forEach((img, index) => {
            img.onclick = function (e) {
                e.stopPropagation();
                modal.style.display = "flex";
                showImage(index);
            };
        });

        if (nextBtn) {
            nextBtn.onclick = function (e) {
                e.stopPropagation();
                showImage(currentIndex + 1);
            };
        }

        if (prevBtn) {
            prevBtn.onclick = function (e) {
                e.stopPropagation();
                showImage(currentIndex - 1);
            };
        }

        if (closeBtn) {
            closeBtn.onclick = function (e) {
                e.stopPropagation();
                modal.style.display = "none";
            };
        }

        modal.onclick = function (e) {
            if (e.target !== modalImg && e.target !== nextBtn && e.target !== prevBtn) {
                modal.style.display = "none";
            }
        };

        // Navigasi Keyboard (PC)
        document.onkeydown = function (e) {
            if (modal.style.display === "flex") {
                if (e.key === "ArrowRight") showImage(currentIndex + 1);
                if (e.key === "ArrowLeft") showImage(currentIndex - 1);
                if (e.key === "Escape") modal.style.display = "none";
            }
        };

        // Fitur Swipe Layar (Handphone)
        let touchStartX = 0;
        let touchEndX = 0;

        modal.ontouchstart = function (e) {
            touchStartX = e.changedTouches[0].screenX;
        };

        modal.ontouchend = function (e) {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) {
                showImage(currentIndex + 1); // Geser ke kiri (Next)
            }
            if (touchEndX > touchStartX + 50) {
                showImage(currentIndex - 1); // Geser ke kanan (Prev)
            }
        };
    }
}

// --------------------------------------------------------------------------
// PENERAPAN PENGATURAN DINAMIS (KATA-KATA, FOTO, TANGGAL, DLL)
// --------------------------------------------------------------------------
function terapkanPengaturanUndangan(s) {
    if (!s) return;

    // Sub-title & Title
    if (s.subTitle) {
        document.querySelectorAll('.sub-title, .sub-wedding').forEach(el => el.innerText = s.subTitle);
    }

    // Nama Panggilan Mempelai
    const priaPanggilan = s.pria?.panggilan || 'Tandi';
    const wanitaPanggilan = s.wanita?.panggilan || 'Jeni';

    document.querySelectorAll('.cover-nama-kiri, .nama-kiri').forEach(el => el.innerText = priaPanggilan);
    document.querySelectorAll('.cover-nama-kanan, .nama-kanan').forEach(el => el.innerText = wanitaPanggilan);

    // Hero Cover Foto
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && s.coverFoto) {
        heroContent.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('${s.coverFoto}')`;
    }

    // Countdown Date
    if (s.countdownDate) {
        initCountdown(s.countdownDate);
    }

    // Ayat & Salam Pembuka
    const elAyat = document.querySelector('.salam .ayat');
    if (elAyat && s.ayat) elAyat.innerText = s.ayat;

    const elSurah = document.querySelector('.salam .surah');
    if (elSurah && s.surah) elSurah.innerText = s.surah;

    const elSalamTeks = document.querySelector('.salam .salam-teks');
    if (elSalamTeks && s.salamPembuka) elSalamTeks.innerText = s.salamPembuka;

    // Mempelai Pria & Wanita
    const mempelaiRows = document.querySelectorAll('.mempelai-row');
    if (mempelaiRows.length >= 2) {
        // Pria (Row 1)
        const rowPria = mempelaiRows[0];
        const imgPria = rowPria.querySelector('.foto-mempelai-bulat');
        const namaPria = rowPria.querySelector('.nama-panggilan');
        const ortuPria = rowPria.querySelector('.orangtua');
        const igPria = rowPria.querySelector('.btn-ig');

        if (imgPria && s.pria?.foto) imgPria.src = s.pria.foto;
        if (namaPria && s.pria?.namaLengkap) namaPria.innerText = s.pria.namaLengkap;
        if (ortuPria && s.pria?.orangTua) ortuPria.innerHTML = s.pria.orangTua.replace(/\n/g, '<br>');
        if (igPria && s.pria?.instagram) igPria.href = s.pria.instagram;

        // Wanita (Row 2)
        const rowWanita = mempelaiRows[1];
        const imgWanita = rowWanita.querySelector('.foto-mempelai-bulat');
        const namaWanita = rowWanita.querySelector('.nama-panggilan');
        const ortuWanita = rowWanita.querySelector('.orangtua');
        const igWanita = rowWanita.querySelector('.btn-ig');

        if (imgWanita && s.wanita?.foto) imgWanita.src = s.wanita.foto;
        if (namaWanita && s.wanita?.namaLengkap) namaWanita.innerText = s.wanita.namaLengkap;
        if (ortuWanita && s.wanita?.orangTua) ortuWanita.innerHTML = s.wanita.orangTua.replace(/\n/g, '<br>');
        if (igWanita && s.wanita?.instagram) igWanita.href = s.wanita.instagram;
    }

    // Rangkaian Acara
    const acaraCards = document.querySelectorAll('.card-acara');
    const acaraList = [s.acara1, s.acara2, s.acara3];
    acaraCards.forEach((card, idx) => {
        const data = acaraList[idx];
        if (data) {
            const h3 = card.querySelector('h3');
            if (h3 && data.judul) h3.innerText = data.judul;

            const pList = card.querySelectorAll('p');
            if (pList.length >= 3) {
                if (data.tanggal) pList[0].innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${data.tanggal}`;
                if (data.jam) pList[1].innerHTML = `<i class="fa-solid fa-clock"></i> ${data.jam}`;
                if (data.lokasi) pList[2].innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.lokasi}`;
            }
        }
    });

    // Maps
    const mapsIframe = document.querySelector('.map-embed-container iframe');
    if (mapsIframe && s.mapsEmbed) mapsIframe.src = s.mapsEmbed;

    const btnMaps = document.querySelector('.btn-maps');
    if (btnMaps && s.mapsUrl) btnMaps.href = s.mapsUrl;

    // Slider Beranda
    if (Array.isArray(s.sliderFotos) && s.sliderFotos.length > 0) {
        const frameSlider = document.querySelector('.frame-foto-utama');
        if (frameSlider) {
            const currentImgSrcs = Array.from(frameSlider.querySelectorAll('img')).map(img => img.getAttribute('src'));
            const isDifferent = currentImgSrcs.length !== s.sliderFotos.length || 
                                currentImgSrcs.some((src, i) => src !== s.sliderFotos[i]);
            
            if (isDifferent) {
                frameSlider.innerHTML = s.sliderFotos.map((foto, idx) => 
                    `<img src="${foto}" alt="Foto ${idx + 1}" class="foto-slider ${idx === 0 ? 'active' : ''}">`
                ).join('');
                initSlideshow();
            }
        }
    }

    // Galeri Foto
    if (Array.isArray(s.galeriFotos) && s.galeriFotos.length > 0) {
        const galeriGrid = document.querySelector('.galeri-grid');
        if (galeriGrid) {
            const currentGalSrcs = Array.from(galeriGrid.querySelectorAll('img')).map(img => img.getAttribute('src'));
            const isDifferent = currentGalSrcs.length !== s.galeriFotos.length ||
                                currentGalSrcs.some((src, i) => src !== s.galeriFotos[i]);
            if (isDifferent) {
                galeriGrid.innerHTML = s.galeriFotos.map((foto, idx) => 
                    `<div class="galeri-item"><img src="${foto}" alt="Galeri ${idx + 1}"></div>`
                ).join('');
                initLightbox();
            }
        }
    }

    // Penutup
    const elPenutupSalam = document.querySelector('.penutup .salam-teks');
    if (elPenutupSalam && s.teksPenutup) elPenutupSalam.innerText = s.teksPenutup;

    const elPenutupHormat = document.querySelector('.penutup .hormat');
    if (elPenutupHormat && s.hormat) elPenutupHormat.innerText = s.hormat;

    // Musik Latar
    if (s.musicUrl && typeof backgroundMusic !== 'undefined') {
        if (!backgroundMusic.src.includes(s.musicUrl)) {
            const wasPlaying = isPlaying;
            backgroundMusic.src = s.musicUrl;
            if (wasPlaying) backgroundMusic.play().catch(e => console.log(e));
        }
    }
}

// --------------------------------------------------------------------------
// FUNGSI UNTUK MEMBUKA UNDANGAN
// --------------------------------------------------------------------------
function bukaUndangan() {
    const heroCover = document.querySelector('.hero');
    
    if (heroCover) {
        heroCover.style.opacity = '0';
        heroCover.style.visibility = 'hidden';
        
        setTimeout(() => {
            heroCover.style.display = 'none';
        }, 800);
    }

    playMusic();
}

// --------------------------------------------------------------------------
// PENGATURAN MUSIK & AUDIO LATAR
// --------------------------------------------------------------------------
let backgroundMusic = new Audio('assets/lagu.mp3');
backgroundMusic.loop = true;
let isPlaying = false;

function toggleMusic() {
    let musicIcon = document.getElementById('music-icon');
    
    if (isPlaying) {
        backgroundMusic.pause();
        if (musicIcon) {
            musicIcon.classList.remove('fa-compact-disc', 'fa-spin');
            musicIcon.classList.add('fa-music');
        }
        isPlaying = false;
    } else {
        backgroundMusic.play().then(() => {
            if (musicIcon) {
                musicIcon.classList.remove('fa-music');
                musicIcon.classList.add('fa-compact-disc', 'fa-spin');
            }
            isPlaying = true;
        }).catch(e => console.log("Audio play error: ", e));
    }
}

function playMusic() {
    backgroundMusic.play().then(() => {
        isPlaying = true;
        let musicIcon = document.getElementById('music-icon');
        if (musicIcon) {
            musicIcon.classList.remove('fa-music');
            musicIcon.classList.add('fa-compact-disc', 'fa-spin');
        }
    }).catch(e => {
        console.log("Autoplay dicegah oleh browser, menunggu interaksi tambahan.", e);
    });
}

// --------------------------------------------------------------------------
// TOMBOL AUTO-SCROLL
// --------------------------------------------------------------------------
let isAutoScrolling = false;
let scrollAnimFrame = null;
let lastTimestamp = null;
const SCROLL_SPEED = 50;
let subPixelY = 0;

function autoScrollStep(timestamp) {
    if (!isAutoScrolling) return;

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (deltaTime > 0 && deltaTime < 0.1) {
        subPixelY += SCROLL_SPEED * deltaTime;
        if (subPixelY >= 1) {
            const movePixels = Math.floor(subPixelY);
            window.scrollBy(0, movePixels);
            subPixelY -= movePixels;
        }
    }

    const maxScroll = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    ) - window.innerHeight;

    if (window.scrollY >= maxScroll - 3) {
        stopAutoScroll();
        return;
    }

    scrollAnimFrame = requestAnimationFrame(autoScrollStep);
}

function toggleAutoScroll() {
    let scrollIcon = document.getElementById('scroll-icon');
    
    if (!isAutoScrolling) {
        isAutoScrolling = true;
        lastTimestamp = null;
        subPixelY = 0;

        if (scrollIcon) {
            scrollIcon.classList.remove('fa-arrow-down');
            scrollIcon.classList.add('fa-pause');
        }
        
        scrollAnimFrame = requestAnimationFrame(autoScrollStep);
    } else {
        stopAutoScroll();
    }
}

function stopAutoScroll() {
    if (!isAutoScrolling && !scrollAnimFrame) return;
    isAutoScrolling = false;
    
    if (scrollAnimFrame) {
        cancelAnimationFrame(scrollAnimFrame);
        scrollAnimFrame = null;
    }
    
    lastTimestamp = null;
    let scrollIcon = document.getElementById('scroll-icon');
    if (scrollIcon) {
        scrollIcon.classList.remove('fa-pause');
        scrollIcon.classList.add('fa-arrow-down');
    }
}

window.addEventListener('wheel', () => {
    if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

window.addEventListener('touchstart', () => {
    if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

// --------------------------------------------------------------------------
// FUNGSI DATABASE RSVP & BUKU TAMU UCAPAN
// --------------------------------------------------------------------------
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatWaktu(timestamp) {
    if (!timestamp) return 'Baru saja';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Baru saja';

    const sekarang = Date.now();
    const selisihDetik = Math.floor((sekarang - date.getTime()) / 1000);

    if (selisihDetik < 60) return 'Baru saja';
    if (selisihDetik < 3600) return `${Math.floor(selisihDetik / 60)} menit yang lalu`;
    if (selisihDetik < 86400) return `${Math.floor(selisihDetik / 3600)} jam yang lalu`;

    const opsi = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', opsi);
}

function renderDaftarUcapan(data) {
    const daftarUcapanBox = document.getElementById('daftar-ucapan');
    if (!daftarUcapanBox) return;

    const list = Array.isArray(data) ? data : [];

    let countHadir = 0;
    let countTidak = 0;
    let countRagu = 0;

    list.forEach(item => {
        if (item.status === 'Hadir') countHadir++;
        else if (item.status === 'Tidak Hadir') countTidak++;
        else if (item.status === 'Ragu-ragu') countRagu++;
    });

    const elTotal = document.getElementById('jumlah-ucapan');
    const elHadir = document.getElementById('stat-hadir');
    const elTidak = document.getElementById('stat-tidak');
    const elRagu = document.getElementById('stat-ragu');

    if (elTotal) elTotal.innerText = list.length;
    if (elHadir) elHadir.innerText = countHadir;
    if (elTidak) elTidak.innerText = countTidak;
    if (elRagu) elRagu.innerText = countRagu;

    if (list.length === 0) {
        daftarUcapanBox.innerHTML = `
            <div style="text-align: center; color: #888; font-size: 0.82rem; padding: 25px 10px;">
                <i class="fa-regular fa-comment-dots" style="font-size: 1.5rem; color: #c2d6cb; margin-bottom: 8px; display: block;"></i>
                Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
            </div>
        `;
        return;
    }

    daftarUcapanBox.innerHTML = list.map(item => {
        const initial = (item.nama || 'T').trim().charAt(0).toUpperCase();
        let badgeClass = 'hadir';
        let badgeIcon = 'fa-check';

        if (item.status === 'Tidak Hadir') {
            badgeClass = 'tidak-hadir';
            badgeIcon = 'fa-xmark';
        } else if (item.status === 'Ragu-ragu') {
            badgeClass = 'ragu-ragu';
            badgeIcon = 'fa-question';
        }

        const waktuStr = item.tanggal || formatWaktu(item.timestamp);

        return `
            <div class="ucapan-item">
                <div class="ucapan-header">
                    <div class="ucapan-user">
                        <div class="ucapan-avatar">${initial}</div>
                        <span class="ucapan-nama">${escapeHtml(item.nama)}</span>
                    </div>
                    <span class="ucapan-badge ${badgeClass}">
                        <i class="fa-solid ${badgeIcon}"></i> ${escapeHtml(item.status || 'Hadir')}
                    </span>
                </div>
                <div class="ucapan-pesan">${escapeHtml(item.pesan)}</div>
                <div class="ucapan-waktu">
                    <i class="fa-regular fa-clock"></i> ${escapeHtml(waktuStr)}
                </div>
            </div>
        `;
    }).join('');
}

async function kirimUcapan(event) {
    event.preventDefault();

    const form = document.getElementById('rsvp-form');
    const btnKirim = form ? form.querySelector('button[type="submit"]') : null;
    const namaInput = document.getElementById('nama');
    const statusInput = document.getElementById('status');
    const pesanInput = document.getElementById('pesan');

    const nama = namaInput ? namaInput.value.trim() : '';
    const status = statusInput ? statusInput.value : 'Hadir';
    const pesan = pesanInput ? pesanInput.value.trim() : '';

    if (!nama || !pesan) {
        alert('Mohon lengkapi nama dan ucapan Anda.');
        return;
    }

    let originalBtnText = 'Kirim Ucapan';
    if (btnKirim) {
        originalBtnText = btnKirim.innerHTML;
        btnKirim.disabled = true;
        btnKirim.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    }

    try {
        const payload = {
            nama: nama,
            status: status,
            pesan: pesan,
            tanggal: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        if (typeof UcapanDB !== 'undefined') {
            await UcapanDB.simpan(payload);
        } else {
            console.warn("UcapanDB tidak ditemukan!");
        }

        form.reset();
        alert('Konfirmasi kehadiran dan ucapan berhasil dikirim. Terima kasih banyak atas doa restu Anda!');
    } catch (error) {
        console.error('Error saat mengirim ucapan:', error);
        alert('Maaf, terjadi kendala saat mengirim ucapan. Silakan coba lagi.');
    } finally {
        if (btnKirim) {
            btnKirim.disabled = false;
            btnKirim.innerHTML = originalBtnText;
        }
    }
}

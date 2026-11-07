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
    let currentSlide = 0;
    const slides = document.querySelectorAll('.foto-slider');
    if (slides.length > 0) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3500);
    }

    // 4. Inisialisasi Countdown Timer Aktif
    const weddingDate = new Date("Dec 31, 2026 08:00:00").getTime();

    const timerInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const elDays = document.getElementById('days');
        const elHours = document.getElementById('hours');
        const elMinutes = document.getElementById('minutes');
        const elSeconds = document.getElementById('seconds');

        if (elDays) elDays.innerText = days;
        if (elHours) elHours.innerText = hours;
        if (elMinutes) elMinutes.innerText = minutes;
        if (elSeconds) elSeconds.innerText = seconds;
    }, 1000);

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
            img.addEventListener("click", function (e) {
                e.stopPropagation();
                modal.style.display = "flex";
                showImage(index);
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                showImage(currentIndex + 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                showImage(currentIndex - 1);
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                modal.style.display = "none";
            });
        }

        modal.addEventListener("click", function (e) {
            if (e.target !== modalImg && e.target !== nextBtn && e.target !== prevBtn) {
                modal.style.display = "none";
            }
        });

        // Navigasi Keyboard (PC)
        document.addEventListener("keydown", function (e) {
            if (modal.style.display === "flex") {
                if (e.key === "ArrowRight") showImage(currentIndex + 1);
                if (e.key === "ArrowLeft") showImage(currentIndex - 1);
                if (e.key === "Escape") modal.style.display = "none";
            }
        });

        // Fitur Swipe Layar (Handphone)
        let touchStartX = 0;
        let touchEndX = 0;

        modal.addEventListener("touchstart", function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener("touchend", function (e) {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) {
                showImage(currentIndex + 1); // Geser ke kiri (Next)
            }
            if (touchEndX > touchStartX + 50) {
                showImage(currentIndex - 1); // Geser ke kanan (Prev)
            }
        }, { passive: true });
    }

    // Inisialisasi Realtime Database Ucapan & RSVP
    if (typeof UcapanDB !== 'undefined') {
        UcapanDB.onUcapanChange(renderDaftarUcapan);
    }
});

// 7. Fungsi untuk Membuka Undangan (Fade Out Lembut)
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

// 8. Pengaturan Musik & Audio Latar
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

// 9. Fungsi Tombol Auto-Scroll
let isAutoScrolling = false;
let scrollInterval;

function toggleAutoScroll() {
    let scrollIcon = document.getElementById('scroll-icon');
    
    if (!isAutoScrolling) {
        isAutoScrolling = true;
        if (scrollIcon) {
            scrollIcon.classList.remove('fa-arrow-down');
            scrollIcon.classList.add('fa-pause');
        }
        
        scrollInterval = setInterval(() => {
            window.scrollBy({ top: 3, behavior: 'smooth' });

            const revealElements = document.querySelectorAll('.reveal-text');
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.95) {
                    el.classList.add('active');
                }
            });

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
                stopAutoScroll();
            }
        }, 20);
    } else {
        stopAutoScroll();
    }
}

function stopAutoScroll() {
    isAutoScrolling = false;
    clearInterval(scrollInterval);
    let scrollIcon = document.getElementById('scroll-icon');
    if (scrollIcon) {
        scrollIcon.classList.remove('fa-pause');
        scrollIcon.classList.add('fa-arrow-down');
    }
}

// ==========================================================================
// 10. FUNGSI DATABASE RSVP & BUKU TAMU UCAPAN
// ==========================================================================

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

    // Hitung statistik
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

    // Render list
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

    // Ubah status tombol jadi memproses
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

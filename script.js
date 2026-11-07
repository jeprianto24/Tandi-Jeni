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

        const elDays = document.getElementById('days') || document.getElementById('day');
        const elHours = document.getElementById('hours') || document.getElementById('hour');
        const elMinutes = document.getElementById('minutes') || document.getElementById('minute');
        const elSeconds = document.getElementById('seconds') || document.getElementById('second');

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
});

// 6. Fungsi untuk Membuka Undangan (Fade Out Lembut)
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

// 7. Pengaturan Musik & Audio Latar
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

// 8. Fungsi Tombol Auto-Scroll
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

// 9. Fungsi Kirim RSVP & Buku Tamu
function kirimUcapan(event) {
    event.preventDefault();
    
    const namaInput = document.getElementById('nama').value;
    const statusInput = document.getElementById('status').value;
    const pesanInput = document.getElementById('pesan').value;
    
    const daftarUcapanBox = document.getElementById('daftar-ucapan');
    
    if (daftarUcapanBox.querySelector('p') && daftarUcapanBox.querySelector('p').innerText.includes('Belum ada ucapan')) {
        daftarUcapanBox.innerHTML = '';
    }
    
    const itemBaru = document.createElement('div');
    itemBaru.style.cssText = "padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 8px; text-align: left;";
    itemBaru.innerHTML = `<strong>${namaInput}</strong> <span style="font-size: 0.75rem; color: #2e7d32; font-weight: bold;">(${statusInput})</span><p style="font-size: 0.8rem; color: #555; margin-top: 4px;">${pesanItem}</p>`;
    
    daftarUcapanBox.prepend(itemBaru);
    
    const jumlahUcapanEl = document.getElementById('jumlah-ucapan');
    let currentTotal = parseInt(jumlahUcapanEl.innerText) || 0;
    jumlahUcapanEl.innerText = currentTotal + 1;
    
    if (statusInput === 'Hadir') {
        let statHadir = document.getElementById('stat-hadir');
        statHadir.innerText = parseInt(statHadir.innerText) + 1;
    } else if (statusInput === 'Tidak Hadir') {
        let statTidak = document.getElementById('stat-tidak');
        statTidak.innerText = parseInt(statTidak.innerText) + 1;
    } else if (statusInput === 'Ragu-ragu') {
        let statRagu = document.getElementById('stat-ragu');
        statRagu.innerText = parseInt(statRagu.innerText) + 1;
    }
    
    document.getElementById('rsvp-form').reset();
    alert('Konfirmasi kehadiran dan ucapan berhasil dikirim. Terima kasih!');
}
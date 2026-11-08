# Panduan Keamanan & Akses Terselubung Panel Admin

Dokumen ini menjelaskan sistem penyamaran (*stealth access*) dan langkah-langkah keamanan yang telah diterapkan untuk melindungi Panel Admin dari akses publik dan risiko peretasan.

---

## 🕵️‍♂️ 1. Cara Akses Terselubung (Hanya Diketahui Pengelola)

Tombol publik "Kelola Undangan" telah **dihilangkan sepenuhnya** dari halaman utama sehingga tamu biasa tidak akan tahu ada panel admin.

Untuk membuka Panel Admin, gunakan salah satu metode rahasia berikut:

### Metode A (Paling Praktis di HP/Smartphone)
- Buka halaman undangan [index.html](index.html).
- **Ketuk (tap) 5 kali secara cepat** pada simbol **`&`** (bisa di bagian judul sampul depan, foto profil, atau penutup).
- Sistem akan otomatis mengarahkan Anda ke Panel Admin.

### Metode B (Shortcut Keyboard di Laptop/PC)
- Pada halaman undangan atau halaman mana saja, tekan kombinasi tombol:
  **`Ctrl + Shift + A`** (atau `Cmd + Shift + A` di Mac).

### Metode C (URL Rahasia Langsung)
- Buka alamat URL dengan menambahkan parameter rahasia:
  `.../admin.html?portal=secret`
  *(Begitu terbuka, sistem akan otomatis membersihkan teks `?portal=secret` dari bilah alamat browser agar tidak tersimpan di riwayat browsing)*.

---

## 🛡️ 2. Penyamaran Layar 404 (*Honeypot Stealth Cloak*)

Jika ada orang asing atau bot yang menebak dan mengetikkan alamat `admin.html` secara langsung tanpa parameter rahasia:
- Mereka **TIDAK AKAN** melihat formulir login ataupun PIN.
- Mereka akan melihat halaman **"404 - Halaman Tidak Ditemukan"** yang tampak seperti halaman error biasa.
- **Pintu Rahasia untuk Admin:** Jika Anda berada di halaman 404 ini, Anda dapat **mengetuk angka "404" sebanyak 5 kali** atau menekan **`Ctrl + Shift + A`** untuk memunculkan gerbang login PIN.

---

## 🔒 3. Peningkatan Keamanan Anti-Peretasan (*Security Hardening*)

### A. Kriptografi Hash SHA-256 dengan Salt Rahasia
- Kode PIN Anda **TIDAK LAGI** disimpan dalam bentuk teks biasa (*plain text*).
- PIN dienkripsi menggunakan algoritma standar industri **SHA-256** ditambah kunci salt rahasia (`wedding_secret_salt_2026`).
- Bahkan jika seseorang memeriksa berkas kode atau database, mereka hanya akan melihat kode acak 64 karakter yang tidak bisa di-dekripsi balik.

### B. Proteksi Anti-Brute-Force & Rate Limiting (Kunci Otomatis)
- Mencegah peretas mencoba menebak PIN berulang kali dengan script otomatis:
  - **Salah 1 - 2 kali:** Peringatan jumlah sisa kesempatan.
  - **Salah 3 - 4 kali:** Sistem dibekukan (*cooldown*) selama 30 detik.
  - **Salah 5 kali berturut-turut:** Sistem **DIBLOKIR OTOMATIS SELAMA 15 MENIT** lengkap dengan penghitung waktu mundur (*countdown lockout*).

### C. Token Sesi Kriptografis (Auto-Expiry 2 Jam)
- Menggunakan token sesi yang dibuat secara acak kriptografis.
- Sesi login akan otomatis kedaluwarsa setelah 2 jam tidak aktif untuk mencegah sesi tertinggal di perangkat yang dipinjam.

---

## 🔐 4. Aturan Keamanan Database Firebase (*Firebase Security Rules*)

Untuk mencegah pihak luar mengubah pengaturan dari luar website, pastikan aturan keamanan di **Firebase Realtime Database Console** diatur dengan file `database.rules.json` yang telah disediakan di folder proyek:

1. Buka [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Buka proyek Anda -> menu **Realtime Database** -> Tab **Rules**.
3. Tempelkan aturan dari file `database.rules.json`:
   - Ucapan tamu hanya mengizinkan penulisan format pesan ucapan yang valid.
4. Klik **Publish**.

# Panduan Penggunaan Panel Admin Undangan

Panel Admin Undangan memungkinkan Anda mengelola seluruh isi website undangan secara mudah, interaktif, dan langsung dari browser (baik dari HP/Smartphone maupun Laptop/PC).

---

## 🔑 Cara Mengakses Panel Admin

1. Buka file **`admin.html`** di browser Anda (atau klik tombol **"Kelola Undangan"** di bagian paling bawah halaman undangan `index.html`).
2. Masukkan PIN Keamanan bawaan:
   - **PIN Default:** `1234`
   *(PIN dapat diubah kapan saja melalui tab **Pengaturan & Backup**)*.

---

## 📱 Fitur-Fitur Utama Panel Admin

### 1. 📊 Dashboard Ringkasan
- Menampilkan total tamu yang telah terdaftar.
- Menampilkan jumlah tamu yang telah mengonfirmasi **Hadir**, **Tidak Hadir**, dan **Ragu-ragu**.
- Menampilkan total doa & ucapan yang masuk.
- Pintasan cepat (*Quick Actions*) untuk menambah tamu, mengubah kata-kata, dan mengunggah foto.
- Menampilkan daftar ucapan doa terbaru dari para tamu.

### 2. 👥 Tujuan Undangan (Buku Tamu & Generator Link)
- **Tambah Tamu Satuan:**
  - Masukkan nama tamu (contoh: `Bpk. Yohanes & Keluarga`).
  - Pilih kategori (Keluarga, Sahabat, Rekan Kerja, VIP, atau Umum).
  - Masukkan nomor WhatsApp tamu (opsional).
  - Tautan personal unik akan otomatis dibuat: `index.html?to=Nama+Tamu`.
  - Tombol **"Salin Link"**: Langsung menyalin link khusus tamu tersebut ke clipboard.
  - Tombol **"Kirim via WhatsApp"**: Langsung membuka aplikasi/web WhatsApp dengan format pesan undangan yang ramah, sopan, lengkap dengan nama penerima dan link undangan.
- **Import Massal (Bulk Generator):**
  - Anda bisa menyalin-tempel puluhan hingga ratusan nama tamu sekaligus (satu nama per baris) dari Excel atau chat.
  - Klik **"Generate Semua Tamu"** dan semua tautan langsung dibuat secara instan.
- **Tabel & Pencarian Tamu:**
  - Cari nama tamu secara instan menggunakan kolom pencarian.
  - Filter tamu berdasarkan kategori.
  - Tombol aksi cepat: Salin Link, Kirim WA, Buka Preview Undangan, dan Hapus Tamu.
  - Tombol **"Download Excel/CSV"** untuk mencadangkan daftar tamu dan tautannya.

### 3. ✍️ Kelola Kata-Kata (Konten Teks)
- **Judul & Pembuka:** Ubah sub-judul sampul, kutipan ayat suci/kata mutiara, sumber ayat/surah, serta salam pembuka.
- **Profil Mempelai:** Ubah nama panggilan, nama lengkap beserta gelar akademik/keagamaan, keterangan orang tua, serta tautan Instagram kedua mempelai (Pria & Wanita).
- **Rangkaian Acara & Countdown:**
  - Atur target tanggal dan jam untuk **Countdown Timer** (Hitung Mundur).
  - Kelola 3 sesi acara: Ibadah Persiapan, Pemberkatan/Akad, dan Resepsi (Judul, Tanggal, Jam, dan Lokasi).
  - Perbarui tautan dan peta embed Google Maps.
- **Pesan Penutup:** Ubah kata penutup dan salam hormat.
- Tombol **"Simpan Perubahan Kata-Kata"** untuk menerapkan langsung ke website.

### 4. 🖼️ Kelola Foto & Galeri
- **Foto Sampul Depan (Cover Hero):**
  - Unggah foto baru dari galeri HP/laptop (sistem otomatis mengompres foto agar ukuran file pas dan ringan).
  - Atau masukkan tautan/URL foto.
- **Foto Profil Mempelai Bulat:**
  - Ganti foto mempelai pria & wanita secara terpisah dengan pratinjau bulat langsung.
- **Galeri Foto "Moment Bahagia":**
  - Tampilan grid foto galeri.
  - Tombol **"Tambah Foto"**: Unggah file foto baru dari perangkat Anda.
  - Tombol **Hapus**: Menghapus foto tertentu dari galeri.
  - Tombol **"Reset ke Foto Bawaan"**: Mengembalikan galeri ke preset foto bawaan jika diinginkan.
- Tombol **"Simpan Pengaturan Foto"** untuk menyimpan semua perubahan.

### 5. 💬 Moderasi Buku Tamu & RSVP
- Melihat seluruh ucapan doa dan konfirmasi kehadiran dari para tamu secara lengkap.
- Filter ucapan berdasarkan status: **Semua**, **Hadir**, **Tidak Hadir**, atau **Ragu-ragu**.
- Tombol **Hapus Ucapan**: Berguna jika terdapat ucapan spam, kata-kata yang kurang pantas, atau ucapan uji coba/testing. Penghapusan otomatis tersinkronisasi ke Firebase dan penyimpanan lokal.

### 6. ⚙️ Pengaturan & Backup
- **Pengaturan Musik Latar:** Ganti lagu latar pernikahan (audio MP3) dan tes putar lagu secara langsung.
- **Ganti PIN Keamanan:** Ganti kode PIN login admin (minimal 4 digit angka).
- **Cadangkan (Export JSON):** Unduh seluruh data undangan (teks, foto, daftar tamu) ke dalam 1 file `.json`.
- **Pulihkan (Import JSON):** Unggah file cadangan untuk memulihkan seluruh data secara instan.
- **Reset ke Default:** Mengembalikan seluruh tampilan dan data undangan ke kondisi awal.

---

## 💡 Sinkronisasi Data (Online & Offline)
- **Jika Firebase Realtime Database aktif:** Perubahan kata-kata, foto, daftar tamu, dan moderasi ucapan otomatis tersimpan di cloud Firebase dan dapat dilihat oleh pengunjung secara *real-time*.
- **Jika Firebase belum diaktifkan / mode offline:** Semua perubahan tetap tersimpan secara aman di penyimpanan browser lokal (`localStorage`) perangkat Anda sehingga sistem tetap berjalan mulus 100%.

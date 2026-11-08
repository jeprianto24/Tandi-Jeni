# Panduan Pengaturan Database Ucapan & RSVP (Firebase Realtime Database)

Fitur database ini memungkinkan tamu undangan mengirim ucapan dan RSVP secara online. Ucapan akan otomatis tersimpan di cloud dan muncul secara **real-time** di halaman undangan tanpa perlu memuat ulang (*refresh*) halaman.

---

## 🚀 Langkah Cepat (Gratis & Tanpa Perlu Server/Hosting PHP)

### Langkah 1: Buat Proyek di Firebase
1. Buka browser dan kunjungi: **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Login menggunakan akun Google Anda.
3. Klik tombol **"Add project"** (atau "Tambahkan proyek").
4. Masukkan nama proyek, misalnya: `undangan-pernikahan`.
5. Nonaktifkan Google Analytics (atau biarkan default), lalu klik **Create project**. Tunggu beberapa detik hingga selesai.

---

### Langkah 2: Aktifkan Realtime Database
1. Di dashboard Firebase sebelah kiri, buka menu **Build** > pilih **Realtime Database**.
2. Klik tombol **Create Database**.
3. Pilih lokasi database terdekat (contoh: **Singapore** atau **United States**), klik **Next**.
4. Pada pilihan aturan keamanan (*Security rules*), pilih **Start in test mode** agar website diizinkan membaca & menulis ucapan secara publik.
5. Klik **Enable**.

---

### Langkah 3: Ambil Konfigurasi Web (firebaseConfig)
1. Di menu kiri paling atas, klik ikon **Roda Gigi (Project settings)** di samping "Project Overview".
2. Gulir ke bawah ke bagian **"Your apps"**, lalu klik ikon Web bertanda **`</>`**.
3. Masukkan nama aplikasi (contoh: `web-undangan`), lalu klik **Register app**.
4. Anda akan melihat kode JavaScript yang berisi objek `firebaseConfig`, contohnya seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxx",
  authDomain: "undangan-pernikahan.firebaseapp.com",
  databaseURL: "https://undangan-pernikahan-default-rtdb.firebaseio.com",
  projectId: "undangan-pernikahan",
  storageBucket: "undangan-pernikahan.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxxxxxxx"
};
```

---

### Langkah 4: Tempelkan ke File `firebase-config.js`
1. Buka file: `firebase-config.js` di folder proyek ini.
2. Salin nilai `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, dan `appId` dari Firebase ke dalam file tersebut.
3. Simpan file (`Ctrl + S`).

---

## ✨ Fitur-Fitur yang Sudah Terpasang Otomatis:

1. **Real-time Sync**: Tamu mengirim ucapan, data langsung tampil seketika di layar semua pengunjung yang sedang membuka website.
2. **Hitung Statistik Otomatis**:
   - Total Ucapan
   - Jumlah Tamu yang Konfirmasi Hadir
   - Jumlah Tamu yang Tidak Hadir
   - Jumlah Tamu yang Masih Ragu-ragu
3. **Badge Kehadiran & Avatar**:
   - Hadir (Hijau dengan ikon centang)
   - Tidak Hadir (Merah dengan ikon silang)
   - Ragu-ragu (Kuning/Emas dengan ikon tanya)
4. **Keamanan XSS**: Input tamu sudah disaring (*sanitized*) agar aman dari kode berbahaya.
5. **Fallback Lokal**: Jika kunci Firebase belum dimasukkan, sistem secara cerdas akan beralih ke penyimpanan lokal browser (`localStorage`) sehingga halaman web tidak akan error ketika dicoba secara offline.

---

## 📋 Cara Melihat / Menghapus / Mengunduh Data Ucapan
- Anda bisa melihat seluruh daftar ucapan secara langsung melalui:
  **Firebase Console** -> **Realtime Database** -> Tab **Data**.
- Di sana Anda bisa menghapus pesan spam atau mengekspor seluruh data ucapan ke format JSON.

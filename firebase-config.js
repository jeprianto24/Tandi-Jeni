// ==========================================================================
// KONFIGURASI DATABASE UCAPAN & RSVP (FIREBASE REALTIME DATABASE)
// ==========================================================================

const firebaseConfig = {
    apiKey: "AIzaSyB3yTFzpWzt4dzTOZb_kcGUf5zYX0H5hmo",
    authDomain: "undangan-pernikahan-9336f.firebaseapp.com",
    // databaseURL akan otomatis mengarah ke Realtime Database Anda:
    // Jika Anda memilih region Singapore: .asia-southeast1.firebasedatabase.app
    // Jika Anda memilih region United States: .firebaseio.com
    databaseURL: "https://undangan-pernikahan-9336f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "undangan-pernikahan-9336f",
    storageBucket: "undangan-pernikahan-9336f.firebasestorage.app",
    messagingSenderId: "653633109096",
    appId: "1:653633109096:web:2cc7f4a92df2282eca0fdd",
    measurementId: "G-Y246R03LTS"
};

// Cek apakah konfigurasi valid
function isFirebaseConfigured() {
    return firebaseConfig.apiKey && 
           !firebaseConfig.apiKey.includes("GANTI_DENGAN");
}

let db = null;

// Inisialisasi Firebase
if (typeof firebase !== 'undefined' && isFirebaseConfigured()) {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database();
        console.log("✅ Firebase Realtime Database terhubung!");
    } catch (error) {
        console.warn("Koneksi Firebase Realtime Database perlu dipastikan:", error);
    }
} else {
    console.warn("⚠️ Firebase belum aktif. Menggunakan penyimpanan lokal sementara.");
}

// --------------------------------------------------------------------------
// Helper Layanan Database (Mendukung Realtime Database & Fallback)
// --------------------------------------------------------------------------
const UcapanDB = {
    // Simpan ucapan baru
    async simpan(data) {
        if (db) {
            try {
                const ucapanRef = db.ref('ucapan');
                const newRef = ucapanRef.push();
                return await newRef.set({
                    ...data,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            } catch (err) {
                console.error("Gagal simpan ke Firebase, beralih ke penyimpanan lokal:", err);
                return this.simpanLokal(data);
            }
        } else {
            return this.simpanLokal(data);
        }
    },

    simpanLokal(data) {
        return new Promise((resolve) => {
            const list = JSON.parse(localStorage.getItem('wedding_ucapan') || '[]');
            const item = {
                id: 'local_' + Date.now(),
                ...data,
                timestamp: Date.now()
            };
            list.unshift(item);
            localStorage.setItem('wedding_ucapan', JSON.stringify(list));
            if (window.onLocalUcapanUpdate) {
                window.onLocalUcapanUpdate(list);
            }
            resolve(item);
        });
    },

    // Dengarkan data ucapan secara real-time
    onUcapanChange(callback) {
        if (db) {
            db.ref('ucapan').orderByChild('timestamp').on('value', (snapshot) => {
                const data = [];
                snapshot.forEach((childSnapshot) => {
                    data.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                data.reverse();
                callback(data);
            }, (error) => {
                console.warn("Gagal membaca Firebase (mungkin database belum dibuat di konsol):", error);
                // Fallback ke penyimpanan lokal jika database belum dibuat di Firebase console
                this.loadLokal(callback);
            });
        } else {
            this.loadLokal(callback);
        }
    },

    loadLokal(callback) {
        const list = JSON.parse(localStorage.getItem('wedding_ucapan') || '[]');
        callback(list);
        window.onLocalUcapanUpdate = callback;
    }
};

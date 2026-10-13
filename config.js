// =====================================================================
// KONFIGURASI POSLAP KARHUTLA KECAMATAN MALIKU
// Isi GAS_API_URL dengan URL Web App Google Apps Script (berakhiran /exec)
// setelah Anda men-deploy folder apps-script/ (lihat README.md).
// =====================================================================
window.POSLAP_CONFIG = {
  GAS_API_URL: "",   // contoh: "https://script.google.com/macros/s/AKfycb.../exec"

  // Kontak untuk tombol "Kontak Petugas" (telepon & WhatsApp).
  // telepon: format 08xx..., +628xx..., atau 628xx... ; whatsapp: false jika nomor hanya bisa ditelepon.
  KONTAK_PETUGAS: [
    { nama: "Camat Maliku",              jabatan: "Kecamatan Maliku",        telepon: "" },  // <- ISI NOMOR
    { nama: "Petugas Kecamatan / Poslap", jabatan: "Piket Karhutla Maliku",  telepon: "" },  // <- ISI NOMOR
    { nama: "Layanan Darurat 112",        jabatan: "Nasional, bebas pulsa",  telepon: "112", whatsapp: false }
  ]
};

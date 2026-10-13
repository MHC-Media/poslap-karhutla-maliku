# Poslap Karhutla Kecamatan Maliku (Kab. Pulang Pisau)

Isi folder:
- `index.html`, `config.js`, `pwa.js`, `sw.js`, `manifest.webmanifest`, `offline.html`, `icons/` : aplikasi web (hosting GitHub Pages)
- `apps-script/` : 4 file backend Google Apps Script (Code.gs, Udara.gs, Statistik.gs, SumberAir.gs)
- `data/kec-maliku-desa.geojson` : batas 15 desa (kec-maliku_New_lengkap.json + Maliku Mulya; sudah dicek: 0 m² tumpang tindih antar-desa)

## Langkah pasang
1. **Backend**: buat Google Spreadsheet baru > Extensions > Apps Script. Salin 4 file di `apps-script/` (nama file sama).
2. Jalankan `setupAwal()` sekali (beri izin). Ini membuat sheet, 3 pemicu otomatis, dan menarik data pertama.
3. Menu Spreadsheet **Sumber Air > Atur kode admin** (min. 8 karakter).
4. (Disarankan) Simpan kunci NASA FIRMS di Script Properties lewat `simpanKunciFirms()`, lalu hapus `MAP_KEY` di CONFIG.
5. Deploy > New deployment > Web app: Execute as **Me**, access **Anyone**. Salin URL `/exec`.
6. Tempel URL itu ke `GAS_API_URL` di `config.js`.
7. Unggah isi folder ini ke repository GitHub, aktifkan Pages (HTTPS wajib untuk PWA).

## Pasang di HP
Buka alamat GitHub Pages di Chrome Android > tombol **Pasang Aplikasi** (atau menu > Instal aplikasi). iPhone: Safari > Bagikan > Tambah ke Layar Utama.

## Catatan data batas desa
- Sumber polygon: `kec-maliku_New_lengkap.json` (14 desa) + **Maliku Mulya** (kode 62.11.06.2015).
- Data Maliku Mulya hanya berupa titik, sedangkan polygon Maliku Baru di sumber masih mencakup wilayahnya. Batas Maliku Mulya diambil dari bentuk lama di aplikasi, dipotong mengikuti batas Maliku Baru, lalu Maliku Baru dikurangi bagian itu. Luas hasilnya ±541 ha (resmi 613,795 ha). Ganti dengan polygon resmi bila tersedia.
- Kode **Tahai Baru** (`62.11.06.2001`) dan **Tahai Jaya** (`62.11.06.2010`) bersifat sementara; ganti dengan kode Kemendagri resmi jika berbeda.

## Menambah desa (jika kecamatan punya 15 desa)
Tambahkan fitur baru di `GEOJSON` pada `index.html` **dan** `GEOJSON_DATA` pada `Code.gs` (properti: village_code `id`+kode tanpa titik, kode, village, district, color), lalu naikkan `VERSION` di `sw.js`.

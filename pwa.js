/* Pendaftaran PWA: service worker, tombol "Pasang Aplikasi", dan notifikasi pembaruan. */
(function () {
  'use strict';
  var toast = function (html, actions) {
    var t = document.getElementById('pwa-toast'); if (!t) return;
    t.textContent = '';
    var span = document.createElement('span'); span.textContent = html; t.appendChild(span);
    (actions || []).forEach(function (a) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = a.label;
      b.style.cssText = 'background:#fff;color:#0a3a1b;border:0;border-radius:9px;padding:5px 10px;font:700 12px system-ui;cursor:pointer';
      b.onclick = function () { t.style.display = 'none'; a.fn && a.fn(); }; t.appendChild(b);
    });
    t.style.display = 'flex';
  };

  // --- Service worker (hanya di HTTPS atau localhost) ---
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        reg.addEventListener('updatefound', function () {
          var nw = reg.installing; if (!nw) return;
          nw.addEventListener('statechange', function () {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              toast('Versi baru aplikasi tersedia.', [{ label: 'Muat ulang', fn: function () { nw.postMessage('SKIP_WAITING'); } }]);
            }
          });
        });
      }).catch(function (e) { console.warn('SW gagal didaftarkan:', e); });
      var reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () { if (reloading) return; reloading = true; location.reload(); });
    });
  }

  // --- Tombol Pasang Aplikasi ---
  var deferred = null, btn = function () { return document.getElementById('btn-install'); };
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  function showBtn() { var b = btn(); if (b && !standalone) { b.classList.remove('hidden'); b.classList.add('inline-flex'); } }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; showBtn(); });
  window.addEventListener('appinstalled', function () { deferred = null; var b = btn(); if (b) b.classList.add('hidden'); toast('Aplikasi berhasil dipasang.', [{ label: 'OK' }]); });
  document.addEventListener('DOMContentLoaded', function () {
    var b = btn(); if (!b) return;
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && !standalone) showBtn(); // iOS tidak punya prompt otomatis -> tampilkan petunjuk
    b.addEventListener('click', function () {
      if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; b.classList.add('hidden'); }); }
      else if (isIOS) toast('Di iPhone/iPad: ketuk tombol Bagikan (kotak berpanah) lalu pilih "Tambah ke Layar Utama".', [{ label: 'Mengerti' }]);
      else toast('Buka menu browser (titik tiga) lalu pilih "Instal aplikasi" / "Tambahkan ke layar utama".', [{ label: 'Mengerti' }]);
    });
  });
})();

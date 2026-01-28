const webAppUrl = "https://script.google.com/macros/s/AKfycbxvlmlJ512BbiA9v5256n4JJVJwWHPl4CJL7vQIMU2dclfX4LxNYsww-EJfSoR77HkZ/exec";

// 1. Fungsi Kembali ke Beranda (Landing Page)
function showHome() {
    // Sembunyikan halaman data, tampilkan landing page
    const landing = document.getElementById('landing-page');
    const dataPage = document.getElementById('data-page');
    
    if (landing) landing.style.display = 'block';
    if (dataPage) dataPage.style.display = 'none';
    
    // Update visual tombol aktif
    updateActiveNav('btn-home');
    
    // Muat cuplikan berita tanpa menunggu (async)
    loadNewsHighlight();
}

// 2. Fungsi Pindah Halaman Data (Alumni, Karir, dll)
async function changePage(sheetName, element) {
    // Sembunyikan landing page, tampilkan halaman data
    const landing = document.getElementById('landing-page');
    const dataPage = document.getElementById('data-page');
    
    if (landing) landing.style.display = 'none';
    if (dataPage) dataPage.style.display = 'block';

    // Update Judul & Navigasi
    document.getElementById('page-title').innerText = sheetName === 'Database' ? 'Direktori Alumni' : 'Portal ' + sheetName;
    updateActiveNav(element);

    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div class="col-span-full py-20 text-center">
            <div class="loader mx-auto"></div>
            <p class="mt-4 text-gray-500 font-medium">Mengambil data dari ${sheetName}...</p>
        </div>`;

    try {
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        const data = await response.json();
        container.innerHTML = '';

        if (!data || data.length === 0 || data.error) {
            container.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400 italic">Data ${sheetName} belum tersedia di Spreadsheet.</p>`;
            return;
        }

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (e) {
        container.innerHTML = '<p class="col-span-full text-center text-red-500 py-20 font-bold">⚠️ Gagal terhubung ke database. Silakan coba lagi.</p>';
    }
}

// 3. Helper: Indikator Halaman Aktif (Modern Look)
function updateActiveNav(target) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = "#6b7280";
        btn.style.background = "transparent";
    });

    const activeBtn = (typeof target === 'string') ? document.getElementById(target) : target;
    
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.color = "#1d4ed8";
        activeBtn.style.background = "#eff6ff";
        activeBtn.style.borderRadius = "12px";
    }
}

// 4. Highlight Berita (Halaman Depan)
async function loadNewsHighlight() {
    const container = document.getElementById('news-highlight');
    if (!container) return;

    try {
        const response = await fetch(`${webAppUrl}?page=Berita`, { redirect: "follow" });
        const data = await response.json();
        
        if (data && data.length > 0 && !data.error) {
            container.innerHTML = '';
            data.slice(0, 3).forEach(item => {
                container.innerHTML += `
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer" onclick="changePage('Berita')">
                        <img src="${item.LinkGambar || 'https://via.placeholder.com/400x200'}" class="w-full h-44 object-cover">
                        <div class="p-5">
                            <p class="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">${item.Tanggal || ''}</p>
                            <h3 class="font-bold text-gray-900 leading-tight">${item.Judul || 'Kabar Alumni'}</h3>
                        </div>
                    </div>`;
            });
        } else {
            container.innerHTML = '<p class="col-span-3 text-center text-gray-400 py-10">Belum ada berita terbaru.</p>';
        }
    } catch (e) {
        container.innerHTML = '<p class="col-span-3 text-center text-gray-400 py-10">Gagal memuat cuplikan berita.</p>';
    }
}

// RENDER TEMPLATES
function renderAlumni(d) { return `<div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition"><img src="${d['Foto (URL)']}" class="w-full h-52 object-cover rounded-2xl mb-4"><h3 class="font-bold text-gray-900">${d.Nama}</h3><p class="text-blue-600 text-sm font-semibold">Angkatan ${d.Angkatan}</p><p class="text-gray-500 text-xs mt-2">${d.Pekerjaan || ''}</p></div>`; }
function renderLoker(d) { return `<div class="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm hover:border-blue-200 transition"><h3 class="font-bold text-xl text-gray-900">${d.Posisi}</h3><p class="text-blue-600 font-medium mb-6">${d.Perusahaan}</p><a href="${d.Link}" target="_blank" class="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Lamar Sekarang</a></div>`; }
function renderBerita(d) { return `<div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"><img src="${d.LinkGambar}" class="w-full h-44 object-cover"><div class="p-6"><p class="text-xs text-gray-400 font-medium mb-2">${d.Tanggal}</p><h3 class="font-bold text-gray-900 mb-3">${d.Judul}</h3><p class="text-gray-600 text-sm leading-relaxed">${d.Ringkasan}</p></div></div>`; }
function renderEtalase(d) { return `<div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center"><img src="${d.FotoProduk}" class="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-4 ring-gray-50"><h3 class="font-bold text-gray-900">${d.NamaBisnis}</h3><p class="text-gray-500 text-xs mb-6">${d.Produk}</p><a href="https://wa.me/${d.WhatsApp}" target="_blank" class="inline-block w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">Pesan via WA</a></div>`; }

// Inisialisasi
window.addEventListener('DOMContentLoaded', showHome);

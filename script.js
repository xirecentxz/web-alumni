const webAppUrl = "https://script.google.com/macros/s/AKfycbxvlmlJ512BbiA9v5256n4JJVJwWHPl4CJL7vQIMU2dclfX4LxNYsww-EJfSoR77HkZ/exec";

// 1. Fungsi Kembali ke Beranda
function showHome() {
    toggleVisibility('home');
    updateActiveNav('btn-home');
    loadNewsHighlight();
}

// 2. Fungsi Pindah Halaman Data
async function changePage(sheetName, element) {
    toggleVisibility('data');
    updateActiveNav(element);
    
    // Sesuaikan judul halaman
    const titleMap = {
        'Database': 'Direktori Alumni',
        'Loker': 'Bursa Kerja Alumni',
        'Berita': 'Kabar & Berita',
        'Etalase': 'Produk Alumni'
    };
    document.getElementById('page-title').innerText = titleMap[sheetName] || sheetName;

    const container = document.getElementById('main-content');
    container.innerHTML = `
        <div class="col-span-full py-20 flex flex-col items-center">
            <div class="loader mb-4"></div>
            <p class="text-gray-400 animate-pulse font-medium">Mengambil data dari Tab: ${sheetName}...</p>
        </div>`;

    try {
        // Mengirim parameter ?page=NamaTab ke Google Script
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        const data = await response.json();
        container.innerHTML = '';

        if (!data || data.length === 0 || data.error) {
            container.innerHTML = `
                <div class="col-span-full py-20 text-center">
                    <p class="text-gray-500 italic">Data di tab "${sheetName}" belum tersedia atau nama tab salah.</p>
                </div>`;
            return;
        }

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (e) {
        container.innerHTML = `
            <div class="col-span-full py-20 text-center bg-red-50 rounded-3xl border border-red-100">
                <p class="text-red-600 font-bold mb-2">⚠️ Database Gagal Dimuat</p>
                <p class="text-red-400 text-sm">Pastikan Anda sudah Deploy ulang Google Script ke 'Anyone'.</p>
                <button onclick="location.reload()" class="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-xs">Coba Lagi</button>
            </div>`;
    }
}

// 3. Helper Navigasi & UI
function toggleVisibility(mode) {
    const landing = document.getElementById('landing-page');
    const dataPage = document.getElementById('data-page');
    if (mode === 'home') {
        landing.style.display = 'block';
        dataPage.style.display = 'none';
    } else {
        landing.style.display = 'none';
        dataPage.style.display = 'block';
    }
}

function updateActiveNav(target) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = (typeof target === 'string') ? document.getElementById(target) : target;
    if (activeBtn) activeBtn.classList.add('active');
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
                            <p class="text-blue-600 text-[10px] font-bold uppercase mb-2">${item.Tanggal || ''}</p>
                            <h3 class="font-bold text-gray-900 leading-tight">${item.Judul || 'Berita Alumni'}</h3>
                        </div>
                    </div>`;
            });
        }
    } catch (e) { console.log("News fail"); }
}

// 5. Template Render (Pastikan Header di Sheets sama persis)
function renderAlumni(d) {
    return `<div class="alumni-card">
        <img src="${d['Foto (URL)']}" class="w-full h-52 object-cover rounded-2xl mb-4 shadow-sm">
        <h3 class="font-bold text-gray-900">${d.Nama}</h3>
        <p class="text-blue-600 text-sm font-semibold">Angkatan ${d.Angkatan}</p>
        <div class="pt-4 mt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            ${d.Pekerjaan || 'Alumni'}
        </div>
    </div>`;
}

// ... Tambahkan renderLoker, renderBerita, renderEtalase di sini ...

window.addEventListener('DOMContentLoaded', showHome);

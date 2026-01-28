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
    
    document.getElementById('page-title').innerText = sheetName === 'Database' ? 'Direktori Alumni' : 'Portal ' + sheetName;

    const container = document.getElementById('main-content');
    // Efek Loading Modern
    container.innerHTML = `
        <div class="col-span-full py-20 flex flex-col items-center">
            <div class="loader"></div>
            <p class="mt-4 text-gray-400 animate-pulse">Menghubungkan ke Database ${sheetName}...</p>
        </div>`;

    try {
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        container.innerHTML = '';

        if (!data || data.length === 0 || data.error) {
            showEmptyState(container, sheetName);
            return;
        }

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (e) {
        showErrorState(container, e.message);
    }
}

// 3. Tanda Jika Tidak Bisa Konek (Error State)
function showErrorState(container, message) {
    container.innerHTML = `
        <div class="col-span-full py-16 px-6 text-center bg-red-50 rounded-3xl border border-red-100">
            <div class="text-5xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold text-red-800 mb-2">Gagal Terhubung ke Database</h3>
            <p class="text-red-600 mb-6 text-sm">Terjadi kesalahan teknis atau masalah jaringan.</p>
            <button onclick="location.reload()" class="bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition">Coba Segarkan Halaman</button>
            <p class="mt-4 text-[10px] text-red-400 uppercase tracking-widest">Detail: ${message}</p>
        </div>`;
}

function showEmptyState(container, name) {
    container.innerHTML = `
        <div class="col-span-full py-16 text-center">
            <div class="text-5xl mb-4">📁</div>
            <h3 class="text-lg font-bold text-gray-800">Data ${name} Masih Kosong</h3>
            <p class="text-gray-500 text-sm">Belum ada informasi yang diinputkan di Google Sheets.</p>
        </div>`;
}

// 4. Helper Navigasi
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

// 5. Highlight Berita
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
        }
    } catch (e) { console.log("Highlight error:", e); }
}

// 6. Template Render (Pastikan Nama Properti Sesuai Header di Sheets)
function renderAlumni(d) { return `<div class="alumni-card"><img src="${d['Foto (URL)']}" class="w-full h-52 object-cover rounded-2xl mb-4 shadow-sm"><h3 class="font-bold text-gray-900">${d.Nama}</h3><p class="text-blue-600 text-sm font-semibold">Angkatan ${d.Angkatan}</p><div class="pt-4 mt-4 border-t border-gray-50"><p class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">${d.Pekerjaan || 'Alumni'}</p></div></div>`; }
function renderLoker(d) { return `<div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"><h3 class="font-bold text-xl text-gray-900">${d.Posisi}</h3><p class="text-blue-600 font-medium mb-6">${d.Perusahaan}</p><div class="text-sm text-gray-500 mb-6">📍 ${d.Lokasi} | ${d.Tipe}</div><a href="${d.Link}" target="_blank" class="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">Lamar Sekarang</a></div>`; }
function renderBerita(d) { return `<div class="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"><img src="${d.LinkGambar}" class="w-full h-44 object-cover"><div class="p-6"><p class="text-xs text-blue-500 font-bold mb-2">${d.Tanggal}</p><h3 class="font-bold text-gray-900 mb-3">${d.Judul}</h3><p class="text-gray-600 text-sm leading-relaxed line-clamp-3">${d.Ringkasan}</p></div></div>`; }
function renderEtalase(d) { return `<div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center"><img src="${d.FotoProduk}" class="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-4 ring-blue-50"><h3 class="font-bold text-gray-900">${d.NamaBisnis}</h3><p class="text-gray-500 text-xs mb-6">${d.Produk}</p><a href="https://wa.me/${d.WhatsApp}" target="_blank" class="inline-block w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100">Order via WhatsApp</a></div>`; }

window.addEventListener('DOMContentLoaded', showHome);

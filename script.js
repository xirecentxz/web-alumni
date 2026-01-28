/* script.js - Smart Navigation Logic 2026 */
const webAppUrl = "https://script.google.com/macros/s/AKfycbxvlmlJ512BbiA9v5256n4JJVJwWHPl4CJL7vQIMU2dclfX4LxNYsww-EJfSoR77HkZ/exec";

// Fungsi untuk kembali ke Beranda (Landing Page)
function showHome() {
    toggleVisibility('home');
    updateActiveBtn('btn-home');
    loadNewsHighlight();
}

// Fungsi pindah halaman data
async function changePage(sheetName, element) {
    toggleVisibility('data');
    updateActiveBtn(element);
    
    const title = document.getElementById('page-title');
    title.innerText = sheetName === 'Database' ? 'Direktori Alumni' : 'Portal ' + sheetName;

    const container = document.getElementById('main-content');
    container.innerHTML = '<div class="col-span-full py-20 flex flex-col items-center"><div class="loader"></div><p class="mt-4 text-gray-400 font-medium">Sinkronisasi Database...</p></div>';

    try {
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        const data = await response.json();
        container.innerHTML = '';

        if (!data || data.length === 0 || data.error) {
            container.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">Data ${sheetName} belum tersedia.</p>`;
            return;
        }

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (e) {
        container.innerHTML = '<p class="col-span-full text-center text-red-500 py-20 font-bold">⚠️ Koneksi terputus. Silakan refresh halaman.</p>';
    }
}

// Helper: Mengatur tampilan section
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

// Helper: Indikator tombol aktif
function updateActiveBtn(target) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    if (typeof target === 'string') {
        document.getElementById(target).classList.add('active');
    } else {
        target.classList.add('active');
    }
}

// RENDER TEMPLATES (Clean & Modern Design)
function renderAlumni(d) {
    return `
    <div class="alumni-card">
        <img src="${d['Foto (URL)']}" class="w-full h-52 object-cover rounded-2xl mb-4 shadow-sm" loading="lazy">
        <h3 class="font-bold text-lg text-gray-900 leading-tight">${d.Nama}</h3>
        <p class="text-blue-600 text-sm font-semibold mb-3">Angkatan ${d.Angkatan}</p>
        <div class="pt-4 border-t border-gray-100">
            <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">${d.Pekerjaan || 'Alumni'}</p>
        </div>
    </div>`;
}

// Template lain (Loker, Berita, Etalase) tetap sama seperti sebelumnya namun dengan class CSS modern.
function renderLoker(d) { return `<div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"><h3 class="font-bold text-xl text-gray-800">${d.Posisi}</h3><p class="text-blue-600 font-medium mb-6">${d.Perusahaan}</p><a href="${d.Link}" target="_blank" class="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Lamar Pekerjaan</a></div>`; }

function loadNewsHighlight() {
    // Implementasi fetch berita singkat untuk landing page
    // (Gunakan kode fetch berita sebelumnya di sini)
}

// Start
window.addEventListener('DOMContentLoaded', showHome);

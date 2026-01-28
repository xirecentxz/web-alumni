const webAppUrl = "https://script.google.com/macros/s/AKfycbxvlmlJ512BbiA9v5256n4JJVJwWHPl4CJL7vQIMU2dclfX4LxNYsww-EJfSoR77HkZ/exec";

// Fungsi untuk kembali ke Beranda
function showHome() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('data-page').classList.add('hidden');
    
    // Reset style tombol navbar
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.color = "#4b5563");
    document.getElementById('btn-home').style.color = "#1d4ed8";
    
    loadNewsHighlight();
}

// Fungsi utama perpindahan halaman
async function changePage(sheetName, element) {
    // 1. Tampilkan kontainer data, sembunyikan landing page
    const landing = document.getElementById('landing-page');
    const dataPage = document.getElementById('data-page');
    
    if(landing) landing.classList.add('hidden');
    if(dataPage) dataPage.classList.remove('hidden');

    // 2. Update judul halaman
    const title = document.getElementById('page-title');
    if(title) title.innerText = sheetName === 'Database' ? 'Direktori Alumni' : 'Informasi ' + sheetName;

    // 3. Visual tombol aktif
    document.querySelectorAll('.nav-btn').forEach(btn => btn.style.color = "#4b5563");
    if(element) element.style.color = "#1d4ed8";

    // 4. Loading state
    const container = document.getElementById('main-content');
    container.innerHTML = '<div class="col-span-full py-20 text-center"><div class="loader"></div><p class="mt-4 text-gray-500">Mengambil data ' + sheetName + '...</p></div>';

    try {
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        const data = await response.json();
        container.innerHTML = '';

        if (!data || data.length === 0 || data.error) {
            container.innerHTML = '<p class="col-span-full text-center py-10 text-gray-500">Data tidak ditemukan di tab ' + sheetName + '</p>';
            return;
        }

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (e) {
        container.innerHTML = '<p class="col-span-full text-center text-red-500">Gagal terhubung ke database. Cek koneksi internet Anda.</p>';
    }
}

// Fungsi Highlight Berita di Beranda
async function loadNewsHighlight() {
    const container = document.getElementById('news-highlight');
    if(!container) return;

    try {
        const response = await fetch(`${webAppUrl}?page=Berita`, { redirect: "follow" });
        const data = await response.json();
        
        if (data && data.length > 0 && !data.error) {
            container.innerHTML = '';
            data.slice(0, 3).forEach(item => {
                container.innerHTML += `
                    <div class="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition cursor-pointer" onclick="changePage('Berita')">
                        <img src="${item.LinkGambar || 'https://via.placeholder.com/400x200'}" class="w-full h-40 object-cover">
                        <div class="p-4">
                            <p class="text-blue-600 text-[10px] font-bold uppercase">${item.Tanggal || ''}</p>
                            <h3 class="font-bold text-md mt-1 leading-tight">${item.Judul || 'Tanpa Judul'}</h3>
                        </div>
                    </div>`;
            });
        } else {
            container.innerHTML = '<p class="col-span-3 text-center text-gray-400 italic">Belum ada berita untuk ditampilkan.</p>';
        }
    } catch (e) {
        container.innerHTML = '<p class="col-span-3 text-center text-gray-400">Gagal memuat cuplikan berita.</p>';
    }
}

// Render Templates
function renderAlumni(d) { return `<div class="bg-white p-4 rounded-xl shadow-sm border"><img src="${d['Foto (URL)']}" class="w-full h-48 object-cover rounded-lg mb-4"><h3 class="font-bold">${d.Nama}</h3><p class="text-blue-600 text-sm">Angkatan ${d.Angkatan}</p><p class="text-gray-500 text-xs mt-1">${d.Pekerjaan}</p></div>`; }
function renderLoker(d) { return `<div class="bg-white p-6 rounded-xl border-l-4 border-blue-600 shadow-sm"><h3 class="font-bold text-lg">${d.Posisi}</h3><p class="text-gray-600 text-sm">${d.Perusahaan}</p><a href="${d.Link}" target="_blank" class="block mt-4 bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-bold">Lamar</a></div>`; }
function renderBerita(d) { return `<div class="bg-white rounded-xl border overflow-hidden shadow-sm"><img src="${d.LinkGambar}" class="w-full h-40 object-cover"><div class="p-4"><p class="text-xs text-gray-400">${d.Tanggal}</p><h3 class="font-bold mt-1">${d.Judul}</h3><p class="text-gray-600 text-sm mt-2 line-clamp-2">${d.Ringkasan}</p></div></div>`; }
function renderEtalase(d) { return `<div class="bg-white p-6 rounded-xl border shadow-sm text-center"><img src="${d.FotoProduk}" class="w-20 h-20 mx-auto rounded-full object-cover mb-4 shadow-md"><h3 class="font-bold">${d.NamaBisnis}</h3><p class="text-xs text-gray-500 mt-1">${d.Produk}</p><a href="https://wa.me/${d.WhatsApp}" target="_blank" class="inline-block mt-4 bg-green-500 text-white px-6 py-2 rounded-full text-xs font-bold">Pesan WA</a></div>`; }

// Jalankan saat startup
window.addEventListener('DOMContentLoaded', () => {
    showHome();
});

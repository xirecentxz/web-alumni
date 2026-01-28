const webAppUrl = "https://script.google.com/macros/s/AKfycbxvlmlJ512BbiA9v5256n4JJVJwWHPl4CJL7vQIMU2dclfX4LxNYsww-EJfSoR77HkZ/exec";

function showHome() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('data-page').classList.add('hidden');
    loadNewsHighlight(); // Muat ulang highlight berita
}

async function changePage(sheetName, element) {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('data-page').classList.remove('hidden');
    document.getElementById('page-title').innerText = sheetName === 'Database' ? 'Direktori Alumni' : 'Informasi ' + sheetName;

    const container = document.getElementById('main-content');
    container.innerHTML = '<div class="col-span-full py-20"><div class="loader"></div></div>';

    try {
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        const data = await response.json();
        container.innerHTML = '';

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (e) { container.innerHTML = "Gagal memuat data."; }
}

async function loadNewsHighlight() {
    try {
        const response = await fetch(`${webAppUrl}?page=Berita`, { redirect: "follow" });
        const data = await response.json();
        const highlightContainer = document.getElementById('news-highlight');
        highlightContainer.innerHTML = '';

        // Ambil hanya 3 berita teratas (terbaru)
        data.slice(0, 3).forEach(item => {
            highlightContainer.innerHTML += `
                <div class="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition cursor-pointer" onclick="changePage('Berita')">
                    <img src="${item.LinkGambar}" class="w-full h-40 object-cover">
                    <div class="p-4">
                        <p class="text-blue-600 text-xs font-bold uppercase">${item.Tanggal}</p>
                        <h3 class="font-bold text-lg leading-tight mt-1">${item.Judul}</h3>
                    </div>
                </div>`;
        });
    } catch (e) { console.log("Gagal memuat highlight."); }
}

// Fungsi render template (sama seperti sebelumnya)
function renderAlumni(d) { return `<div class="bg-white p-4 rounded-xl shadow-sm border"><img src="${d['Foto (URL)']}" class="w-full h-48 object-cover rounded-lg mb-4"><h3 class="font-bold">${d.Nama}</h3><p class="text-blue-600 text-sm">Angkatan ${d.Angkatan}</p></div>`; }
function renderLoker(d) { return `<div class="bg-white p-6 rounded-xl border-l-4 border-blue-600 shadow-sm"><h3 class="font-bold text-lg">${d.Posisi}</h3><p class="text-gray-600 text-sm">${d.Perusahaan}</p><a href="${d.Link}" target="_blank" class="block mt-4 bg-blue-600 text-white text-center py-2 rounded-lg text-sm">Lamar</a></div>`; }
function renderBerita(d) { return `<div class="bg-white rounded-xl border overflow-hidden shadow-sm"><img src="${d.LinkGambar}" class="w-full h-40 object-cover"><div class="p-4"><p class="text-xs text-gray-400">${d.Tanggal}</p><h3 class="font-bold mt-1">${d.Judul}</h3><p class="text-gray-600 text-sm mt-2">${d.Ringkasan}</p></div></div>`; }
function renderEtalase(d) { return `<div class="bg-white p-6 rounded-xl border shadow-sm text-center"><img src="${d.FotoProduk}" class="w-20 h-20 mx-auto rounded-full object-cover mb-4 shadow-md"><h3 class="font-bold">${d.NamaBisnis}</h3><a href="https://wa.me/${d.WhatsApp}" class="inline-block mt-4 bg-green-500 text-white px-6 py-2 rounded-full text-xs">Pesan WA</a></div>`; }

// Inisialisasi Beranda
window.addEventListener('DOMContentLoaded', () => {
    showHome();
    loadNewsHighlight();
});

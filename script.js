const webAppUrl = "https://script.google.com/macros/s/AKfycbxvlmlJ512BbiA9v5256n4JJVJwWHPl4CJL7vQIMU2dclfX4LxNYsww-EJfSoR77HkZ/exec";

async function changePage(sheetName, element) {
    document.getElementById('page-title').innerText = sheetName === 'Database' ? 'Direktori Alumni' : 'Halaman ' + sheetName;
    
    // Update menu aktif
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-link'));
    if(element) element.classList.add('active-link');

    const container = document.getElementById('main-content');
    container.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Memuat data ' + sheetName + '...</p></div>';

    try {
        const response = await fetch(`${webAppUrl}?page=${sheetName}`, { redirect: "follow" });
        const data = await response.json();
        container.innerHTML = '';

        if (!data || data.length === 0) {
            container.innerHTML = '<p class="col-span-full text-center">Data kosong.</p>';
            return;
        }

        data.forEach(item => {
            if (sheetName === 'Database') container.innerHTML += renderAlumni(item);
            else if (sheetName === 'Loker') container.innerHTML += renderLoker(item);
            else if (sheetName === 'Berita') container.innerHTML += renderBerita(item);
            else if (sheetName === 'Etalase') container.innerHTML += renderEtalase(item);
        });
    } catch (error) {
        container.innerHTML = '<p class="col-span-full text-center text-red-500">Error: Gagal terhubung ke database.</p>';
    }
}

// Fungsi render (Gunakan template literal HTML)
function renderAlumni(d) {
    return `<div class="bg-white rounded-xl shadow-sm border p-4">
        <img src="${d['Foto (URL)']}" class="w-full h-48 object-cover rounded-lg mb-4">
        <h3 class="font-bold">${d.Nama}</h3>
        <p class="text-blue-600 text-sm">Angkatan ${d.Angkatan}</p>
        <p class="text-gray-500 text-sm italic">${d.Pekerjaan} - ${d.Domisili}</p>
    </div>`;
}

function renderLoker(d) {
    return `<div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
        <h3 class="font-bold text-lg">${d.Posisi}</h3>
        <p class="text-gray-700">${d.Perusahaan}</p>
        <p class="text-gray-500 text-xs mt-2">📍 ${d.Lokasi}</p>
        <a href="${d.Link}" target="_blank" class="block w-full text-center bg-blue-600 text-white py-2 rounded-lg mt-4 font-bold">Lamar</a>
    </div>`;
}

function renderBerita(d) {
    return `<div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <img src="${d.LinkGambar}" class="w-full h-32 object-cover">
        <div class="p-4">
            <h3 class="font-bold text-sm leading-tight">${d.Judul}</h3>
            <p class="text-gray-400 text-[10px] mt-1">${d.Tanggal}</p>
        </div>
    </div>`;
}

function renderEtalase(d) {
    return `<div class="bg-white p-4 rounded-xl shadow-sm border text-center">
        <img src="${d.FotoProduk}" class="w-20 h-20 mx-auto rounded-full object-cover mb-3">
        <h3 class="font-bold text-sm">${d.NamaBisnis}</h3>
        <p class="text-gray-500 text-[10px] mb-4">${d.Deskripsi}</p>
        <a href="https://wa.me/${d.WhatsApp}" target="_blank" class="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">WhatsApp</a>
    </div>`;
}

// Inisialisasi awal
window.addEventListener('DOMContentLoaded', () => changePage('Database'));

import axios from 'axios';
import { getSpreadsheetConfig } from '../config/firebase';

let cachedWebAppUrl = null;

const getWebAppUrl = async () => {
  if (cachedWebAppUrl) return cachedWebAppUrl;
  
  try {
    // Ambil konfigurasi dari Firebase Realtime Database
    const config = await getSpreadsheetConfig();
    if (config && config.spreadsheet_url) {
      cachedWebAppUrl = config.spreadsheet_url;
      console.log('Web App URL loaded from Firebase:', cachedWebAppUrl);
      return cachedWebAppUrl;
    } else {
      throw new Error('spreadsheet_url tidak ditemukan di Firebase');
    }
  } catch (error) {
    console.error('Error getting web app URL from Firebase:', error);
    throw new Error('Gagal mengambil konfigurasi spreadsheet dari server');
  }
};

// JSONP untuk GET
const jsonpRequest = (url) => {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');
    window[callbackName] = (data) => {
      delete window[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };
    script.src = `${url}&callback=${callbackName}`;
    script.onerror = () => {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(new Error('JSONP request failed'));
    };
    document.body.appendChild(script);
  });
};

// Submit via iframe (tidak membaca response karena CORS, tetap dianggap sukses)
const submitViaIframe = (url, data) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    const iframeName = 'hidden_iframe_' + Date.now();
    iframe.name = iframeName;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = iframeName;
    form.style.display = 'none';
    const dataField = document.createElement('input');
    dataField.type = 'hidden';
    dataField.name = 'data';
    dataField.value = JSON.stringify(data);
    form.appendChild(dataField);
    const actionField = document.createElement('input');
    actionField.type = 'hidden';
    actionField.name = 'action';
    actionField.value = 'submitSaran';
    form.appendChild(actionField);
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    const timeout = setTimeout(() => {
      cleanup();
      resolve({ status: 'success' });
    }, 10000);
    const cleanup = () => {
      clearTimeout(timeout);
      if (document.body.contains(form)) document.body.removeChild(form);
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    };
    iframe.onload = () => {
      cleanup();
      resolve({ status: 'success' });
    };
    iframe.onerror = () => {
      cleanup();
      resolve({ status: 'success' });
    };
    form.submit();
  });
};

// Kompresi gambar menjadi base64 (ukuran lebih kecil)
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > 1024 * 1024) {
      reject(new Error('Ukuran file maksimal 1MB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 600;
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Submit multiple saran (masing-masing dengan foto sendiri)
export const submitSaran = async (data) => {
  try {
    const webAppUrl = await getWebAppUrl();
    const saranItemsWithPhoto = [];
    for (let i = 0; i < data.saranItems.length; i++) {
      const saran = data.saranItems[i];
      let photoBase64 = '';
      if (saran.fotoPendukung && saran.fotoPendukung.length > 0) {
        try {
          photoBase64 = await compressImage(saran.fotoPendukung[0]);
          console.log(`✅ Saran ${i+1} foto berhasil, panjang: ${photoBase64.length}`);
        } catch (err) {
          console.warn(`⚠️ Saran ${i+1} foto gagal:`, err.message);
        }
      }
      saranItemsWithPhoto.push({
        deskripsiSaran: saran.deskripsiSaran,
        manfaatDiharapkan: saran.manfaatDiharapkan || '',
        klasifikasiSaran: saran.klasifikasiSaran,
        lokasiInspeksi: saran.lokasiInspeksi,
        prioritas: saran.prioritas,
        fotoPendukung: photoBase64
      });
    }
    const payload = {
      judulSaran: data.judulSaran || '',
      tipeIdentitas: data.tipeIdentitas,
      nama: data.nama || '',
      noHp: data.noHp || '',
      email: data.email || '',
      itikadBaik: data.itikadBaik,
      saranItems: saranItemsWithPhoto
    };
    await submitViaIframe(webAppUrl, payload);
    return { success: true };
  } catch (error) {
    console.error('❌ Submit error:', error);
    throw new Error(error.message || 'Gagal mengirim saran');
  }
};

// Helper case-insensitive
function getValue(obj, key) {
  if (!obj) return undefined;
  if (obj.hasOwnProperty(key)) return obj[key];
  const lowerKey = key.toLowerCase();
  for (let k in obj) if (k.toLowerCase() === lowerKey) return obj[k];
  return undefined;
}

export const getKlasifikasiSaran = async () => {
  try {
    const webAppUrl = await getWebAppUrl();
    const data = await jsonpRequest(`${webAppUrl}?action=getKlasifikasiSaran`);
    if (data?.status === 'success') {
      let items = data.data || [];
      items = items.filter(item => { const s = getValue(item, 'Status'); return s && s.toLowerCase() === 'aktif'; });
      return items.map(item => ({
        ID: getValue(item, 'ID') || getValue(item, 'id'),
        'Nama Saran': getValue(item, 'Nama Saran') || getValue(item, 'nama saran'),
        Status: getValue(item, 'Status') || getValue(item, 'status'),
        ...item
      }));
    }
    return [];
  } catch (error) { console.error(error); return []; }
};

export const getLokasiInspeksi = async () => {
  try {
    const webAppUrl = await getWebAppUrl();
    const data = await jsonpRequest(`${webAppUrl}?action=getLokasiInspeksi`);
    if (data?.status === 'success') {
      let items = data.data || [];
      items = items.filter(item => { const s = getValue(item, 'Status'); return s && s.toLowerCase() === 'aktif'; });
      return items.map(item => ({
        ID: getValue(item, 'ID') || getValue(item, 'id'),
        'Lokasi Inspeksi': getValue(item, 'Lokasi Inspeksi') || getValue(item, 'lokasi inspeksi'),
        area: getValue(item, 'area') || getValue(item, 'Area'),
        Status: getValue(item, 'Status') || getValue(item, 'status'),
        ...item
      }));
    }
    return [];
  } catch (error) { console.error(error); return []; }
};

export const getPrioritas = async () => {
  try {
    const webAppUrl = await getWebAppUrl();
    const data = await jsonpRequest(`${webAppUrl}?action=getPrioritas`);
    if (data?.status === 'success') {
      let items = data.data || [];
      items = items.filter(item => { const s = getValue(item, 'Status'); return s && s.toLowerCase() === 'aktif'; });
      return items.map(item => ({
        ID: getValue(item, 'ID') || getValue(item, 'id'),
        'nama prioritas': getValue(item, 'nama prioritas') || getValue(item, 'Nama Prioritas'),
        Status: getValue(item, 'Status') || getValue(item, 'status'),
        ...item
      }));
    }
    return [];
  } catch (error) { console.error(error); return []; }
};
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, CircularProgress, Stepper, Step, StepLabel,
  Button, useTheme, useMediaQuery, Snackbar, Alert
} from '@mui/material';
import Step0Identitas from './steps/Step0Identitas';
import Step1DetailSaran from './steps/Step1DetailSaran';
import Step2Konfirmasi from './steps/Step2Konfirmasi';
import { submitSaran, getKlasifikasiSaran, getLokasiInspeksi, getPrioritas } from '../services/spreadsheetService';

const steps = ['Identitas', 'Detail Saran', 'Kirim'];

const FormSaran = ({ onSuccess, onReset }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [klasifikasiList, setKlasifikasiList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);
  const [prioritasList, setPrioritasList] = useState([]);
  const [identitasData, setIdentitasData] = useState({ tipeIdentitas: 'anonim', nama: '', noHp: '', email: '' });
  const [judulUtama, setJudulUtama] = useState('');
  const [saranList, setSaranList] = useState([]);
  const [currentSaran, setCurrentSaran] = useState({
    klasifikasiSaran: '', lokasiInspeksi: '', deskripsiSaran: '', manfaatDiharapkan: '', prioritas: '', fotoPendukung: []
  });
  const [itikadBaik, setItikadBaik] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { loadMasterData(); }, []);

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const loadMasterData = async () => {
    try {
      setLoading(true);
      const [klasifikasi, lokasi, prioritas] = await Promise.all([getKlasifikasiSaran(), getLokasiInspeksi(), getPrioritas()]);
      setKlasifikasiList(klasifikasi.filter(item => item.Status === 'aktif'));
      setLokasiList(lokasi.filter(item => item.Status === 'aktif'));
      setPrioritasList(prioritas.filter(item => item.Status === 'aktif'));
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data: ' + error.message, 'error');
    } finally { setLoading(false); }
  };

  const handleIdentitasChange = (field, value) => setIdentitasData(prev => ({ ...prev, [field]: value }));
  const handleCurrentSaranChange = (field, value) => setCurrentSaran(prev => ({ ...prev, [field]: value }));

  const validateCurrentSaran = () => {
    if (!currentSaran.klasifikasiSaran) return 'Klasifikasi saran wajib dipilih';
    if (!currentSaran.lokasiInspeksi) return 'Lokasi inspeksi wajib dipilih';
    if (!currentSaran.deskripsiSaran.trim()) return 'Deskripsi saran wajib diisi';
    if (!currentSaran.prioritas) return 'Prioritas wajib dipilih';
    return true;
  };

  const handleAddSaran = () => {
    const validation = validateCurrentSaran();
    if (validation !== true) { 
      showToast(validation, 'warning');
      return; 
    }
    setSaranList(prev => [...prev, { ...currentSaran, id: Date.now() }]);
    setCurrentSaran({
      klasifikasiSaran: '', lokasiInspeksi: '', deskripsiSaran: '', manfaatDiharapkan: '', prioritas: '', fotoPendukung: []
    });
    showToast('Saran ditambahkan ke daftar.', 'success');
  };

  const handleRemoveSaran = (id) => setSaranList(prev => prev.filter(item => item.id !== id));

  const handleSubmitAll = async () => {
    if (saranList.length === 0) { 
      showToast('Belum ada saran.', 'warning');
      return; 
    }
    if (!itikadBaik) { 
      showToast('Harap centang itikad baik', 'warning');
      return; 
    }
    setSubmitting(true);
    try {
      const payload = {
        judulSaran: judulUtama,
        tipeIdentitas: identitasData.tipeIdentitas,
        nama: identitasData.nama,
        noHp: identitasData.noHp,
        email: identitasData.email,
        itikadBaik: itikadBaik,
        saranItems: saranList.map(saran => ({
          deskripsiSaran: saran.deskripsiSaran,
          manfaatDiharapkan: saran.manfaatDiharapkan || '',
          klasifikasiSaran: saran.klasifikasiSaran,
          lokasiInspeksi: saran.lokasiInspeksi,
          prioritas: saran.prioritas,
          fotoPendukung: saran.fotoPendukung
        }))
      };
      await submitSaran(payload);
      showToast(`Berhasil! ${saranList.length} saran dikirim.`, 'success');
      onSuccess();
      setIdentitasData({ tipeIdentitas: 'anonim', nama: '', noHp: '', email: '' });
      setJudulUtama('');
      setSaranList([]);
      setCurrentSaran({ klasifikasiSaran: '', lokasiInspeksi: '', deskripsiSaran: '', manfaatDiharapkan: '', prioritas: '', fotoPendukung: [] });
      setItikadBaik(false);
      setActiveStep(0);
      onReset();
    } catch (error) {
      showToast('Gagal mengirim: ' + error.message, 'error');
    } finally { setSubmitting(false); }
  };

  const validateStep = () => {
    if (activeStep === 0 && identitasData.tipeIdentitas === 'identitas' && !identitasData.nama.trim()) {
      showToast('Nama wajib diisi', 'warning');
      return false;
    }
    return true;
  };

  const handleNext = () => { 
    if (validateStep() === true) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => setActiveStep(prev => prev - 1);

  const renderStepper = () => (
    <Stepper activeStep={activeStep} sx={{ mb: 4, overflowX: 'auto', '& .MuiStepLabel-root': { flexDirection: isMobile ? 'column' : 'row' } }}>
      {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
    </Stepper>
  );

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Step0Identitas
          identitasData={identitasData}
          handleIdentitasChange={handleIdentitasChange}
          judulUtama={judulUtama}
          setJudulUtama={setJudulUtama}
          isMobile={isMobile}
        />
      );
    }
    if (activeStep === 1) {
      return (
        <Step1DetailSaran
          currentSaran={currentSaran}
          handleCurrentSaranChange={handleCurrentSaranChange}
          klasifikasiList={klasifikasiList}
          lokasiList={lokasiList}
          prioritasList={prioritasList}
          handleAddSaran={handleAddSaran}
          saranList={saranList}
          handleRemoveSaran={handleRemoveSaran}
        />
      );
    }
    return (
      <Step2Konfirmasi
        judulUtama={judulUtama}
        identitasData={identitasData}
        saranList={saranList}
        itikadBaik={itikadBaik}
        setItikadBaik={setItikadBaik}
        submitting={submitting}
        handleSubmitAll={handleSubmitAll}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          bgcolor: '#f0f4f9',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 2 }
          }}
        >
          {renderStepper()}
          <Box
            sx={{ minHeight: 500 }}>
              {renderStepContent()}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              gap: 2,
            }}>
            <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0} fullWidth={isMobile}>Kembali</Button>
            {activeStep !== steps.length - 1 && (
              <Button variant="contained" onClick={handleNext} fullWidth={isMobile}>Selanjutnya</Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Toast / Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FormSaran;
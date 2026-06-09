import React from 'react';
import {
  Box, Paper, Alert, FormControlLabel, Checkbox, Button,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const Step2Konfirmasi = ({
  judulUtama,
  identitasData,
  saranList,
  itikadBaik,
  setItikadBaik,
  submitting,
  handleSubmitAll
}) => {
  return (
    <Box sx={{ textAlign: 'left' }}>  {/* <-- TAMBAHKAN INI */}
      <h3 style={{ margin: '0 0 12px 0', fontSize: 'inherit', fontWeight: 500, textAlign: 'left' }}>
        Konfirmasi Pengiriman
      </h3>
      
      <Paper sx={{ p: { xs: 2, sm: 2 }, borderRadius: 2, textAlign: 'left' }}>  {/* <-- TAMBAHKAN INI */}
        <Box sx={{ mb: 2 }}>
          {/* Judul Saran */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{ width: 160, fontWeight: 500, textAlign: 'left' }}>
              Judul Saran
            </Box>
            <Box sx={{ mr: 1 }}>:</Box>
            <Box>
              {judulUtama || '(Tidak diisi)'}
            </Box>
          </Box>

          {/* Identitas Pengirim */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{ width: 160, fontWeight: 500, textAlign: 'left' }}>
              Identitas Pengirim
            </Box>
            <Box sx={{ mr: 1 }}>:</Box>
            <Box>
              {identitasData.tipeIdentitas === 'anonim'
                ? 'Anonim'
                : `${identitasData.nama}${
                    identitasData.noHp ? ` - ${identitasData.noHp}` : ''
                  }${
                    identitasData.email ? ` - ${identitasData.email}` : ''
                  }`}
            </Box>
          </Box>

          {/* Jumlah Saran */}
          <Box sx={{ display: 'flex', mb: 1 }}>
            <Box sx={{ width: 160, fontWeight: 500, textAlign: 'left' }}>
              Jumlah Saran
            </Box>
            <Box sx={{ mr: 1 }}>:</Box>
            <Box sx={{ color: 'primary.main', fontWeight: 600 }}>
              {saranList.length} Saran
            </Box>
          </Box>
        </Box>
        
        {saranList.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
            Belum ada saran. Klik "Kembali" untuk menambah.
          </Alert>
        )}
        
        {/* Checkbox */}
        <FormControlLabel
          control={
            <Checkbox 
              checked={itikadBaik} 
              onChange={(e) => setItikadBaik(e.target.checked)} 
              color="primary" 
            />
          } 
          label="Saya menyampaikan saran ini dengan itikad baik"
          sx={{ 
            textAlign: 'left',
            marginLeft: 0,
            marginRight: 0
          }}
        />
        
        <Button
         
          variant="contained" 
          color="primary" 
          onClick={handleSubmitAll} 
          disabled={submitting || saranList.length === 0 || !itikadBaik} 
          startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />} 
          fullWidth 
          size="medium" 
          sx={{ mt: 2, borderRadius: '4px' }}
        >
          {submitting ? 'Mengirim...' : `Kirim ${saranList.length} Saran`}
        </Button>
      </Paper>
    </Box>
  );
};

export default Step2Konfirmasi;
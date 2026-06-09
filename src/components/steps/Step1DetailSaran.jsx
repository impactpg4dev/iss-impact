import React from 'react';
import {
  Box, Paper, Typography, Grid, TextField, FormControl, InputLabel,
  Select, MenuItem, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import InputFoto from '../InputFoto';

const Step1DetailSaran = ({
  currentSaran,
  handleCurrentSaranChange,
  klasifikasiList,
  lokasiList,
  prioritasList,
  handleAddSaran,
  saranList,
  handleRemoveSaran
}) => {
  return (
    <Box>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 'inherit', fontWeight: 500, textAlign:'left' }}>
            Tambah Saran
          </h3>
<Paper
  elevation={0}
  sx={{ p: { xs: 2, sm: 2 }, mb: 2, bgcolor: "#FFFFFF", borderRadius: 2 }}
>
  <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            "& > *": { flex: 1 },
          }}
        >
        <FormControl fullWidth required>
              <InputLabel>Klasifikasi Saran</InputLabel>
              <Select 
                value={currentSaran.klasifikasiSaran || ''} 
                label="Klasifikasi Saran" 
                onChange={(e) => handleCurrentSaranChange('klasifikasiSaran', e.target.value)}
              >
                {klasifikasiList.map(item => (
                  <MenuItem key={item.ID} value={item.ID}>{item['Nama Saran']}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Lokasi Inspeksi</InputLabel>
              <Select 
                value={currentSaran.lokasiInspeksi || ''} 
                label="Lokasi Inspeksi" 
                onChange={(e) => handleCurrentSaranChange('lokasiInspeksi', e.target.value)}
              >
                {lokasiList.map(item => (
                  <MenuItem key={item.ID} value={item.ID}>{item['Lokasi Inspeksi']} - {item.area}</MenuItem>
                ))}
              </Select>
            </FormControl>
        </Box>

        <TextField 
          sx={{mt:2}}
              fullWidth 
              label="Deskripsi Saran" 
              required 
              multiline 
              rows={3} 
              value={currentSaran.deskripsiSaran} 
              onChange={(e) => handleCurrentSaranChange('deskripsiSaran', e.target.value)} 
            />

            <TextField
            sx={{mt:2}} 
              fullWidth 
              label="Manfaat yang Diharapkan (Opsional)" 
              multiline 
              rows={2} 
              value={currentSaran.manfaatDiharapkan} 
              onChange={(e) => handleCurrentSaranChange('manfaatDiharapkan', e.target.value)} 
            />

            <FormControl fullWidth required sx={{mt:2}}>
              <InputLabel>Prioritas</InputLabel>
              <Select 
                value={currentSaran.prioritas || ''} 
                label="Prioritas" 
                onChange={(e) => handleCurrentSaranChange('prioritas', e.target.value)}
              >
                {prioritasList.map(item => (
                  <MenuItem key={item.ID} value={item.ID}>{item['nama prioritas']}</MenuItem>
                ))}
              </Select>
            </FormControl>

<Box sx={{ mt: 2 }}>
  <InputFoto 
    value={currentSaran.fotoPendukung} 
    onChange={(files) => handleCurrentSaranChange('fotoPendukung', files)} 
  />
</Box>

<Button 
  variant="contained" 
  color="secondary" 
  startIcon={<AddIcon />} 
  onClick={handleAddSaran} 
  fullWidth 
  size="medium" 
  sx={{ 
    mt:2,
    borderRadius: '4px'  // radius 4px untuk button
  }}
>
  Tambah Saran ke Daftar
</Button>
      </Paper>

      {saranList.length > 0 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 'inherit', fontWeight: 500, textAlign:'center' }}>
            Daftar Saran yang Akan Dikirim ({saranList.length})
          </h3>
          <List disablePadding>
            {saranList.map((saran, index) => (
              <ListItem key={saran.id} divider sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {`${index + 1}. ${klasifikasiList.find(k => k.ID === saran.klasifikasiSaran)?.['Nama Saran'] || 'Klasifikasi tidak ditemukan'}`}
                  </Typography>
                  <IconButton edge="end" onClick={() => handleRemoveSaran(saran.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Lokasi: {lokasiList.find(l => l.ID === saran.lokasiInspeksi)?.['Lokasi Inspeksi'] || saran.lokasiInspeksi} | 
                  Prioritas: {prioritasList.find(p => p.ID === saran.prioritas)?.['nama prioritas'] || saran.prioritas}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {saran.deskripsiSaran.length > 100 ? saran.deskripsiSaran.substring(0, 100) + '...' : saran.deskripsiSaran}
                </Typography>
                {saran.fotoPendukung.length > 0 && (
                  <Typography variant="caption" sx={{ mt: 0.5 }}>
                    📷 {saran.fotoPendukung.length} foto
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Step1DetailSaran;
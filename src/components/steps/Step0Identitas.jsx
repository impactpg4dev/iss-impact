import React from 'react';
import {
  Box, Paper, Typography, TextField, RadioGroup, Radio, FormControlLabel,
  FormControl, FormLabel, useTheme, useMediaQuery
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Step0Identitas = ({
  identitasData,
  handleIdentitasChange,
  judulUtama,
  setJudulUtama,
  isMobile
}) => {
  const theme = useTheme();
  const isMobileScreen = isMobile !== undefined ? isMobile : useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {/* Bagian 1: Opsi Pengisi Kotak Saran */}
      <h3 style={{ margin: '0 0 12px 0', fontSize: 'inherit', fontWeight: 500, textAlign:'left' }}>
            Opsi Pengisi Kotak Saran
          </h3>
<Paper
  elevation={0}
  sx={{ p: { xs: 2, sm: 2 }, mb: 2, bgcolor: "#FFFFFF", borderRadius: 2 }}
>
  <FormControl component="fieldset" sx={{ width: "100%" }}>
    <RadioGroup
      row={!isMobileScreen}
      value={identitasData.tipeIdentitas}
      onChange={(e) => handleIdentitasChange("tipeIdentitas", e.target.value)}
    >
      <FormControlLabel value="anonim" control={<Radio />} label="Anonim" />
      <FormControlLabel value="identitas" control={<Radio />} label="Tambahkan Identitas" />
    </RadioGroup>
  </FormControl>
  
  {/* Form Identitas - HANYA muncul jika memilih "Tambahkan Identitas" */}
  {identitasData.tipeIdentitas === "identitas" && (
    <Box sx={{ mt: 2 }}>  {/* <- margin top untuk jarak dengan radio group */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          "& > *": { flex: 1 },
        }}
      >
        <TextField
          fullWidth
          label="Nama"
          required
          value={identitasData.nama}
          onChange={(e) => handleIdentitasChange("nama", e.target.value)}
          size="medium"
        />
        <TextField
          fullWidth
          label="No HP"
          value={identitasData.noHp}
          onChange={(e) => handleIdentitasChange("noHp", e.target.value)}
          size="medium"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={identitasData.email}
          onChange={(e) => handleIdentitasChange("email", e.target.value)}
          size="medium"
        />
      </Box>
    </Box>
  )}
</Paper>

      

      {/* Bagian 2: Judul Saran */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 2 }, mb: 2, bgcolor: "#FFFFFF", borderRadius: 2 }}>
        <TextField
          fullWidth
          label="Judul Saran"
          placeholder="Masukkan judul untuk semua saran"
          value={judulUtama}
          onChange={(e) => setJudulUtama(e.target.value)}
          helperText="Judul akan digunakan untuk semua saran yang Anda buat"
        />
      </Paper>

      {/* Bagian 3: Informasi */}
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, bgcolor: "rgba(11, 87, 208, 0.24)", borderRadius: 2 }}>
        <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoOutlinedIcon/>
          Setelah mengisi identitas dan judul, klik "Selanjutnya" untuk menambahkan detail saran.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Step0Identitas;
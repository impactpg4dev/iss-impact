import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import FormSaran from './components/FormSaran';
import AlertDialog from './components/AlertDialog';

// URL gambar
const HEADER_IMAGE_URL = 'https://agri.terra-drone.co.id/wp-content/uploads/2023/07/GGF-1024x528.png';

// Buat theme Material Design
const theme = createTheme({
  palette: {
    primary: { main: '#197b40' },
    secondary: { main: '#fba919' },
  },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 8, textTransform: 'none' } } },
  },
});

function App() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat konfigurasi aplikasi');
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const handleSuccess = () => {
    setDialogMessage('Terima kasih! Saran Anda telah berhasil dikirim dan akan segera kami tindak lanjuti.');
    setOpenDialog(true);
  };

  const handleReset = () => {};

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 2 }}>
        <Container maxWidth="md">
          {/* Header dengan gambar di kiri, teks rata kiri */}
<Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 2,
    bgcolor: '#f0f4f9',
    borderRadius: 2
  }}
>
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      textAlign: { xs: 'center', sm: 'left' }
    }}
  >
    {/* Gambar 
    <Box
      component="img"
      src={HEADER_IMAGE_URL}
      alt="Kotak Saran Icon"
      sx={{
        width: { xs: 124, sm: 124 },
        height: { xs: 64, sm: 64 },
      }}
    />*/}
    
    {/* Teks */}
    <Box>
      <h1 style={{ 
        margin: 0, 
        marginBottom: '8px',
        color: '#1a237e'
      }}>
        Improvement Suggestion System
      </h1>
      <h2 style={{ 
        margin: 0,
        color: '#37474f',
        fontWeight: 'normal'
      }}>
        Kotak Saran & Kritik Kantor Production Planning
      </h2>
    </Box>
  </Box>
</Paper>

          <FormSaran onSuccess={handleSuccess} onReset={handleReset} />

          <AlertDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            title="Sukses!"
            message={dialogMessage}
            type="success"
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
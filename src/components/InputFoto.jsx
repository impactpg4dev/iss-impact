import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Paper, Grid } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

const InputFoto = ({ onChange, value = [] }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    previews.forEach(url => URL.revokeObjectURL(url));
    if (value.length === 0) {
      setPreviews([]);
    } else {
      const newPreviews = value.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  }, [value]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews(newPreviews);
    onChange([...value, ...files]);
  };

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = value.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <Box>
      <Button
        component="label"
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 1, textTransform: 'none', borderRadius: '4px' }}
        fullWidth
        size='large'
      >
        Upload Foto Pendukung
        <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
      </Button>
      <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
        Format: JPG, PNG, GIF (Maks 5MB per file)
      </Typography>
      {previews.length > 0 && (
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {previews.map((preview, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper sx={{ position: 'relative', p: 0.5, borderRadius: 2 }}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}
                  onClick={() => handleRemoveFile(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default InputFoto;
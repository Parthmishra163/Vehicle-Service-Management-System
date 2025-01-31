import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ComponentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    repair_price: '',
    purchase_price: '',
    stock: ''
  });

  const [components, setComponents] = useState([]);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/components/');
        setComponents(response.data);
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };

    fetchComponents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/components/', formData);
      alert('Component registered successfully!');
      setComponents([...components, response.data]);
      setFormData({ name: '', repair_price: '', purchase_price: '', stock: '' });
    } catch (error) {
      alert('Error registering component');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, my: 4 }}>
      <Typography variant="h6" gutterBottom>Register New Component</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Component Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Repair Price (Rs)"
              type="number"
              value={formData.repair_price}
              onChange={(e) => setFormData({ ...formData, repair_price: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Price (Rs)"
              type="number"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Register Component
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        List of Components
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}> 
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Repair Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Purchase Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.id}>
                <TableCell>{component.name}</TableCell>
                <TableCell>{component.repair_price}</TableCell>
                <TableCell>{component.purchase_price}</TableCell>
                <TableCell>{component.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ComponentForm;
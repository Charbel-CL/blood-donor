import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', location: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Simulate fetching hospitals from an API
    setHospitals([
      { name: 'Hospital A', location: 'Location A' },
      { name: 'Hospital B', location: 'Location B' },
    ]);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({ name: '', location: '' });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEditHospital = () => {
    if (editIndex !== null) {
      const updatedHospitals = [...hospitals];
      updatedHospitals[editIndex] = formValues;
      setHospitals(updatedHospitals);
    } else {
      setHospitals([...hospitals, formValues]);
    }
    handleCloseDialog();
  };

  const handleEditHospital = (index) => {
    setFormValues(hospitals[index]);
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteHospital = (index) => {
    setHospitals(hospitals.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Manage Hospitals
      </Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDialog}>
        Add Hospital
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hospital Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hospitals.map((hospital, index) => (
            <TableRow key={index}>
              <TableCell>{hospital.name}</TableCell>
              <TableCell>{hospital.location}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEditHospital(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteHospital(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit Hospital' : 'Add Hospital'}</DialogTitle>
        <DialogContent sx={{ minHeight: '300px' }}>
          <TextField
            margin="dense"
            label="Hospital Name"
            name="name"
            value={formValues.name}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            value={formValues.location}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEditHospital} color="primary">
            {editIndex !== null ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HospitalManagement;

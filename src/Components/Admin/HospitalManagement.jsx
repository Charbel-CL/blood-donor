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
import axios from 'axios';

const API_KEY = 'e0d03330b1bc40f3b07fa65f9befaa09'; 

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    hospital_id: '',
    name: '',
    address: '',
    contact_number: '',
    lat: '',
    lng: '',
    email: '',
    rating: '',
    image: ''
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:5212/api/Hospitals');
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({
      hospital_id: '',
      name: '',
      address: '',
      contact_number: '',
      lat: '',
      lng: '',
      email: '',
      rating: '',
      image: ''
    });
    setEditIndex(null);
  };

  const handleFormChange = async (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'address') {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&key=${API_KEY}`);
      const { lat, lng } = response.data.results[0].geometry;
      setFormValues((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    }
  };

  const handleAddEditHospital = async () => {
    const payload = {
      name: formValues.name,
      address: formValues.address,
      contact_number: formValues.contact_number,
      lat: formValues.lat,
      lng: formValues.lng,
      email: formValues.email,
      rating: formValues.rating,
      image: formValues.image,
    };

    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:5212/api/Hospitals/${hospitals[editIndex].hospital_id}`, payload);
      } else {
        await axios.post('http://localhost:5212/api/Hospitals', payload);
      }
      fetchHospitals();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving hospital:', error);
    }
  };

  const handleEditHospital = (index) => {
    setFormValues(hospitals[index]);
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteHospital = async (index) => {
    try {
      await axios.delete(`http://localhost:5212/api/Hospitals/${hospitals[index].hospital_id}`);
      setHospitals(hospitals.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
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
            <TableCell>Address</TableCell>
            <TableCell>Contact Number</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hospitals.map((hospital, index) => (
            <TableRow key={index}>
              <TableCell>{hospital.name}</TableCell>
              <TableCell>{hospital.address}</TableCell>
              <TableCell>{hospital.contact_number}</TableCell>
              <TableCell>{hospital.lat}</TableCell>
              <TableCell>{hospital.lng}</TableCell>
              <TableCell>{hospital.email}</TableCell>
              <TableCell>{hospital.rating}</TableCell>
              <TableCell>{hospital.image}</TableCell>
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
            label="Address"
            name="address"
            value={formValues.address}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Contact Number"
            name="contact_number"
            value={formValues.contact_number}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Latitude"
            name="lat"
            value={formValues.lat}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Longitude"
            name="lng"
            value={formValues.lng}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formValues.email}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Rating"
            name="rating"
            value={formValues.rating}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Image"
            name="image"
            value={formValues.image}
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

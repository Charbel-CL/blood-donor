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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const BloodManagement = () => {
  const [bloodRecords, setBloodRecords] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({ type: '', quantity: '', hospitals: [] });
  const [editIndex, setEditIndex] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    // Simulate fetching blood records from an API
    setBloodRecords([
      { type: 'A+', quantity: 10, hospitals: ['Hospital A', 'Hospital B'] },
      { type: 'B-', quantity: 5, hospitals: ['Hospital C'] },
    ]);

    // Simulate fetching hospitals from an API
    setHospitals(['Hospital A', 'Hospital B', 'Hospital C']);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({ type: '', quantity: '', hospitals: [] });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEditBlood = () => {
    if (editIndex !== null) {
      const updatedRecords = [...bloodRecords];
      updatedRecords[editIndex] = formValues;
      setBloodRecords(updatedRecords);
    } else {
      setBloodRecords([...bloodRecords, formValues]);
    }
    handleCloseDialog();
  };

  const handleEditBlood = (index) => {
    setFormValues(bloodRecords[index]);
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteBlood = (index) => {
    setBloodRecords(bloodRecords.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Manage Blood
      </Typography>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDialog}>
        Add Blood
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Blood Type</TableCell>
            <TableCell>Quantity (units)</TableCell>
            <TableCell>Hospitals</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bloodRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.quantity}</TableCell>
              <TableCell>{record.hospitals.join(', ')}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleEditBlood(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleDeleteBlood(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editIndex !== null ? 'Edit Blood' : 'Add Blood'}</DialogTitle>
        <DialogContent sx={{ minHeight: '300px' }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Blood Type</InputLabel>
            <Select
              label="Blood Type"
              name="type"
              value={formValues.type}
              onChange={handleFormChange}
            >
              {bloodTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Quantity (units)"
            name="quantity"
            value={formValues.quantity}
            onChange={handleFormChange}
            type="number"
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Hospitals</InputLabel>
            <Select
              name="hospitals"
              multiple
              value={formValues.hospitals}
              onChange={handleFormChange}
              renderValue={(selected) => selected.length ? selected.join(', ') : 'Select Hospitals'}
            >
              {hospitals.map((hospital) => (
                <MenuItem key={hospital} value={hospital}>
                  <Checkbox checked={formValues.hospitals.indexOf(hospital) > -1} />
                  <ListItemText primary={hospital} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEditBlood} color="primary">
            {editIndex !== null ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BloodManagement;

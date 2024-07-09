import React, { useState, useEffect } from "react";
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
  Box
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_KEY = "e0d03330b1bc40f3b07fa65f9befaa09";

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    hospital_id: "",
    name: "",
    address: "",
    contact_number: "",
    lat: "",
    lng: "",
    email: "",
    rating: "",
    image: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/Hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({
      hospital_id: "",
      name: "",
      address: "",
      contact_number: "",
      lat: "",
      lng: "",
      email: "",
      rating: "",
      image: "",
    });
    setEditIndex(null);
    setSelectedFile(null);
  };

  const handleFormChange = async (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "address") {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          value
        )}&key=${API_KEY}`
      );
      const { lat, lng } = response.data.results[0].geometry;
      setFormValues((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleAddEditHospital = async () => {
    let imageUrl = formValues.image;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await axios.post(
          "http://localhost:5212/api/Upload/UploadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    const rating = parseFloat(formValues.rating);
    if (rating < 1 || rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }

    const payload = {
      hospital_id: formValues.hospital_id || undefined, // Exclude if empty
      name: formValues.name,
      address: formValues.address,
      contact_number: formValues.contact_number,
      lat: formValues.lat,
      lng: formValues.lng,
      email: formValues.email,
      rating,
      image: imageUrl,
    };

    try {
      if (editIndex !== null) {
        await axios.put(
          `http://localhost:5212/api/Hospitals/${hospitals[editIndex].hospital_id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5212/api/Hospitals", payload);
      }
      fetchHospitals();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving hospital:", error);
    }
  };

  const handleEditHospital = (index) => {
    setFormValues(hospitals[index]);
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteHospital = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5212/api/Hospitals/${hospitals[index].hospital_id}`
      );
      setHospitals(hospitals.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const handleOpenImageDialog = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedImage("");
  };

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Manage Hospitals
        </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
      >
        Add Hospital
      </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Number</TableCell>
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
              <TableCell style={{ width: "300px" }}>{hospital.name}</TableCell>
              <TableCell style={{ width: "220px" }}>
                {hospital.address}
              </TableCell>
              <TableCell style={{ width: "220px" }}>
                {hospital.contact_number}
              </TableCell>
              <TableCell>{hospital.lat}</TableCell>
              <TableCell>{hospital.lng}</TableCell>
              <TableCell>{hospital.email}</TableCell>
              <TableCell>{hospital.rating}</TableCell>
              <TableCell>
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  width="50"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenImageDialog(hospital.image)}
                />
              </TableCell>
              <TableCell style={{ width: "220px" }}>
                <IconButton
                  color="primary"
                  onClick={() => handleEditHospital(index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteHospital(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex !== null ? "Edit Hospital" : "Add Hospital"}
        </DialogTitle>
        <DialogContent sx={{ minHeight: "300px" }}>
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
            disabled
          />
          <TextField
            margin="dense"
            label="Longitude"
            name="lng"
            value={formValues.lng}
            fullWidth
            disabled
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
            type="number"
            inputProps={{ min: 1, max: 5, step: 0.1 }}
            fullWidth
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
              Upload Image
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2">{selectedFile.name}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEditHospital} color="primary">
            {editIndex !== null ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HospitalManagement;

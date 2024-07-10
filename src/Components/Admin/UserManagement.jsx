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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    dob: "",
    gender: "",
    address: "",
    bloodType: "",
    password_hash: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const roles = ["Admin", "Donor"];
  const genders = ["Male", "Female"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/Users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({
      user_id: "",
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      dob: "",
      gender: "",
      address: "",
      bloodType: "",
      password_hash: "",
    });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value !== null ? value : "",
    }));
  };

  const handleAddEditUser = async () => {
    const dob = new Date(formValues.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    const ageCheckDate = new Date(dob.setFullYear(dob.getFullYear() + age));
    if (age < 12 || (age === 12 && ageCheckDate > new Date())) {
      alert("User must be at least 12 years old.");
      return;
    }

    const payload = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      role: formValues.role,
      dob: formValues.dob,
      gender: formValues.gender,
      address: formValues.address ?? "",
      bloodType: formValues.bloodType,
      password_hash: formValues.password_hash || undefined,
    };

    try {
      if (
        users.some(
          (user, index) =>
            user.email === formValues.email && index !== editIndex
        )
      ) {
        alert("Email already exists. Please use a different email.");
        return;
      }

      if (editIndex !== null) {
        await axios.put(
          `http://localhost:5212/api/Users/${formValues.user_id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5212/api/Users", payload);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEditUser = (index) => {
    const user = users[index];
    setFormValues({
      user_id: user.user_id,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      email: user.email ?? "",
      role: user.role ?? "",
      dob: user.dob ? user.dob.split("T")[0] : "",
      gender: user.gender
        ? capitalizeFirstLetter(user.gender.toLowerCase())
        : "",
      address: user.address ?? "",
      bloodType: user.bloodType ?? "",
      password_hash: "",
    });
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteUser = async (index) => {
    try {
      await axios.delete(
        `http://localhost:5212/api/Users/${users[index].user_id}`
      );
      setUsers(users.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
        Manage Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          handleOpenDialog();
          setFormValues({
            user_id: "",
            first_name: "",
            last_name: "",
            email: "",
            role: "",
            dob: "",
            gender: "",
            address: "",
            bloodType: "",
            password_hash: "pass",
          });
        }}
      >
        Add User
      </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleEditUser(index)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteUser(index)}
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
          {editIndex !== null ? "Edit User" : "Add User"}
        </DialogTitle>
        <DialogContent sx={{ minHeight: "300px" }}>
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            value={formValues.first_name}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="last_name"
            value={formValues.last_name}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formValues.email}
            onChange={handleFormChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={formValues.role}
              onChange={handleFormChange}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Date of Birth"
            name="dob"
            type="date"
            value={formValues.dob}
            onChange={handleFormChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="gender"
              value={formValues.gender}
              onChange={handleFormChange}
            >
              {genders.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            label="Blood Type"
            name="bloodType"
            value={formValues.bloodType}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Password"
            name="password_hash"
            type={showPassword ? "text" : "password"}
            value={formValues.password_hash}
            onChange={handleFormChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEditUser} color="primary">
            {editIndex !== null ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;

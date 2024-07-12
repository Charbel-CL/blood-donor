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
  Switch,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import usePost from "../../Hooks/usePost";

const BloodManagement = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    requestId: 0,
    blood_type: "",
    quantity: "",
    hospital_id: "",
    user_id: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialStatuses, setInitialStatuses] = useState({});

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const fetchBloodRequests = async () => {
    const url = "http://localhost:5212/api/BloodManagement/requests";
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Response is not JSON. Response text:", text);
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (Array.isArray(data)) {
        setBloodRequests(data);
        const statuses = data.reduce((acc, request) => {
          acc[request.request_id] = request.status;
          return acc;
        }, {});
        setInitialStatuses(statuses);
      } else {
        setError("Error: Blood requests data is not an array.");
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Error fetching blood requests:", error);
    }
  };

  const fetchHospitals = async () => {
    const url = "http://localhost:5212/api/BloodManagement/hospitals";
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // Read and log the text
        console.error("Response is not JSON. Response text:", text);
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (Array.isArray(data)) {
        setHospitals(data);
      } else {
        setError("Error: Hospitals data is not an array.");
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchUsers = async () => {
    const url = "http://localhost:5212/api/Users";
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // Read and log the text
        console.error("Response is not JSON. Response text:", text);
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("Error: Users data is not an array.");
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchBloodRequests();
    fetchHospitals();
    fetchUsers();
  }, []);

  const getHospitalNameById = (id) => {
    const hospital = hospitals.find((hospital) => hospital.hospital_id === id);
    return hospital ? hospital.name : "";
  };

  const getUserNameById = (id) => {
    const user = users.find((user) => user.user_id === id);
    return user ? user.first_name : "";
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormValues({
      requestId: 0,
      blood_type: "",
      quantity: "",
      hospital_id: "",
      user_id: "",
    });
    setEditIndex(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (name === "quantity") {
      const numericValue = Math.max(1, Math.min(parseInt(value, 10), 999)); 
      setFormValues((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const { postData, data, error: postError, loading: postLoading } = usePost();

  const handleAddEditBlood = async () => {
    try {
      const method = editIndex !== null ? "PUT" : "POST";
      const url =
        editIndex !== null
          ? `http://localhost:5212/api/BloodManagement/requests/${formValues.requestId}`
          : "http://localhost:5212/api/BloodManagement/requests";
      const payload = {
        request_id: formValues.requestId,
        blood_type: formValues.blood_type,
        quantity: formValues.quantity,
        hospital_id: formValues.hospital_id,
        user_id: formValues.user_id,
        status:
          editIndex !== null ? bloodRequests[editIndex].status : "Pending",
      };

      console.log("Sending request to:", url);
      console.log("Request payload:", payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchBloodRequests();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving blood request:", error);
    }
  };

  const handleEditBlood = (index) => {
    const recordToEdit = bloodRequests[index];
    console.log("Editing record:", recordToEdit);
    setFormValues({
      requestId: recordToEdit.request_id,
      blood_type: recordToEdit.blood_type,
      quantity: recordToEdit.quantity,
      hospital_id: recordToEdit.hospital_id,
      user_id: recordToEdit.user_id,
    });
    setEditIndex(index);
    handleOpenDialog();
  };

  const handleDeleteBlood = async (index) => {
    try {
      const id = bloodRequests[index].request_id;
      const response = await fetch(
        `http://localhost:5212/api/BloodManagement/requests/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchBloodRequests();
    } catch (error) {
      console.error("Error deleting blood request:", error);
    }
  };

  const handleStatusChange = async (record) => {
    try {
      // Determine the new status and adjust quantity accordingly
      const newStatus = record.status === "Pending" ? "Accept" : "Pending";
      const newQuantity =
        newStatus === "Accept" ? record.quantity - 1 : record.quantity + 1;

      // Create the updated request object
      const updatedRequest = {
        ...record,
        status: newStatus,
        quantity: newQuantity,
      };

      // Send the update request to the server
      const url = `http://localhost:5212/api/BloodManagement/requests/${record.request_id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchBloodRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" component="h2">
          Manage Blood Requests
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Blood Request
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Blood Type</TableCell>
            <TableCell>Quantity (units)</TableCell>
            <TableCell>Hospital Name</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(bloodRequests) &&
            bloodRequests.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.blood_type}</TableCell>
                <TableCell>{record.quantity}</TableCell>
                <TableCell>{getHospitalNameById(record.hospital_id)}</TableCell>
                <TableCell>{getUserNameById(record.user_id)}</TableCell>
                <TableCell>
                  <Switch
                    checked={record.status === "Accept"}
                    onChange={() => handleStatusChange(record)}
                    name="status"
                    color="primary"
                  />
                  {record.status}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditBlood(index)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteBlood(index)}
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
          {editIndex !== null ? "Edit Blood Request" : "Add Blood Request"}
        </DialogTitle>
        <DialogContent sx={{ minHeight: "300px" }}>
          <FormControl fullWidth margin="dense" sx={{ marginBottom: "20px" }}>
            <InputLabel>Blood Type</InputLabel>
            <Select
              label="Blood Type"
              name="blood_type"
              value={formValues.blood_type}
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
            InputProps={{ inputProps: { min: 1, max: 999 } }}
            sx={{ marginBottom: "20px" }}
          />

          <FormControl fullWidth margin="dense" sx={{ marginBottom: "20px" }}>
            <InputLabel>Hospitals</InputLabel>
            <Select
              label="Hospital Id"
              name="hospital_id"
              value={formValues.hospital_id}
              onChange={handleFormChange}
            >
              {hospitals.map((hospital) => (
                <MenuItem
                  key={hospital.hospital_id}
                  value={hospital.hospital_id}
                >
                  {hospital.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Users</InputLabel>
            <Select
              name="user_id"
               label="Users"
              value={formValues.user_id}
              onChange={handleFormChange}
              disabled={editIndex !== null}
            >
              {users.map((user) => (
                <MenuItem key={user.user_id} value={user.user_id}>
                  {user.first_name}
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
            {editIndex !== null ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BloodManagement;

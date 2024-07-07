import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import "./TimeSlotSelection.css";

const TimeSlotSelection = ({ hospital_id }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [bloodRequests, setBloodRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
    fetchBloodRequests();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/Hospitals");
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchBloodRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/BloodRequests");
      setBloodRequests(response.data);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
    }
  };

  useEffect(() => {
    if (selectedDateTime !== null) {
      validateDateTime(selectedDateTime);
    }
  }, [selectedDateTime]);

  const handleBooking = () => {
    if (!selectedDateTime || validationError || !selectedHospitalId || !selectedRequestId) {
      setValidationError("Please select a valid date, time, hospital, and blood request.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (selectedDateTime) {
        setOpenDialog(true);
      } else {
        setErrorMessage("Invalid date or time selected. Please try again.");
      }
    }, 1000);
  };

  const handleConfirmBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setErrorMessage("You need to be logged in to confirm the booking.");
      return;
    }

    const bookingData = {
      user_id: user.user_id,
      hospital_id: selectedHospitalId,
      request_id: selectedRequestId,
      blood_type: user.bloodType, // Assuming bloodType is stored in user
      quantity: 1, // Assuming quantity, you should fetch or determine this dynamically as needed
      donation_date: selectedDateTime.toISOString(),
    };

    try {
      await axios.post("http://localhost:5212/api/BloodDonations", bookingData);
      setOpenDialog(false);
      alert("Your request is pending and will be approved by the hospital.");
      navigate("/dashboard", { state: { dateTime: selectedDateTime } });
    } catch (error) {
      console.error("Error saving booking:", error);
      setErrorMessage("An error occurred while saving your booking. Please try again.");
    }
  };

  const validateDateTime = (dateTime) => {
    if (!dateTime || !dayjs(dateTime).isValid()) {
      setValidationError("Invalid date and time format.");
      return;
    }
    if (dayjs(dateTime).isBefore(dayjs().add(2, "hour"))) {
      setValidationError("You cannot choose a date and time earlier than 2 hours from now.");
    } else {
      setValidationError("");
    }
  };

  return (
    <div className="time-container">
      <Container className="timeslot-selection mt-40">
        <Typography variant="h4" component="h1" gutterBottom>
          Select a Date, Time, and Hospital for Donation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please select a suitable date, time, hospital, and blood request for your donation. Ensure you
          are well-prepared and have followed all pre-donation guidelines.
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="hospital-select-label">Select Hospital</InputLabel>
          <Select
            labelId="hospital-select-label"
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            label="Select Hospital"
          >
            {hospitals.map((hospital) => (
              <MenuItem key={hospital.hospital_id} value={hospital.hospital_id}>
                {hospital.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="request-select-label">Select Blood Request</InputLabel>
          <Select
            labelId="request-select-label"
            value={selectedRequestId}
            onChange={(e) => setSelectedRequestId(e.target.value)}
            label="Select Blood Request"
          >
            {bloodRequests.map((request) => (
              <MenuItem key={request.request_id} value={request.request_id}>
                {request.blood_type} - {request.quantity} units
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="mb-8 mt-8">
            <DateTimePicker
              label="Select Date and Time"
              value={selectedDateTime}
              onChange={(newValue) => setSelectedDateTime(newValue)}
              minDate={dayjs()}  // Disable past dates
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!!validationError}
                  helperText={validationError}
                  inputProps={{
                    ...params.inputProps,
                    readOnly: false,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: validationError ? "red" : "",
                      },
                    },
                  }}
                />
              )}
            />
          </div>
        </LocalizationProvider>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {validationError && <Typography color="error">{validationError}</Typography>}

        <Box display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleBooking}
            disabled={!!validationError}
            className="book-button"
          >
            {loading ? "Processing..." : "Book Time Slot"}
          </Button>

          <Box mt={4} width="100%">
            <Typography variant="h6">Need Help?</Typography>
            <Typography variant="body2">
              Contact us at: support@hospital.com or call (123) 456-7890
            </Typography>
          </Box>

          <Box mt={4} width="100%">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Guidelines for Donation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemText primary="Drink plenty of water before your appointment." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Eat a healthy meal before donating." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Avoid caffeine on the day of donation." />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Bring a valid ID with you." />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box mt={4} width="100%">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Frequently Asked Questions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="How long does the donation process take?"
                      secondary="The entire process, including registration, medical screening, and recovery, takes about 1 hour."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="What should I bring to my donation appointment?"
                      secondary="Please bring a valid photo ID and your appointment confirmation."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Can I donate if I have a cold or flu?"
                      secondary="No, you should be in good health and free of any cold or flu symptoms."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="How often can I donate blood?"
                      secondary="You can donate whole blood every 56 days and platelets every 7 days."
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have selected {selectedDateTime?.format("MMMM DD, YYYY HH:mm")}.
              Please confirm your booking.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default TimeSlotSelection;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import "./TimeSlotSelection.css";

const TimeSlotSelection = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleBooking = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (selectedDateTime) {
        setOpenDialog(true);
      } else {
        setErrorMessage("Invalid date or time selected. Please try again.");
      }
    }, 1000);
  };

  const handleConfirmBooking = () => {
    setOpenDialog(false);
    alert("Your request is pending and will be approved by the hospital.");
    navigate("/dashboard", { state: { dateTime: selectedDateTime } });
  };

  return (
    <div className="time-container">

    <Container className="timeslot-selection mt-40">
      <Typography variant="h4" component="h1" gutterBottom>
        Select a Date and Time for Donation
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please select a suitable date and time for your donation. Ensure you are well-prepared and have followed all pre-donation guidelines.
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="mb-4">
          <DateTimePicker
            label="Select Date and Time"
            value={selectedDateTime}
            onChange={(newValue) => setSelectedDateTime(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
        </div>
      </LocalizationProvider>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBooking}
          disabled={!selectedDateTime}
          className="book-button"
        >
          {loading ? "Processing..." : "Book Time Slot"}
        </Button>
        <Box mt={4}>
          <Typography variant="h6">Need Help?</Typography>
          <Typography variant="body2">Contact us at: support@hospital.com or call (123) 456-7890</Typography>
        </Box>
        <Box mt={4}>
          <Typography variant="h6">Guidelines for Donation</Typography>
          <ul>
            <li>Drink plenty of water before your appointment.</li>
            <li>Eat a healthy meal before donating.</li>
            <li>Avoid caffeine on the day of donation.</li>
            <li>Bring a valid ID with you.</li>
          </ul>
        </Box>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected {selectedDateTime.format('MMMM DD, YYYY HH:mm')}. Please confirm your booking.
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

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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "./TimeSlotSelection.css";

const TimeSlotSelection = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDateTime !== null) {
      validateDateTime(selectedDateTime);
    }
  }, [selectedDateTime]);

  const handleBooking = () => {
    if (!selectedDateTime || validationError) {
      setValidationError("Please select a valid date and time.");
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

  const handleConfirmBooking = () => {
    setOpenDialog(false);
    alert("Your request is pending and will be approved by the hospital.");
    navigate("/dashboard", { state: { dateTime: selectedDateTime } });
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
          Select a Date and Time for Donation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please select a suitable date and time for your donation. Ensure you
          are well-prepared and have followed all pre-donation guidelines.
        </Typography>

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

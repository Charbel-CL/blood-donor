import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
  CardHeader,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ReactStars from "react-rating-stars-component";
import "./UserDashboard.css";
import Footer from "../Footer/Footer";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);

  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const API_KEY = "e0d03330b1bc40f3b07fa65f9befaa09";

const UserDashboard = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState("");
  const [distance, setDistance] = useState(30);
  const [userLocation, setUserLocation] = useState(null);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching user location:", error);
        setUserLocation({ lat: 33.8938, lng: 35.5018 });
      }
    );

    fetch("/data/bloodRequests.json")
      .then((response) => response.json())
      .then((data) => setBloodRequests(data))
      .catch((error) => {
        console.error("There was an error fetching the blood requests!", error);
      });

    fetch("/data/hospitals.json")
      .then((response) => response.json())
      .then(async (data) => {
        const hospitalsWithCoords = await Promise.all(
          data.map(async (hospital) => {
            if (hospital.lat && hospital.lng) {
              return hospital;
            } else {
              const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                  hospital.address
                )}&key=${API_KEY}`
              );
              const { lat, lng } = response.data.results[0].geometry;
              return { ...hospital, lat, lng };
            }
          })
        );
        setHospitals(hospitalsWithCoords);
      })
      .catch((error) => {
        console.error("There was an error fetching the hospitals!", error);
      });
  }, []);

  const getStatusClass = (status) => {
    if (status === "Pending") return "pending";
    if (status === "Fulfilled") return "fulfilled";
    return "";
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handleUseLocationFilterChange = (event) => {
    setUseLocationFilter(event.target.checked);
  };

  const handleDonateClick = (requestBloodType, userBloodType) => {
    const compatible = checkCompatibility(requestBloodType, userBloodType);
    const message = compatible
      ? `You can donate ${userBloodType} blood to a patient needing ${requestBloodType} blood.`
      : `You cannot donate ${userBloodType} blood to a patient needing ${requestBloodType} blood.`;
    setDialogMessage(message);
    setOpenDialog(true);

    if (compatible) {
      navigate('/donation-form');
    }
  };
  
  const checkCompatibility = (requestBloodType, userBloodType) => {
    return requestBloodType === userBloodType;
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    if (useLocationFilter && userLocation) {
      const distanceToHospital = haversineDistance(userLocation, {
        lat: hospital.lat,
        lng: hospital.lng,
      });

      if (distanceToHospital > distance) return false;
    }

    return (
      filter === "" ||
      hospital.name.toLowerCase().includes(filter) ||
      filter === "" ||
      hospital.address.toLowerCase().includes(filter) ||
      filter === "" ||
      hospital.rating.toString().includes(filter) ||
      filter === "" ||
      bloodRequests.some(
        (request) =>
          request.hospital_id === hospital.id &&
          request.blood_type.toLowerCase().includes(filter)
      )
    );
  });

  return (
    <div className="dashboard-wrapper mt-20">
      <Container className="content-container">
        <Typography variant="h4" component="h1" gutterBottom className="mt-4">
          Blood Requests
        </Typography>
        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12}>
            <TextField
              label="Filter by hospital name, location, review, or blood type"
              value={filter}
              onChange={handleFilterChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useLocationFilter}
                  onChange={handleUseLocationFilterChange}
                  name="useLocationFilter"
                  color="primary"
                />
              }
              label="Use location filter"
            />
          </Grid>
          {useLocationFilter && (
            <Grid item xs={12}>
              <Typography gutterBottom>Filter by distance (km)</Typography>
              <Slider
                value={distance}
                onChange={handleDistanceChange}
                aria-labelledby="distance-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
          )}
        </Grid>
        <Grid container spacing={3}>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map((hospital) => (
              <Grid item xs={12} sm={6} md={4} key={hospital.id}>
                <Card className="card">
                  <CardHeader title={hospital.name} />
                  <CardMedia
                    className="card-media"
                    image={hospital.image}
                    title={hospital.name}
                  />
                  <CardContent className="card-content">
                    <div className="rating">
                      <ReactStars
                        count={5}
                        value={hospital.rating}
                        size={24}
                        activeColor="#ffd700"
                        edit={false}
                        isHalf={true}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className="rating-number mt-2"
                      >
                        {hospital.rating}
                      </Typography>
                    </div>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mt-3 mb-2"
                    >
                      Address: {hospital.address}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mb-2"
                    >
                      Phone: {hospital.phone}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className="mb-2"
                    >
                      Email: {hospital.email}
                    </Typography>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Blood Requests
                    </Typography>
                    {bloodRequests
                      .filter((request) => request.hospital_id === hospital.id)
                      .map((request) => (
                        <div key={request.request_id}>
                          <Typography variant="body2" className="mb-2">
                            {request.blood_type} Blood Needed
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            className="mb-2"
                          >
                            Quantity: {request.quantity} units
                          </Typography>
                          <Typography
                            variant="body2"
                            className={`status ${getStatusClass(
                              request.status
                            )}`}
                          >
                            Status: {request.status}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            className="mt-4 m-8"
                            onClick={() =>
                              handleDonateClick(request.blood_type, "O+")
                            }
                          >
                            Donate
                          </Button>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" component="p" className="no-hospitals">
              No hospitals found.
            </Typography>
          )}
        </Grid>
      </Container>
      <Footer />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Blood Donation Compatibility</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserDashboard;

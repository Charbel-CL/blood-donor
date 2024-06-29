import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';
import './Hospitals.css';

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetch("/data/Hospital.json")  
      .then(response => response.json())
      .then(data => {
        setHospitals(data);
      })
      .catch(error => console.error("Error fetching hospitals:", error));
  }, []);

  return (
    <Container className="custom mt-52">
      <Grid container spacing={4}>
        {hospitals.map((hospital) => (
          <Grid item xs={12} sm={6} md={4} key={hospital.id}>
            <Card className="card">
              <CardMedia
                className="cardMedia"
                component="div"
                style={{ backgroundImage: `url(${hospital.image})` }} 
              />
              <CardContent className="cardContent">
                <Typography gutterBottom variant="h5" component="div">
                  {hospital.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hospital.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {hospital.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {hospital.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Services: {hospital.services.join(', ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {hospital.rating} / 5
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Hospitals;

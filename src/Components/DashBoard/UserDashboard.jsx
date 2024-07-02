import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, CardMedia, CardHeader, TextField } from '@mui/material';
import ReactStars from 'react-rating-stars-component';
import './UserDashboard.css';
import Footer from '../Footer/Footer';

const UserDashboard = () => {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/data/bloodRequests.json')
      .then(response => response.json())
      .then(data => setBloodRequests(data))
      .catch(error => {
        console.error('There was an error fetching the blood requests!', error);
      });

    fetch('/data/hospitals.json')
      .then(response => response.json())
      .then(data => setHospitals(data))
      .catch(error => {
        console.error('There was an error fetching the hospitals!', error);
      });
  }, []);

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'pending';
    if (status === 'Fulfilled') return 'fulfilled';
    return '';
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const filteredHospitals = hospitals.filter(hospital => {
    return (
      (filter === '' || hospital.name.toLowerCase().includes(filter)) ||
      (filter === '' || hospital.address.toLowerCase().includes(filter)) ||
      (filter === '' || hospital.rating.toString().includes(filter)) ||
      (filter === '' || bloodRequests.some(request => 
        request.hospital_id === hospital.id && 
        request.blood_type.toLowerCase().includes(filter)
      ))
    );
  });

  return (
    <div className='dashboard-wrapper mt-32'>
      <Container className='content-container'>
        <Typography variant="h4" component="h1" gutterBottom>
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
        </Grid>
        <Grid container spacing={3}>
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map(hospital => (
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
                      <Typography variant="body2" color="textSecondary" className="rating-number">
                        {hospital.rating}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      Address: {hospital.address}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {hospital.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: {hospital.email}
                    </Typography>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Blood Requests
                    </Typography>
                    {bloodRequests
                      .filter(request => request.hospital_id === hospital.id)
                      .map(request => (
                        <div key={request.request_id}>
                          <Typography variant="body2">
                            {request.blood_type} Blood Needed
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quantity: {request.quantity} units
                          </Typography>
                          <Typography
                            variant="body2"
                            className={`status ${getStatusClass(request.status)}`}
                          >
                            Status: {request.status}
                          </Typography>
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
    </div>
  );
};

export default UserDashboard;

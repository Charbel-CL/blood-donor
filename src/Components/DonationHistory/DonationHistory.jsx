import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import axios from "axios";
import "./DonationHistory.css";

const DonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          return;
        }

        const response = await axios.get(
          `http://localhost:5212/api/DonationHistory/user/${user.user_id}`
        );
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donation history:", error);
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, []);

  return (
    <div className="container-history">
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Donation History
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} className="history-paper">
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              className="total-donations"
            >
              Total Donations: {history.length}
            </Typography>
            <Divider />
            <List>
              {history.map((item, index) => (
                <ListItem key={index} className="donation-item">
                  <Card className="donation-card" variant="outlined">
                    <CardContent>
                      <Typography variant="body1">
                        <strong>Hospital Name:</strong> {item.HospitalName}
                      </Typography>
                      {/* <Typography variant="body1">
                        <strong>Date:</strong>{" "}
                        {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Time:</strong>{" "}
                        {item.date ? new Date(item.date).toLocaleTimeString() : "N/A"}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Location:</strong> {item.Location}
                      </Typography> */}
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default DonationHistory;

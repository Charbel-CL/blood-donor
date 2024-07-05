import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Box,
} from "@mui/material";
import "./DonationHistory.css";

const DonationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setHistory([
        {
          date: "2023-06-01",
          time: "10:00 AM",
          location: "Hospital A",
        },
        {
          date: "2023-05-01",
          time: "11:00 AM",
          location: "Hospital B",
        },
      ]);
      setLoading(false);
    }, 1000);
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
                        <strong>Date:</strong> {item.date}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Time:</strong> {item.time}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Location:</strong> {item.location}
                      </Typography>
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

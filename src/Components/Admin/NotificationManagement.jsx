import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/Notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5212/api/Users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSendNotification = async () => {
    try {
      const selectedUserEmail = users.find(user => user.user_id === selectedUser)?.email;
      await axios.post("http://localhost:5212/api/Notifications", { 
        message, 
        user_id: selectedUser, 
        email: selectedUserEmail 
      });
      setMessage("");
      setSelectedUser("");
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5212/api/Notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Manage Notifications
      </Typography>
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.user_id} value={user.user_id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Notification Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          className="mt-2"
        />
        <Button variant="contained" color="primary" onClick={handleSendNotification} className="mt-2">
          Send Notification
        </Button>
      </Box>
      <List>
        {notifications.map((notification) => {
          const user = users.find(user => user.user_id === notification.user_id);
          return (
            <ListItem key={notification.id} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNotification(notification.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText 
                primary={notification.message} 
                secondary={`User: ${user ? user.email : 'Unknown'}, Date: ${new Date(notification.dateCreated).toLocaleString()}`} 
              />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default NotificationManagement;

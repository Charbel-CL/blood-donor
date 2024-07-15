import React, { useState } from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import BloodManagement from "./BloodManagement";
import HospitalManagement from "./HospitalManagement";
import QuestionManagement from "./QuestionManagement";
import UserManagement from "./UserManagement";
import NotificationManagement from "./NotificationManagement"; 
import './AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="container-admin">
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Manage Blood" />
          <Tab label="Manage Hospitals" />
          <Tab label="Manage Questions" />
          <Tab label="Manage Users" />
          <Tab label="Manage Notifications" /> 
        </Tabs>
        <Box mt={3}>
          {activeTab === 0 && <BloodManagement />}
          {activeTab === 1 && <HospitalManagement />}
          {activeTab === 2 && <QuestionManagement />}
          {activeTab === 3 && <UserManagement />}
          {activeTab === 4 && <NotificationManagement />}
        </Box>
      </Container>
    </div>
  );
};

export default AdminPage;

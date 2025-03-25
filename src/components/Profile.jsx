// src/components/Profile.jsx
import React from "react";
import { Typography, Avatar, Box, Paper, Divider } from "@mui/material";
import { useLocation } from "react-router-dom";

function Profile() {
  const location = useLocation();
  const user = location.state?.user || {
    name: "Hembo Tingor",
    email: "rntng@gmail.com",
    avatarUrl: "",
  };

  return (
    <Box display="flex" justifyContent="center" className="p-4">
      <Paper
        elevation={3}
        style={{
          display: "flex",
          width: "80%",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "7%",
        }}
      >
        <Box
          style={{
            background: "linear-gradient(to bottom right, #ff7e5f, #feb47b)",
            padding: "20px",
            color: "white",
            width: "30%",
            textAlign: "center",
            position: "relative",
            height: "400px",
          }}
        >
          <Avatar
            alt="User"
            src={user.avatarUrl || ""}
            style={{ width: 80, height: 80, margin: "0 auto" }}
          >
            {!user.avatarUrl && user.name?.charAt(0)}
          </Avatar>
          <Typography
            variant="h6"
            style={{ fontFamily: "Mulish", fontWeight: 600, marginTop: "10px" }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            style={{ fontFamily: "Mulish", fontWeight: 400 }}
          ></Typography>
          <Box
            style={{
              position: "absolute",
              bottom: "10px",
              right: "50%",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-edit"></i>
          </Box>
        </Box>
        <Box style={{ padding: "20px", width: "70%" }}>
          <Typography
            variant="h6"
            style={{ fontFamily: "Mulish", fontWeight: 600 }}
          >
            Information
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" style={{ fontFamily: "Mulish" }}>
              Email: {user.email}
            </Typography>
            <Typography variant="body1" style={{ fontFamily: "Mulish" }}>
              Phone: 98979989898
            </Typography>
          </Box>

          <Divider style={{ margin: "10px 0" }} />

          <Box display="flex" justifyContent="center" marginTop="20px">
            <div
              style={{
                marginTop: "15%",
              }}
            >
              <i className="fab fa-facebook" style={{ margin: "0 10px" }}></i>
              <i className="fab fa-twitter" style={{ margin: "0 10px" }}></i>
              <i className="fab fa-instagram" style={{ margin: "0 10px" }}></i>
            </div>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Profile;

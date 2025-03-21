/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Typography, useMediaQuery } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Get the Firebase ID token
      const token = await result.user.getIdToken();

      // Send token to the backend for authentication
      const response = await fetch(
        "http://localhost:8000/api/auth/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("User authenticated:", data.user);
        setUser(data.user);
        localStorage.setItem("isLoggedIn", "true"); // Store login status
        navigate("/home", { state: { user: data.user } }); // Pass user info to homepage
      } else {
        console.error("Authentication failed:", data.message);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div
      className={`flex ${
        isMobile ? "flex-col" : "flex-row"
      } justify-between items-center min-h-screen`}
      style={{
        background: "#FFF9F9",
        paddingLeft: isMobile ? "20px" : "80px",
        paddingRight: "20px",
        marginTop: isMobile ? "60%" : "",
      }}
    >
      <div className="flex flex-col items-start">
        <Typography
          variant="h5"
          component="h2"
          className="text-left mb-2"
          style={{
            fontFamily: "Urbanist",
            fontWeight: 700,
            fontSize: "26.19px",
            color: "#7B1984",
            marginLeft: isMobile ? "60px" : "",
          }}
        >
          <span role="img" aria-label="task" color="#7B1984">
            📋
          </span>{" "}
          TaskBuddy
        </Typography>
        <Typography
          className="text-left mb-6"
          style={{
            fontFamily: "Urbanist",
            fontWeight: 500,
            fontSize: "14.64px",
            marginTop: "10px",
          }}
        >
          Streamline your workflow and track progress effortlessly
          <br />
          with our all-in-one task management app.
        </Typography>
        <Button
          onClick={handleGoogleSignIn}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "10px 20px",
            width: isMobile ? "100%" : "300px",
            height: "50px",
            borderRadius: "18px",
            marginTop: "2%",
          }}
        >
          <img src="/Google.svg" alt="Google" />
          <Typography
            style={{
              fontFamily: "Urbanist",
              fontWeight: 700,
              marginLeft: "5px",
            }}
          >
            Continue with Google
          </Typography>
        </Button>
      </div>
      {!isMobile && (
        <img src="/Task1.svg" alt="Decorative" style={{ maxWidth: "40%" }} />
      )}
    </div>
  );
}

export default Login;

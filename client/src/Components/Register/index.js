import { Button, TextField, Typography } from "@mui/material";
import { RegisterContainer } from "./Register.styles";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    const data = await axiosInstance.post("/register", userDetails);
  };
  return (
    <RegisterContainer>
      <Typography variant="h3">Register</Typography>
      <TextField
        label="Email"
        variant="outlined"
        className="register-field"
        onChange={handleChange}
        name="email"
      />
      <TextField
        label="Password"
        variant="outlined"
        name="password"
        type="password"
        onChange={handleChange}
        className="register-field"
      />
      <TextField
        label="First Name"
        variant="outlined"
        name="firstName"
        onChange={handleChange}
        className="register-field"
      />
      <TextField
        label="Last Name"
        variant="outlined"
        name="lastName"
        onChange={handleChange}
        className="register-field"
      />

      <Button onClick={handleSubmit}> Sign Up</Button>
    </RegisterContainer>
  );
};
export default Register;

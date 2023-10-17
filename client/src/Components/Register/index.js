import { Button, TextField, Typography } from "@mui/material";
import { RegisterContainer } from "./Register.styles";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../utils/reducers/authReducer";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    const data = await axiosInstance.post("/register", userDetails);
    if (data && data.status === 200) {
      dispatch(login(data.data.token));
      navigate("/");
    }
  };
  return (
    <RegisterContainer>
      <Typography variant="h4">Register</Typography>
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

      <Button onClick={handleSubmit} variant="contained">
        {" "}
        Sign Up
      </Button>
    </RegisterContainer>
  );
};
export default Register;

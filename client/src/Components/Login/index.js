import React, { useState } from "react";
import styled from "@emotion/styled";
import { TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../utils/reducers/authReducer";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
`;

const TextFieldStyled = styled(TextField)`
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ButtonStyled = styled(Button)``;

const Login = () => {
  //   const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await axiosInstance.post("/login", { email, password });
    if (data && data.status === 200) {
      dispatch(login(data.data.token));
      navigate("/");
    }
    // history.push("/dashboard");
  };

  return (
    <Root>
      <Form onSubmit={handleSubmit}>
        <Typography variant="h4">Login</Typography>
        <TextFieldStyled
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          required
        />
        <TextFieldStyled
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          fullWidth
          onChange={handlePasswordChange}
          required
        />
        <ButtonStyled
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
        >
          Login
        </ButtonStyled>{" "}
        <ButtonStyled
          color="primary"
          type="submit"
          fullWidth
          onClick={() => navigate("/register")}
        >
          New User? Register
        </ButtonStyled>
      </Form>
    </Root>
  );
};

export default Login;

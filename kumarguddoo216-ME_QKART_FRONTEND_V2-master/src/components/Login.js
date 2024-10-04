import React from "react";
import {  Button, Stack, TextField, Box, CircularProgress } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const login = async (formData) => {
    if (!validateInput(formData)) {
      return;
    }
    setLoading(true);

    try {
      const data = {
        username: formData.username,
        password: formData.password
      };

      const response = await axios.post(`${config.endpoint}/auth/login`, data);
      persistLogin(response.data.token, response.data.username, response.data.balance);

      history.push("/");

      if (response.data.success) {
        enqueueSnackbar("Logged in successfully", { variant: 'success' });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable, and returns valid JSON.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (data) => {
    if (!data.username.trim()) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (!data.password.trim()) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('balance', balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h1>Login</h1> {/* Added heading for the login form */}
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {loading ? (
            <Box display="flex" alignItems="center" justifyContent="center">
              <CircularProgress color="success" size={30} />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={async () => {
              await login(formData);
            }}>
              LOGIN TO QKART
            </Button>
          )}
          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link className="link" to="/register">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;

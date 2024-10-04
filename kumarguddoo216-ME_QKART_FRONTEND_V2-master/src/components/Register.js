import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import { useHistory, Link } from "react-router-dom";
import Header from "./Header";
import "./Register.css";


const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   *
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const handleRegister = async () => {
    setLoading(true);
    if (!validateInput(formData)) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${config.endpoint}/auth/register`, {
        username: formData.username,
        password: formData.password,
      });
      if (response.data.success) {
        enqueueSnackbar("Registered successfully", { variant: "success" });
        history.push("/login");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message ||
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
        : "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    // Destructure the data object to get the username, password, and confirmPassword
    const { username, password, confirmPassword } = data;
    // Check if the username is empty
    if (!username.trim()) {
      enqueueSnackbar("Username is required field", { variant: "warning" });
      return false;
    }
    // Check if the username has at least 6 characters
    if (username.trim().length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }

    // Check if the password is empty
    if (!password.trim()) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    // Check if the password has at least 6 characters
    if (password.trim().length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }
    // Check if the confirmPassword matches the password
    if (password !== confirmPassword) {
      enqueueSnackbar("Password do not match", { variant: "warning" });
      return false;
    }

    // Return true if all validations pass
    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />

          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Enter confirm password" 
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            className="button"
            variant="contained"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register Now"}
          </Button>
          <p className="secondary-action">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  FormLabel,
} from "@mui/material";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // Assuming the API returns a user object with a username field
        navigate("/app", { state: { username: data.data.username } });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "An error occurred" }));
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Stack spacing={3} sx={{ mb: 3, width: "100%", maxWidth: "400px" }}>
          <Typography variant="h3" textAlign="center">
            {" "}
            Login{" "}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 3,
              border: 1,
              borderRadius: 3.5,
              borderColor: "grey.300",
              boxShadow: 3,
            }}
          >
            <FormLabel>Username</FormLabel>
            <TextField
              name="username"
              variant="outlined"
              label="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <FormLabel>Password</FormLabel>
            <TextField
              name="password"
              variant="outlined"
              label="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button sx={{ border: 1 }} type="submit">
              Submit
            </Button>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}

export default Login;

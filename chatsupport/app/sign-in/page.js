"use client";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import "firebaseui/dist/firebaseui.css";
import * as React from "react";
import { auth } from "@/firebase";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GiAirplaneDeparture } from "react-icons/gi";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useRouter } from "next/navigation";

const theme = createTheme();

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      router.push("/main");
    } catch (e) {
      console.error("Sign in failed", e);
    }
  };
  return (
    <Box
      width="100vw"
      height="100vh"
      alignItems={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <AppBar position="static" sx={{ marginBottom: 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            href="/sign-up"
          >
            <GiAirplaneDeparture />
          </IconButton>
          <Typography
            variant="h4"
            sx={{ fontFamily: "Playwrite Australia QLD, sans-serif" }}
          >
            DreamTrip AI
          </Typography>
        </Toolbar>
      </AppBar>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleSignIn}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/sign-up" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
};

export default SignIn;

import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import usePost from "../../Hooks/usePost";
import GraphicSide from "../../assets/GraphicSide.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../Context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, adminLogin } = useAuth();
  const { data, loading, postData, error } = usePost();
  const [user, setUser] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowButton(user.email !== "" && user.password !== "");
  }, [user.email, user.password]);

  const changeUserDetails = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const changeRememberMe = (e) => {
    setUser((prev) => ({ ...prev, rememberMe: e.target.checked }));
  };

  const submitLogIn = (e) => {
    e.preventDefault();
    postData("/api/Users/signin", {
      email: user.email,
      password: user.password,
    });
  };

  useEffect(() => {
    if (data) {
      console.log("Login successful", data);
      login();
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "Admin") {
        adminLogin();
        localStorage.setItem("admin", true);
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else if (error) {
      if (error === "Invalid email or password") {
        setFormError("Invalid email or password. Please try again.");
      } else {
        setFormError("An error occurred. Please try again later.");
      }
    }
  }, [data, error, login, navigate]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 items-center h-screen bg-white">
      <form className="login-container" onSubmit={submitLogIn}>
        <h1 className="text-3xl font-semibold">Sign In</h1>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          className="w-9/12 sm:w-7/12 md:w-5/12 xl:w-6/12 2xl:w-5/12"
          name="email"
          onChange={changeUserDetails}
          required
        />
        <FormControl
          className="w-9/12 sm:w-7/12 md:w-5/12 xl:w-6/12 2xl:w-5/12"
          variant="outlined"
          required
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            name="password"
            onChange={changeUserDetails}
            label="Password"
          />
        </FormControl>
        <div className="text-red-500">{formError}</div>
        <div className="flex justify-between items-center w-9/12 sm:w-7/12 md:w-5/12 xl:w-6/12 2xl:w-5/12">
          <FormControlLabel
            control={<Checkbox onChange={changeRememberMe} />}
            label="Remember Me?"
          />
          <a className="text-[#6c28c2] cursor-pointer">Forgot Password</a>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <input
            type="submit"
            className={`bg-[#e63946] text-white px-10 py-2.5 rounded-full ${
              showButton
                ? "bg-[#e63946] cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            value={"Sign in"}
            disabled={!showButton}
          />
        )}
      </form>
      <img src={GraphicSide} className="login-image" alt="Graphic Side" />
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import usePost from "../../Hooks/usePost";
import GraphicSide from "../../assets/GraphicSide.png";
import "./Signup.css";

import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

function Signup() {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodType: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [dobError, setDobError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [query, setQuery] = useState(
    window.matchMedia("(min-width: 1280px)").matches
  );
  const { data, error, loading, postData } = usePost();

  useEffect(() => {
    window
      .matchMedia("(min-width: 1280px)")
      .addEventListener("change", (e) => setQuery(e.matches));
  }, []);

  useEffect(() => {
    setIsButtonEnabled(
      !dobError &&
        !errorPassword &&
        isChecked &&
        customer.email !== "" &&
        customer.firstName !== "" &&
        customer.lastName !== "" &&
        customer.password !== "" &&
        customer.bloodType !== ""
    );
  }, [dobError, errorPassword, isChecked, customer]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((prevState) => ({ ...prevState, [name]: value }));
  };

  function handlePasswordChange(e) {
    e.preventDefault();
    const { value, name } = e.target;
    const check = name === "password" ? "confirmPassword" : "password";

    if (value !== customer[check]) {
      setErrorPassword("Passwords do not match!");
    } else if (value.length < 6) {
      setErrorPassword("Password should be greater than 6 characters");
    } else {
      setErrorPassword("");
    }

    setCustomer((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleDateChange(event) {
    event.target.max = new Date().toISOString().split("T")[0];
    setCustomer({
      ...customer,
      dob: event.target.value,
    });
  }

  const handleDateBlur = (event) => {
    const selectedDate = new Date(event.target.value);
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 99);
    maxDate.setFullYear(maxDate.getFullYear() - 4);
    if (selectedDate <= minDate) {
      setDobError("Your age should be less than 100 years old");
      event.target.value = "";
    } else if (selectedDate >= maxDate) {
      setDobError("Your age should be more than 4 years old");
      event.target.value = "";
    } else {
      setDobError("");
    }
  };

  function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    setCustomer({ ...customer, email });
  }

  useEffect(() => {
    if (data) {
      if (data.message === "USERNAME_ALREADY_EXISTS") {
        setResponseMessage("Email Already Exists! Try with a different one");
      } else {
        setResponseMessage("Account Created successfully");

        setTimeout(() => {
          window.location.href = "/EmailVerification?email=" + customer.email;
        }, 1000);
      }
    }
  }, [data]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isButtonEnabled) {
      postData("/api/Users/signup", {
        email: customer.email,
        password_hash: customer.password,
        first_name: customer.firstName,
        last_name: customer.lastName,
        dob: customer.dob,
        gender: customer.gender,
        address: customer.address,
        bloodType: customer.bloodType,
        role: "Donor",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 items-center">
      {query ? (
        <img
          src={GraphicSide}
          className="graphic-side"
          alt="Decorative Graphic"
        />
      ) : (
        ""
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-full h-full signup"
      >
        <div className="text-center p-5 mt-3">
          <h1 className="text-5xl p-3">Profile Setup</h1>
          <span className="text-2xl">Create your account</span>
        </div>

        <div className="justify-content">
          <div className="flex flex-col md:flex-row md:space-x-7 space-y-4 md:space-y-0 mt-5">
            <TextField
              type="text"
              label="First Name"
              variant="outlined"
              name="firstName"
              className="basis-1/2"
              value={customer.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              type="text"
              label="Last Name"
              variant="outlined"
              name="lastName"
              className="basis-1/2"
              value={customer.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-7 space-y-4 md:space-y-0 mt-5 ">
            <FormControl className="md:w-auto flex-1">
              <h2
                id="demo-row-radio-buttons-group-label"
                className="text-sm md:text-lg "
              >
                gender Identification*{" "}
              </h2>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                defaultValue="female"
                onChange={handleChange}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              type="date"
              variant="outlined"
              className="px-2 py-2 flex-1"
              value={customer.dob}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              error={!!dobError}
              helperText={dobError}
              required
            />
          </div>

          <div className="flex flex-row mt-5 space-x-5 pl-0  ">
            <TextField
              error={emailError}
              type="email"
              label="Email Address"
              variant="outlined"
              className="w-full"
              name="email"
              onChange={validateEmail}
              value={customer.email}
              helperText={
                emailError ? "Please enter a valid email address" : ""
              }
              required
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-7 space-y-4 md:space-y-0 mt-5">
            <Autocomplete
              id="blood-type-select"
              className="w-full"
              options={bloodTypes}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.code === value.code
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                  />
                  {option.label}
                </Box>
              )}
              onChange={(event, newValue) => {
                if (newValue) {
                  setCustomer({ ...customer, bloodType: newValue.code });
                } else {
                  setCustomer({ ...customer, bloodType: "" });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose Blood Type"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password",
                  }}
                />
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row md:space-x-7 space-y-4 md:space-y-0 mt-5 ">
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              name="password"
              className="basis-1/2"
              value={customer.password}
              onChange={handlePasswordChange}
              error={errorPassword !== ""}
              helperText={errorPassword || ""}
              required
            />
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              name="confirmPassword"
              className="basis-1/2"
              value={customer.confirmPassword}
              onChange={handlePasswordChange}
              error={errorPassword !== ""}
              helperText={errorPassword || ""}
              required
            />
          </div>

          <div className="flex justify-center items-center my-4">
            <FormControlLabel
              control={<Checkbox id="termsCheckbox" />}
              label={
                <span>
                  <a href="#" className="text-blue-500">
                    I agree with the terms of use
                  </a>
                </span>
              }
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>

          <div className="flex flex-col justify-center items-center gap-4 ">
            {error && (
              <Alert severity="error">
                Error occurred while sending the request
              </Alert>
            )}
            {data && <Alert severity="info">{responseMessage}</Alert>}
            {loading ? (
              <CircularProgress color="secondary" />
            ) : (
              <input
                type="submit"
                className={`bg-[##e63946] text-white rounded-full px-10 py-2.5   ${
                  isButtonEnabled
                    ? "bg-[#e63946] cursor-pointer"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={!isButtonEnabled}
                value={"Get Started"}
              />
            )}

            <p>
              Already have an Account!{" "}
              <a className="text-red-800" href="/login">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

const bloodTypes = [
  { code: "A+", label: "A+" },
  { code: "A-", label: "A-" },
  { code: "B+", label: "B+" },
  { code: "B-", label: "B-" },
  { code: "AB+", label: "AB+" },
  { code: "AB-", label: "AB-" },
  { code: "O+", label: "O+" },
  { code: "O-", label: "O-" },
];

export default Signup;

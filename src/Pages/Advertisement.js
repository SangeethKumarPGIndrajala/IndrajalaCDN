import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

function Advertisement({ token }) {
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(startDate.add(1, "month"));
  const [mobileAdImage, setMobileAdImage] = useState(null);
  const [desktopAdImage, setDesktopAdImage] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    url: "",
    clientName: "",
    address: "",
    contactNumber: "",
    email: "",
    position: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const mobileAdInputRef = useRef(null);
  const desktopAdInputRef = useRef(null);
  const validateField = (fieldName, value) => {
    let error = "";
    if (!value.trim()) {
      error = `${fieldName} is required.`;
    } else {
      if (fieldName === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format.";
      }
      if (
        fieldName === "contactNumber" &&
        !/^\d{10}$/.test(value.replace(/\s/g, ""))
      ) {
        error = "Contact number must be a valid 10-digit number.";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Validate field on change
    const error = validateField(name, value);
    setFormErrors({ ...formErrors, [name]: error });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormValues({ ...formValues, [name]: file });

      // Update corresponding image state variables
      if (name === "mobileAdImage") {
        setMobileAdImage(file);
      } else if (name === "desktopAdImage") {
        setDesktopAdImage(file);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      formData.append("title", formValues.title);
      formData.append("url", formValues.url);
      formData.append("clientAddress", formValues.address);
      formData.append("clientName", formValues.clientName);
      formData.append("clientContact", formValues.contactNumber);
      formData.append("startDate", startDate.format("DD/MM/YYYY"));
      formData.append("endDate", endDate.format("DD/MM/YYYY"));
      formData.append("adPosition", formValues.position);
      formData.append("mobileImage", mobileAdImage);
      formData.append("desktopImage", desktopAdImage);
      console.log(formData);
      const response = await axios.post(
        "https://api.indrajala.in/api/admin/add-advertisement",
        formData,
        {
          headers: {
            "x-access-protected": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if(response.status === 200){
        alert("Advertisement added successfully.");
        setFormValues({
          title: "",
          url: "",
          clientName: "",
          address: "",
          contactNumber: "",
          email: "",
          position: "",
        });
        setFormErrors({});
        setStartDate(dayjs(new Date()));
        setEndDate(startDate.add(1, "month"));
        setMobileAdImage(null);
        setDesktopAdImage(null);
        if (mobileAdInputRef.current) {
          mobileAdInputRef.current.value = "";
        }
        if (desktopAdInputRef.current) {
          desktopAdInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add Advertisement
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Advertisement Title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Advertisement URL"
                name="url"
                value={formValues.url}
                onChange={handleChange}
                error={!!formErrors.url}
                helperText={formErrors.url}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Name/ Company Name"
                name="clientName"
                value={formValues.clientName}
                onChange={handleChange}
                error={!!formErrors.clientName}
                helperText={formErrors.clientName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client / Company Address"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Contact Number"
                name="contactNumber"
                value={formValues.contactNumber}
                onChange={handleChange}
                error={!!formErrors.contactNumber}
                helperText={formErrors.contactNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Client Email ID"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="DD/MM/YYYY"
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="DD/MM/YYYY"
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="advertisement-position-label">
                  Advertisement Position
                </InputLabel>
                <Select
                  labelId="advertisement-position-label"
                  id="advertisement-position"
                  name="position"
                  value={formValues.position}
                  onChange={handleChange}
                  sx={{ marginTop: 1 }}
                  error={!!formErrors.position}
                >
                  <MenuItem value="trending">Trending</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="topfive">Top Five</MenuItem>
                </Select>
                {formErrors.position && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ marginLeft: 2 }}
                  >
                    {formErrors.position}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <InputLabel htmlFor="mobile-ad-image">
                  Mobile Ad Image
                </InputLabel>
                <TextField
                  fullWidth
                  id="mobile-ad-image"
                  type="file"
                  name="mobileAdImage"
                  onChange={handleFileChange}
                  inputProps={{ accept: "image/*" }}
                  inputRef={mobileAdInputRef}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <InputLabel htmlFor="desktop-ad-image">
                  Desktop Ad Image
                </InputLabel>
                <TextField
                  fullWidth
                  id="desktop-ad-image"
                  name="desktopAdImage"
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ accept: "image/*" }}
                  inputRef={desktopAdInputRef}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                variant="contained"
                disabled={
                  formErrors.title ||
                  formErrors.url ||
                  formErrors.clientName ||
                  formErrors.address ||
                  formErrors.contactNumber ||
                  formErrors.email ||
                  formErrors.position
                }
                type="submit"
                sx={{ marginTop: 2, width: "100%" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}

export default Advertisement;

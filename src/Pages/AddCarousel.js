import { PhotoCamera } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

function AddCarousel({ token }) {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    videoTitle: "",
    cast: "",
    description: "",
    movieId: "",
    rating: "",
    mobileImage: null,
    desktopImage: null,
  });

  // Refs for file inputs
  const mobileImageRef = useRef(null);
  const desktopImageRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.indrajala.in/api/admin/movies",
          {
            headers: {
              "x-access-protected": token,
            },
          }
        );
        setMovies(response.data);
      } catch (err) {
        console.log(
          err.response ? err.response.data.error : "Something went wrong"
        );
      }
    };

    fetchMovies();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0], // Store the selected file
    }));
  };

  const handleSubmit = async () => {
    console.log(movies);
    try {
      const url = movies.find((movie) => movie._id === formData.movieId).url;
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.videoTitle);
      formDataToSend.append("cast", formData.cast);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("url", url);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("mobileImage", formData.mobileImage);
      formDataToSend.append("desktopImage", formData.desktopImage);

      const response = await axios.post(
        "https://api.indrajala.in/api/admin/add-carousel-images",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-protected": token,
          },
        }
      );

      console.log("Response:", response.data);
      alert("Carousel added successfully!");
    } catch (err) {
      console.error(
        "Error:",
        err.response ? err.response.data.error : "Something went wrong"
      );
      alert("Failed to add carousel.");
    }
  };

  const handleClear = () => {
    // Reset form data
    setFormData({
      videoTitle: "",
      cast: "",
      description: "",
      movieId: "",
      rating: "",
      mobileImage: null,
      desktopImage: null,
    });

    // Clear file input fields
    if (mobileImageRef.current) {
      mobileImageRef.current.value = "";
    }
    if (desktopImageRef.current) {
      desktopImageRef.current.value = "";
    }
  };

  return (
    <>
      <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add Carousel
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Video Title"
              fullWidth
              name="videoTitle"
              value={formData.videoTitle}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cast"
              fullWidth
              name="cast"
              value={formData.cast}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="movie-select-label">Movie</InputLabel>
              <Select
                labelId="movie-select-label"
                id="movie-select"
                label="Movie"
                name="movieId"
                value={formData.movieId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Movie</em>
                </MenuItem>
                {movies.map((movie) => (
                  <MenuItem key={movie._id} value={movie._id}>
                    {movie.movieName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Rating"
              fullWidth
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="file"
              fullWidth
              label="Mobile Image"
              name="mobileImage"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                accept: "image/*",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton component="span">
                      <PhotoCamera />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={handleFileChange}
              inputRef={mobileImageRef} // Attach ref
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="file"
              fullWidth
              label="Desktop Image"
              name="desktopImage"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                accept: "image/*",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton component="span">
                      <PhotoCamera />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={handleFileChange}
              inputRef={desktopImageRef} // Attach ref
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
                color: "red",
                backgroundColor: "white",
              }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" fullWidth onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AddCarousel;

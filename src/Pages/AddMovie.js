import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Select, MenuItem, InputLabel, FormControl, Grid, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';

const AddMovie = ({ token }) => {
    const [movieData, setMovieData] = useState({
        movieName: '',
        description: '',
        starring: '',
        ageLimit: '',
        category: '',
        duration: '',
        rating: '',
        url: '',
        movieFullImage: null,
        movieLogoImage: null,
        movieMobileImage: null,
        smallMovieImage: null,
        trailerVideo: null,
        movieVideo: null,
    });

    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMovieData({ ...movieData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        // Check if any files are selected
        if (files.length > 0) {
            setMovieData({ ...movieData, [name]: files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append form data fields
        for (const key in movieData) {
            formData.append(key, movieData[key]);
        }

        setLoading(true); // Start loading

        try {
            const response = await axios.post('https://api.indrajala.in/api/admin/add-videos', formData, {
                headers: {
                    'x-access-protected': token,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Movie added successfully:', response.data);
            setOpenSnackbar(true); // Show success alert
            // Reset form fields
            setMovieData({
                movieName: '',
                description: '',
                starring: '',
                ageLimit: '',
                category: '',
                duration: '',
                rating: '',
                url: '',
                movieFullImage: null,
                movieLogoImage: null,
                movieMobileImage: null,
                smallMovieImage: null,
                trailerVideo: null,
                movieVideo: null,
            });
        } catch (error) {
            console.error('Error adding movie:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom align="center">Add Movie</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="movieName"
                            label="Movie Name"
                            value={movieData.movieName}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="description"
                            label="Description"
                            value={movieData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="starring"
                            label="Starring"
                            value={movieData.starring}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="ageLimit"
                            label="Age Limit"
                            value={movieData.ageLimit}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="category"
                            label="Category"
                            value={movieData.category}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="duration"
                            label="Duration"
                            value={movieData.duration}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="rating-label">Rating</InputLabel>
                            <Select
                                name="rating"
                                labelId="rating-label"
                                value={movieData.rating}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="U">U</MenuItem>
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="U/A">U/A</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="url"
                            label="URL"
                            value={movieData.url}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="movieFullImage">Movie Full Image</InputLabel>
                        <input
                            type="file"
                            name="movieFullImage"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="movieLogoImage">Movie Logo Image</InputLabel>
                        <input
                            type="file"
                            name="movieLogoImage"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="movieMobileImage">Movie Mobile Image</InputLabel>
                        <input
                            type="file"
                            name="movieMobileImage"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="smallMovieImage">Small Movie Image</InputLabel>
                        <input
                            type="file"
                            name="smallMovieImage"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="trailerVideo">Trailer Video</InputLabel>
                        <input
                            type="file"
                            name="trailerVideo"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="movieVideo">Movie Video</InputLabel>
                        <input
                            type="file"
                            name="movieVideo"
                            onChange={handleFileChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                    {loading ? <CircularProgress size={24} /> : 'Add Movie'}
                </Button>
            </form>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Movie added successfully!"
            />
        </Box>
    );
};

export default AddMovie;

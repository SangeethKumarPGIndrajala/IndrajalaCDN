import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, Button, CircularProgress, Snackbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css'; // Import external CSS for styling

const MovieDetail = ({ token }) => {
    const { id } = useParams(); // Get movie ID from URL parameters
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
    const navigate = useNavigate(); // Hook to access navigation

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await axios.get(`https://api.indrajala.in/api/admin/movies/${id}`, {
                    headers: {
                        'x-access-protected': token,
                    },
                });
                setMovie(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetail();
    }, [id, token]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://api.indrajala.in/api/admin/movies/${id}`, {
                headers: {
                    'x-access-protected': token,
                },
            });
            setOpenSnackbar(true); // Show Snackbar on successful deletion
            setTimeout(() => {
                navigate('/movies'); // Navigate back to the movies list after a delay
            }, 2000); // Delay for 2 seconds to show the Snackbar
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Failed to delete the movie');
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    if (!movie) {
        return <Typography variant="h6">Movie not found</Typography>;
    }

    return (
        <div className="movie-detail">
            <Card className="movie-card">
                <CardContent>
                    <Typography variant="h4" className="movie-title">{movie.movieName}</Typography>
                    <div className="movie-info">
                        <div className="movie-info-item">
                            <Typography variant="body1"><strong>Rating:</strong> {movie.rating}</Typography>
                            <Typography variant="body1"><strong>Age Limit:</strong> {movie.ageLimit}</Typography>
                            <Typography variant="body1"><strong>Duration:</strong> {movie.duration} mins</Typography>
                            <Typography variant="body1"><strong>Starring:</strong> {movie.starring.join(', ')}</Typography>
                            <Typography variant="body1"><strong>Category:</strong> {movie.category.join(', ')}</Typography>
                        </div>
                        <div className="movie-info-item">
                            <Typography variant="body1"><strong>Likes:</strong> {movie.like}</Typography>
                            <Typography variant="body1"><strong>Views:</strong> {movie.views}</Typography>
                            <Typography variant="body1"><strong>Dislikes:</strong> {movie.dislike}</Typography>
                        </div>
                    </div>
                    <Typography variant="body1" className="movie-description">
                        <strong>Description:</strong> {movie.description}
                    </Typography>
                    <img
                             src={`https://api.indrajala.in/public${movie.smallMovieImage}`}
                                    alt={movie.movieName}
                                    className="small-movie-image"
                                         onError={(e) => {
                                console.error('Image failed to load:', e.target.src);
                                e.target.onerror = null; // Prevents looping
                                    e.target.src = '/path/to/default/image.png'; // Fallback image
                      }}
/>
                    <Button variant="contained" color="secondary" onClick={handleDelete} style={{ marginTop: '20px' }}>
                        Delete Movie
                    </Button>
                </CardContent>
            </Card>
            <Snackbar
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                message="Movie Deleted Successfully"
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </div>
    );
};

export default MovieDetail;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, Grid, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MovieList = ({ token }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook to access navigation

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('https://api.indrajala.in/api/admin/movies', {
                    headers: {
                        'x-access-protected': token,
                    },
                });
                setMovies(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [token]);

    const handleCardClick = (movieId) => {
        // Navigate to the movie detail page
        navigate(`/movies/${movieId}`);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    // If there are no movies
    if (movies.length === 0) {
        return (
            <Typography variant="h6" align="center">
                No Movies Uploaded. Please use the Add Movies option.
                
              
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {movies.map(movie => (
                <Grid item xs={12} sm={6} md={4} key={movie._id}>
                    <Card onClick={() => handleCardClick(movie._id)} style={{ cursor: 'pointer' }}>
                        <CardContent>
                            <Typography variant="h6">{movie.movieName}</Typography>
                            <Typography variant="body2">{movie.description}</Typography>
                            <img 
                                src={`https://api.indrajala.in/public${movie.smallMovieImage}`}
                                alt={movie.movieName} 
                                style={{ width: '100%', borderRadius: '8px' }} 
                            />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default MovieList;

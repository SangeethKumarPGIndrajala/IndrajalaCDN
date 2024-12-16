// src/Home.js
import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import Cookies from 'js-cookie';
import './Home.css';
import AddMovie from './AddMovie';
import MovieList from './MovieList';
import FindUser from './SearchUser';
import ManageTopFive from './ManageTopFive';
import ManageTrending from './Trending';
import Advertisement from './Advertisement';
import ManageAds from './ManageAds';

const Home = () => {
    const token = Cookies.get('token'); // Get the token from cookies
    const [selectedOption, setSelectedOption] = useState(''); // State to track selected option

    // Redirect to login if not authenticated
    if (!token) {
        window.location.href = '/'; 
        return null; // Prevent rendering the rest of the component
    }

    // Function to render content based on selected option
    const renderContent = () => {
        switch (selectedOption) {
            case 'addMovie':
                return <AddMovie token={token} />;
            case 'movieList':
                return <MovieList token={token} />;
            case 'searchUser':
                    return <FindUser token={token} />;
            case 'topfive':
                    return <ManageTopFive token={token} />;
            case 'trending':
                    return <ManageTrending token={token} />;
            case 'advertisement':
                    return <Advertisement token={token} />;
            case'manageads':
                    return <ManageAds token={token} />;
            default:
                return <Typography variant="h6">Please select an option from the left.</Typography>;
        }
    };

    return (
        <Container>
            <Box display="flex" height="100vh">
                {/* Left Sidebar */}
                <Box width="250px" bgcolor="#3f51b5" padding={2} color="white">
                    <Typography variant="h5" gutterBottom>Options</Typography>
                    <List>
                        <ListItem button onClick={() => setSelectedOption('addMovie')} className="sidebar-item">
                            <ListItemText primary="Add Movie" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedOption('movieList')} className="sidebar-item">
                            <ListItemText primary="Movie List" />
                        </ListItem>
                        
                        <ListItem button onClick={() => setSelectedOption('searchUser')} className="sidebar-item">
                            <ListItemText primary="Search User" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedOption('topfive')} className="sidebar-item">
                            <ListItemText primary="Top 5 Movies" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedOption('trending')} className="sidebar-item">
                            <ListItemText primary="Manage Trending Movies" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedOption('advertisement')} className="sidebar-item">
                            <ListItemText primary="Add Advertisement" />
                        </ListItem>
                        <ListItem button onClick={()=>setSelectedOption('manageads')} className='sidebar-item'>
                            <ListItemText primary="Manage Advertisements" />
                        </ListItem>
                    </List>
                </Box>

                {/* Right Content Area */}
                <Box flexGrow={1} padding={2} bgcolor="#f5f5f5">
                    <Typography variant="h4">INDRAJALA MOVIE MAKERS LLP | CDN </Typography>
                    <Typography variant="body1">Welcome Admin</Typography>
                    <Box marginTop={2}>
                        {renderContent()} {/* Render the selected content */}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;
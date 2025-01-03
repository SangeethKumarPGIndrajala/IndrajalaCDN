import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Grid,
} from "@mui/material";

const ManageCarousel = ({token}) => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        const response = await fetch("https://api.indrajala.in/api/admin/get-carousel-images");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.carousels) {
          setCarouselImages(data.carousels);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://api.indrajala.in/api/admin/delete-carousel-image/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-protected": token,
          },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the carousel image");
      }

      // Refresh the carousel list
      setCarouselImages((prevImages) => prevImages.filter((image) => image._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPages = Math.ceil(carouselImages.length / itemsPerPage);
  const paginatedImages = carouselImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5" align="center">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Manage Carousel
      </Typography>

      {paginatedImages.length > 0 ? (
        <Grid container spacing={3}>
          {paginatedImages.map((image) => (
            <Grid item xs={12} md={6} key={image._id}>
              <Card sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://api.indrajala.in/public${image.desktopImage}`}
                  alt={`${image.title} - Desktop`}
                  sx={{ objectFit: "cover" }}
                />
                <Typography variant="body2" color="textSecondary">Desktop Image</Typography>
                <CardMedia
                  component="img"
                  height="150"
                  image={`https://api.indrajala.in/public${image.mobileImage}`}
                  alt={`${image.title} - Mobile`}
                  sx={{ objectFit: "cover" }}
                />
                <Typography variant="body2" color="textSecondary">Mobile Image</Typography>
                <CardContent>
                  <Typography variant="h6">{image.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Description:</strong> {image.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Cast:</strong> {image.cast}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Rating:</strong> {image.rating}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>URL:</strong>{" "}
                    <a href={image.url} target="_blank" rel="noopener noreferrer">
                      {image.url}
                    </a>
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(image._id)}
                  sx={{ margin: 2 }}
                >
                  Delete
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" align="center">
          No carousel images available.
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ManageCarousel;

import { ExpandMoreOutlined, Delete } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ManageVideoAds({ token }) {
  const [videoAds, setVideoAds] = useState([]);

  // Fetch all video ads
  const fetchVideoAds = async () => {
    try {
      const response = await axios.get(
        "https://api.indrajala.in/api/admin/get-all-ad-videos",
        {
          headers: {
            "x-access-protected": token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setVideoAds(response.data?.allVideoAdvertisements || []);
      } else {
        console.error("Error fetching video ads");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle video ad status change
  const handleVideoAdStatusChange = async (adId, status) => {
    try {
      const response = await axios.post(
        "https://api.indrajala.in/api/admin/update-video-ad-status",
        {
          adId: adId,
          status: status,
        },
        {
          headers: {
            "x-access-protected": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        fetchVideoAds(); // Refresh the list after status update
      } else {
        alert("Error updating video ad status");
      }
    } catch (error) {
      console.error("Error updating video ad status", error);
    }
  };

  // Handle delete video ad
  const handleDeleteVideoAd = async (adId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video ad?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `https://api.indrajala.in/api/admin/delete-video-ad/${adId}`,
        {
          headers: {
            "x-access-protected": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        fetchVideoAds(); // Refresh the list after deletion
      } else {
        alert("Error deleting video ad");
      }
    } catch (error) {
      console.error("Error deleting video ad", error);
    }
  };

  // Fetch video ads on component load
  useEffect(() => {
    fetchVideoAds();
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Video Ads
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {videoAds.length > 0 &&
            videoAds.map((videoAd, index) => (
              <Accordion key={videoAd._id}>
                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">{index + 1}</Typography>
                    <Typography variant="h6">{videoAd.adTitle}</Typography>
                    <Typography variant="h6">{videoAd.status}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Typography variant="body1">
                      Video Ad Link: {videoAd.adURL}
                    </Typography>
                    <Typography variant="body1">
                      Frequency: {videoAd.adFrequency}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <FormControl sx={{ width: "75%" }}>
                      <InputLabel id="status-select">Set Status</InputLabel>
                      <Select
                        sx={{ marginTop: 2 }}
                        labelId="status-select"
                        value={videoAd.status}
                        onChange={(e) => {
                          e.preventDefault();
                          handleVideoAdStatusChange(videoAd._id, e.target.value);
                        }}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="disabled">Disabled</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      sx={{
                        marginTop: 2,
                        backgroundColor: "red",
                        color: "white",
                      }}
                      onClick={() => handleDeleteVideoAd(videoAd._id)}
                      startIcon={<Delete />}
                    >
                      Delete
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ManageVideoAds;

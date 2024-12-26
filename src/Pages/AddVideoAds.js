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
import axios from "axios";
import React, { useState, useEffect } from "react";
// http://localhost:20000/
// https://api.indrajala.in
function AddVideoAds({ token }) {
  const [selectedAdType, setSelectedAdType] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adRedirectUrl, setAdRedirectUrl] = useState("");

  // Update the descriptionText based on selectedAdType
  useEffect(() => {
    switch (selectedAdType) {
      case "trailer":
        setDescriptionText("Please add a short video which is not longer than 6 seconds");
        break;
      case "full-length":
        setDescriptionText("Please add a longer video which is not longer than 15 seconds");
        break;
      default:
        setDescriptionText("Choose a video ad type to add");
        setVideoFile(null); 
        break;
    }
  }, [selectedAdType]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
        setError(""); 
      } else {
        setError("Please select a valid video file.");
        setVideoFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setError("Please upload a video file before submitting.");
      return;
    }

    // video upload logic
    console.log("Uploading video:", videoFile.name);
    const formData = new FormData();
    formData.append("adVideo", videoFile);
    formData.append("title", adTitle);
    formData.append("adType", selectedAdType);
    formData.append("adRedirectURL", adRedirectUrl);
    // alert("Video submitted successfully!"); 
    const response = await axios.post(
        "https://api.indrajala.in/api/admin/add-ad-video",
        formData,
        {
            headers:{
                "x-access-protected": token,
                "Content-Type": "multipart/form-data",
            }
        }
    );
    console.log(response.data);
    if(response.status === 200){
        alert("Video submitted successfully!");
        setAdTitle("");
        setSelectedAdType("");
    }else{
        console.log(response.data);
    }
    // submission logic
  };

  return (
    <>
      <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add Video Ads
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="video-ad-type-label">Video Ad Type</InputLabel>
              <Select
                sx={{ marginTop: 2 }}
                labelId="video-ad-type-label"
                id="video-ad-type"
                onChange={(event) => setSelectedAdType(event.target.value)}
              >
                <MenuItem value="trailer">Trailer</MenuItem>
                <MenuItem value="full-length">Full Length</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ad Title"
              value={adTitle}
              onChange={(event) => setAdTitle(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
             fullWidth
             label="ad redirect url"
             value={adRedirectUrl}
             onChange={(event) => setAdRedirectUrl(event.target.value)}
             />
          </Grid>
          <Grid item xs={12}>
            {descriptionText && (
              <>
                <Typography variant="body1" gutterBottom align="center">
                  {descriptionText}
                </Typography>
                {selectedAdType && (
                  <>
                    <TextField
                      fullWidth
                      type="file"
                      inputProps={{ accept: "video/*" }}
                      onChange={handleFileChange}
                    />
                    {videoFile && <Typography variant="body2" align="center">{videoFile.name}</Typography>}
                  </>
                )}
                {error && <Typography color="error" align="center">{error}</Typography>}
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            {selectedAdType && <Button variant="contained" fullWidth onClick={handleSubmit}>Submit</Button>}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AddVideoAds;

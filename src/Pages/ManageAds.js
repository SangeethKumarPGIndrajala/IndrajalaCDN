import { ExpandMoreOutlined } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ManageAds({ token }) {
  const [ads, setAds] = useState([]);
  const fetchAds = async () => {
    try {
      const response = await axios.get(
        "https://api.indrajala.in/api/admin/get-all-advertisements",
        {
          headers: {
            "x-access-protected": token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setAds(response.data?.advertisements);
      } else {
        console.log("Error fetching ads");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async(adId, status) => {
    const response = await axios.post(
      "https://api.indrajala.in/api/admin/update-ad-status",
        {
            adId: adId,
            status: status
        },
        {
            headers:{
                "x-access-protected": token,
                "Content-Type": "application/json",
            }
        }
    );
    if(response.status === 200){
        fetchAds();
    }else{
        alert("Error updating ad status");
    }
  }
  useEffect(() => {
    fetchAds();
  }, []);
  console.log(ads);
  return (
    <>
      <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Manage Ads
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            {ads?.length > 0 &&
              ads.map((ad, index) => (
                <Accordion>
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
                      <Typography variant="h6">{ad.adTitle}</Typography>
                      <Typography variant="h6">{ad.adStatus}</Typography>
                      <Typography variant="h6">{ad.adPosition}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                  <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                        marginBottom:2
                      }}
                    >
                        <Typography variant="p">Advertisement Link: {ad.adURL}</Typography>
                        <Typography variant="p">Click Count: {ad.adClickCount}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                        marginBottom:2
                      }}
                    >
                        <Typography variant="p">Client Name: {ad.clientName}</Typography>
                        <Typography variant="p">Client Adress: {ad.clientAddress}</Typography>
                        <Typography variant="p">Client Contact: {ad.clientContact}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                        <FormControl sx={{ width: "100%" }}>
                            <InputLabel id="status-select">Set status</InputLabel>
                            <Select
                                sx={{marginTop:2}}
                              labelId="status-select" value={ad.adStatus}
                              onChange={(e)=>{
                                e.preventDefault();
                                handleStatusChange(ad._id, e.target.value);
                              }}
                              >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="disabled">Disable</MenuItem>
                              </Select>
                        </FormControl>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ManageAds;

import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/api";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@material-ui/core";


const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAllCollections();
  }, []);

  const fetchAllCollections = async () => {
    try {
      const response = await axios.get(`${api}/collections`);
      if (Array.isArray(response.data)) {
        setCollections(response.data);
      } else {
        console.error("Invalid response:", response.data);
      }
    } catch (error) {
      console.log("Error fetching collections:", error.message);
    }
  };

  const handleCreateCollections = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${api}/collections`, {
        name,
        description,
      });
      if (response) {
        console.log("Collection created successfully", response.data);
      }
      resetForm();
      fetchAllCollections();
    } catch (error) {
      console.error("Error creating collection:", error.message);
    }
  };

  const handleUpdateCollections = async (collectionId) => {
    try {
      await axios.put(`${api}/collections/${collectionId}`, {
        name,
        description,
      });
      console.log("Collection updated successfully");
      resetForm();
      fetchAllCollections();
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const handleDeleteCollections = async (collectionId) => {
    try {
      await axios.delete(`${api}/collections/${collectionId}`);
      console.log("Collection deleted successfully");
      fetchAllCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Collection Management
      </Typography>

      <Box mb={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Create Collection
            </Typography>
            <form onSubmit={handleCreateCollections}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" component="h3" gutterBottom>
        Update Collection
      </Typography>
      {collections.map((collection) => (
        <Box mb={2} key={collection.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" component="h4" gutterBottom>
                {collection.name}
              </Typography>
              <Typography color="textSecondary">
                {collection.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: "0.5rem" }}
                onClick={() => handleUpdateCollections(collection.id)}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeleteCollections(collection.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Box>
      ))}
    </div>
  );
};

export default CollectionManagement;

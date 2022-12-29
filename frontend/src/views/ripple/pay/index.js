import React from 'react';
import {useParams} from "react-router-dom";

import PayForm from "./PayForm";
import Graph from "../graph";
import {Grid} from "@mui/material";

const Index = () => {
  const { userId } = useParams();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PayForm recipientId={userId} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;

import React from 'react';
import {Card, Grid} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {gridSpacing} from "store/constant";
import Skeleton from "@mui/material/Skeleton";

const EndorsementCard = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
        border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
        borderColor: theme.palette.grey[100]
      }}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs zeroMinWidth>
              <Skeleton variant="circular" width={70} height={70} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" width={100} height={20} sx={{ marginBottom: 1 }}/>
          <Skeleton variant="rounded" width={200} height={15} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" width={100} height={20} sx={{ marginBottom: 1 }}/>
          <Skeleton variant="rounded" width={200} height={15} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" width={100} height={20} sx={{ marginBottom: 1 }}/>
          <Skeleton variant="rounded" width={200} height={15} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" width={100} height={20} sx={{ marginBottom: 1 }}/>
          <Skeleton variant="rounded" width={"100%"} height={15} sx={{ marginBottom: 1 }}/>
          <Skeleton variant="rounded" width={"100%"} height={15} sx={{ marginBottom: 1 }}/>
          <Skeleton variant="rounded" width={"100%"} height={15} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rounded" width={"100%"} height={40}/>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EndorsementCard;

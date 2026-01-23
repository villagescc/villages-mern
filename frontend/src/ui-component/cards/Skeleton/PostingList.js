// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import * as React from "react";

// ==============================|| SKELETON - EARNING CARD ||============================== //

const PostingList = () => (
  <Card>
      <CardContent>
          <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item xs={12} sm={3}>
                  <Skeleton variant="rounded" width={'100%'} height={38} />
              </Grid>
              <Grid item xs={12} sm={3}>
                  <Skeleton variant="rounded" width={'100%'} height={38} />
              </Grid>
              <Grid item xs={12} sm={3}>
                  <Skeleton variant="rounded" width={'100%'} height={38} />
              </Grid>
              <Grid item xs={12} sm={3}>
                  <Skeleton variant="rounded" width={'100%'} height={38} />
              </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="end" sx={{ my: 1 }}>
              <Skeleton variant="circular" width={40} height={40} />
          </Grid>
          <Grid container justifyContent="start" alignItems="top" spacing={2} sx={{ my: 1 }}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rounded" width={'100%'} height={400} />
              </Grid>
          </Grid>
      </CardContent>
  </Card>
);

export default PostingList;

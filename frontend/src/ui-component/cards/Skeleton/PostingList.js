// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import * as React from "react";

// ==============================|| SKELETON - EARNING CARD ||============================== //

const PostingList = () => (
  <Card>
      <CardContent>
          <Grid container direction="column">
              <Grid item>
                  <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={3}>
                          <Skeleton variant="rectangular" width={'100%'} height={38} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <Skeleton variant="rectangular" width={'100%'} height={38} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <Skeleton variant="rectangular" width={'100%'} height={38} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <Skeleton variant="rectangular" width={'100%'} height={38} />
                      </Grid>
                  </Grid>
              </Grid>
              <Grid item sx={{ marginTop: 2 }}>
                  <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                      <Grid item>
                          <Skeleton variant="rectangular" width={'100%'} height={250} />
                      </Grid>
                      <Grid item>
                          <Skeleton variant="rectangular" width={'100%'} height={250} />
                      </Grid>
                      <Grid item>
                          <Skeleton variant="rectangular" width={'100%'} height={250} />
                      </Grid>
                      <Grid item>
                          <Skeleton variant="rectangular" width={'100%'} height={250} />
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
      </CardContent>
  </Card>
);

export default PostingList;

// material-ui
import {Grid, TableCell, TableRow, Typography} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import * as React from "react";

// ==============================|| SKELETON - EARNING CARD ||============================== //

const UserList = () => (
  <TableRow>
      <TableCell>
          <Grid container spacing={2}>
              <Grid item>
                  <Skeleton variant="circular" width={60} height={60} />
              </Grid>
              <Grid item sm zeroMinWidth>
                  <Grid container spacing={1}>
                      <Grid item xs={12}>
                          <Skeleton variant="rounded" width={200} height={15} />
                      </Grid>
                      <Grid item xs={12}>
                          <Skeleton variant="rounded" width={'100%'} height={15} />
                      </Grid>
                      <Grid item xs={12}>
                          <Skeleton variant="rounded" width={100} height={15} />
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
      </TableCell>
      <TableCell>
          <Grid container spacing={1}>
              <Grid item xs={12}>
                  <Skeleton variant="rounded" width={50} height={15} sx={{ marginBottom: 1 }} />
                  <Skeleton variant="rounded" width={120} height={15} />
              </Grid>
              <Grid item xs={12}>
                  <Skeleton variant="rounded" width={50} height={15} sx={{ marginBottom: 1 }} />
                  <Skeleton variant="rounded" width={120} height={15} />
              </Grid>
          </Grid>
      </TableCell>
      <TableCell>
          <Grid container spacing={1}>
              <Grid item xs={12}>
                  <Skeleton variant="rounded" width={50} height={15} sx={{ marginBottom: 1 }} />
                  <Skeleton variant="rounded" width={120} height={15} />
              </Grid>
              <Grid item xs={12}>
                  <Skeleton variant="rounded" width={50} height={15} sx={{ marginBottom: 1 }} />
                  <Skeleton variant="rounded" width={120} height={15} />
              </Grid>
          </Grid>
      </TableCell>
      <TableCell>
          <Grid item xs={12} container spacing={1}>
              <Grid item xs={6}>
                  <Skeleton variant="rounded" width={80} height={15} sx={{ marginBottom: 1 }} />
                  <Grid container>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                  </Grid>
              </Grid>
              <Grid item xs={6}>
                  <Skeleton variant="rounded" width={80} height={15} sx={{ marginBottom: 1 }} />
                  <Grid container>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                  </Grid>
              </Grid>
          </Grid>
          <Grid item xs={12} container spacing={1}>
              <Grid item xs={4}>
                  <Skeleton variant="rounded" width={'100%'} height={30} sx={{ minWidth: 120, marginTop: 1 }}/>
              </Grid>
              <Grid item xs={4}>
                  <Skeleton variant="rounded" width={'100%'} height={30} sx={{ minWidth: 120, marginTop: 1 }}/>
              </Grid>
              <Grid item xs={4}>
                  <Skeleton variant="rounded" width={'100%'} height={30} sx={{ minWidth: 120, marginTop: 1 }}/>
              </Grid>
          </Grid>
      </TableCell>
  </TableRow>
);

export default UserList;

import { useEffect, useState, Fragment } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';

// third-party
import { isEmpty } from 'lodash';

// project imports
import ContactCard from 'ui-component/cards/ContactCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import User1 from 'assets/images/users/avatar-1.png';

import { useDispatch, useSelector } from 'store';
import { searchEndorsements } from 'store/slices/endorsement';

// assets
import { IconSearch } from '@tabler/icons';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import * as React from "react";

// ==============================|| CONTACT CARD ||============================== //

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [total, setTotal] = useState(0);
  const [endorsements, setEndorsements] = useState([]);
  const [endorsement, setEndorsement] = useState({});

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);

  // get all users details
  const endorsementState = useSelector((state) => state.endorsement);

  useEffect(() => {
    setEndorsements(endorsementState.endorsements);
    setLoading(endorsementState.loading);
    setErrors(endorsementState.errors);
  }, [endorsementState]);

  useEffect(() => {
    dispatch(searchEndorsements());
  }, []);

  return (
    <MainCard title="Trust">
      <Grid container spacing={gridSpacing}>
        <Grid
          className="block"
          item
          xs
          zeroMinWidth
          sx={{ display: 'flex' }}
        >
          <Grid container alignItems="center" spacing={gridSpacing}>
            <Grid item xs zeroMinWidth>
              <OutlinedInput
                id="input-search-card-style1"
                placeholder="Search Contact"
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={() => {}}>
                New
              </Button>
            </Grid>

            <Grid container direction="row" spacing={gridSpacing} sx={{ padding: 3 }}>
              {endorsements.map((endorsement, i) => (
                <Grid item xs={12} md={6} lg={4} xl={3} key={i}>
                  <ContactCard
                    endorsement={endorsement}
                    onActive={() => {
                    }}
                  />
                </Grid>
              ))}
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Index;

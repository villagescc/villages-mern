import * as React from "react";
import {useEffect, useRef} from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment, Pagination,
  TextField,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import {useDispatch, useSelector} from "store";
import useAuth from "hooks/useAuth";

// assets

// ==============================|| Setting ||============================== //

const Index = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();

  return (
      <MainCard
        title="Setting"
        content={false}
      >
        <CardContent>
        </CardContent>
      </MainCard>
  );
};

export default Index;

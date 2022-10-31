import {useEffect} from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import {Button, CardContent, Grid, InputAdornment, TextField} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { listing_type, radius } from '../../../constant';

// assets
import * as React from "react";
import {Search as SearchIcon, AddCircleRounded} from "@mui/icons-material";
import FormControlSelect from "../../../ui-component/extended/Form/FormControlSelect";
import {useDispatch, useSelector} from "../../../store";
import {filterPost, getCategories} from "../../../store/slices/posting";
import useAuth from "../../../hooks/useAuth";

// ==============================|| Posting ||============================== //

const Posting = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const [posts, setPosts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const postingState = useSelector((state) => state.posting);

  useEffect(() => {
    setCategories(postingState.categories);
    setPosts(postingState.posts);
  }, [postingState]);

  useEffect(() => {
    setLoading(true);
    dispatch(getCategories());
    dispatch(filterPost());
  }, []);

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setKeyword(newString || '');
  };

  return (
    <MainCard
      title="Posting List"
      content={false}
      secondary={
        isLoggedIn ? (
          <Button variant="contained" startIcon={<AddCircleRounded />}>
            Create
          </Button>
        ) : null
      }
    >
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={3}>
            <FormControlSelect
              currencies={
                [
                  {
                    value: '',
                    label: 'All categories'
                  },
                  ...categories.map(category => ({
                    value: category.title,
                    label: category.title
                  }))
                ]
              }
              captionLabel="Posting"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlSelect currencies={listing_type} captionLabel="Post type" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlSelect currencies={radius} captionLabel="Search area" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
              fullWidth
              onChange={handleSearch}
              placeholder="Search Post"
              value={keyword}
              size="small"
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={12}>

          </Grid>
        </Grid>
      </CardContent>
    </MainCard>
  );
};

export default Posting;

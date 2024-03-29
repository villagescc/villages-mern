import React, { useEffect, useState } from 'react';
import GoogleMap from 'google-map-react';
import DefaultAvatar from 'assets/images/auth/default.png';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AvatarIcon from 'ui-component/extended/Avatar';
import { useDispatch, useSelector } from '../../store';
import useAuth from 'hooks/useAuth';
import { Link, useParams } from 'react-router-dom';
import { SERVER_URL } from 'config';
import { getUserList } from 'store/slices/user';
import { Box, Button, Card, CardContent, CardMedia, Checkbox, Grid, InputAdornment, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import { listing_type, radius } from 'constant';
import { Search as SearchIcon } from '@mui/icons-material';
import { filterPost, getCategories, getSubCategories, getTags } from 'store/slices/posting';
import { filterMap } from 'store/slices/map';
import { styled } from '@mui/material/styles';
import MapPopover from './MapPopover';
// import { getUsers } from '../../store/slices/map';

const Index = () => {

  const [posts, setPosts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterData, setFilterData] = useState({
    filterCategory: '',
    filterType: '',
    filterRadius: '',
    network: [],
    keyword: ''
  });


  const trustNetwork = [
    {
      value: "TrustsMe",
      label: "Trusts me"
    },
    {
      value: "TrustedByMe",
      label: "Trusted"
    }
  ]

  const mapState = useSelector((state) => state.map);
  const postingState = useSelector((state) => state.posting);

  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getUserList());
  }, []);

  // const userState = useSelector((state) => state.user);
  // console.log(userState.users);

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setKeyword(newString || '');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setFilterData({ ...filterData, keyword: keyword });
    }
  };


  useEffect(() => {
    // setLoading(true);
    dispatch(getTags());
    dispatch(getCategories());
    dispatch(getSubCategories());
    dispatch(filterMap(filterData));
  }, [filterData]);


  useEffect(() => {
    setCategories(postingState.categories);
    handlePosts(mapState.posts)
  }, [postingState, mapState]);


  const handlePosts = (data) => {
    const mergedArray = [];
    const uniqueNames = new Set();

    data.forEach(item => {
      if (!uniqueNames.has(item.userId._id)) {
        mergedArray.push({ "id": item.userId._id, "user": item.userId, "post": [item] });
        uniqueNames.add(item.userId._id);
      } else {
        mergedArray.forEach(mergedItem => {
          if (mergedItem.id === item.userId._id) {
            mergedItem.post = mergedItem.post.concat(item);
          }
        });
      }
    });
    setPosts(mergedArray);
  }


  // console.log(posts, "posts")

  return (
    <div>
      <Grid container justifyContent="right" alignItems={'center'} spacing={1}>
        {!showFilter && <Grid item xs={12} sm={3}>
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
            onKeyPress={handleKeyPress}
            placeholder="Search Post"
            value={keyword}
            size="small"
          />
        </Grid>}
        <Grid item>
          <Button
            variant="contained"
            color={'secondary'}
            startIcon={showFilter ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            onClick={() => setShowFilter(!showFilter)}
          >
            Filter
          </Button>
        </Grid>
      </Grid>
      <CardContent>
        {showFilter && (
          <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} >
              <FormControlSelect
                currencies={[
                  {
                    value: '',
                    label: 'All categories'
                  },
                  ...categories?.map((category) => ({
                    value: category.title,
                    label: category.title
                  }))
                ]}
                currency={filterData.filterCategory}
                onChange={(e) => {
                  setFilterData({ ...filterData, filterCategory: e.target.value });
                }}
                captionLabel="Posting"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} >
              <FormControlSelect
                currencies={listing_type.filter((type) => ({
                  value: type.value,
                  label: type.value
                }))}
                currency={filterData.filterType}
                onChange={(e) => {
                  setFilterData({ ...filterData, filterType: e.target.value });
                }}
                captionLabel="Post type"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} >
              <FormControlSelect
                currencies={radius}
                currency={filterData.filterRadius}
                onChange={(e) => {
                  setFilterData({ ...filterData, filterRadius: e.target.value });
                }}
                captionLabel="Search area"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} >
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
                onKeyPress={handleKeyPress}
                placeholder="Search Post"
                value={keyword}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} >
              <Select
                // open={isDropdownOpen}
                fullWidth
                // onClose={() => setIsDropdownOpen(false)}
                id="standard-select-currency"
                multiple
                // onOpen={() => setIsDropdownOpen(true)}
                displayEmpty
                value={filterData.network}
                renderValue={(selected) => {
                  let x = selected.map(s => {
                    return trustNetwork.find(e => e.value == s)?.label
                  }).join(', ')
                  return x.trim().length == 0 ? "None" : x
                }}
                onChange={(e) => {
                  setFilterData({ ...filterData, network: e.target.value })
                  // clearTimeout(networkFilterRef.current)
                  // networkFilterRef.current = setTimeout(() => {
                  // setIsDropdownOpen(false)
                  // dispatch(getUserList(keyword, page, value, e.target.value));
                  // }, 1000);
                }}
                sx={{
                  "& .MuiSelect-select": { padding: "10px 32px 10px 14px" },
                  marginTop: { sm: "0", xs: "10px" }
                }}
              >
                {trustNetwork.map((option) => (
                  // <MenuItem key={option.value} value={option.value} >
                  //     {option.label}
                  // </MenuItem>
                  <MenuItem key={option.value} value={option.value} >
                    <Checkbox checked={filterData.network.indexOf(option.value) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        )}
      </CardContent>
      <div style={{ height: '80vh', width: '100%' }}>
        <GoogleMap
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            libraries: ['places']
          }}
          yesIWantToUseGoogleMapApiInternals
          center={[!isNaN(user?.latitude < 90 ? user?.latitude : 180 - user?.latitude) ? user?.latitude < 90 ? user?.latitude : 180 - user?.latitude : 19.4070173, !isNaN(user?.longitude < 180 ? user?.longitude : 360 - user?.longitude) ? user?.longitude < 180 ? user?.longitude : 360 - user?.longitude : -154.9231281]}
          zoom={12}
          defaultZoom={9}
        >
          {posts?.length &&
            posts.map((post, index) => {
              if (post?.user?.latitude && post?.user?.longitude) {
                return <MapPopover key={post?._id} lat={post?.user?.latitude} lng={post?.user?.longitude} post={post} index={index} />
              }
            })
          }
        </GoogleMap>
      </div >
    </div >
  );
};

export default Index;

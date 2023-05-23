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
import { Box, Button, Card, CardContent, CardMedia, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import { listing_type, radius } from 'constant';
import { Search as SearchIcon } from '@mui/icons-material';
import { filterPost, getCategories, getSubCategories, getTags } from 'store/slices/posting';
import DefaultPostingIcon from '../../assets/images/posting/default.png';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
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
    keyword: ''
  });
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
    dispatch(filterPost(filterData));
  }, [filterData]);


  useEffect(() => {
    setCategories(postingState.categories);
    setPosts(postingState.posts);
  }, [postingState]);

  // Styles
  const TrustWrapper = styled(Button)({
    padding: 2,
    minWidth: '100%',
    background: 'rgba(242,29,104,0.2)',
    '& svg': {
      color: '#f21d60'
    },
    '&:hover': {
      background: '#f21d60',
      '& svg': {
        color: '#fff'
      }
    }
  });

  const PaymentWrapper = styled(Button)({
    padding: 2,
    minWidth: '100%',
    background: 'rgba(29, 161, 242, 0.2)',
    '& svg': {
      color: '#1DA1F2'
    },
    '&:hover': {
      background: '#1DA1F2',
      '& svg': {
        color: '#fff'
      }
    }
  });

  const MessageWrapper = styled(Button)({
    padding: 2,
    minWidth: '100%',
    background: 'rgba(14, 118, 168, 0.12)',
    '& svg': {
      color: '#0E76A8'
    },
    '&:hover': {
      background: '#0E76A8',
      '& svg': {
        color: '#fff'
      }
    }
  });
  return (
    <div>
      <Grid container justifyContent="right" alignItems={'center'} spacing={1}>
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
            <Grid item xs={12} sm={3}>
              <FormControlSelect
                currencies={[
                  {
                    value: '',
                    label: 'All categories'
                  },
                  ...categories.map((category) => ({
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <FormControlSelect
                currencies={radius}
                currency={filterData.filterRadius}
                onChange={(e) => {
                  setFilterData({ ...filterData, filterRadius: e.target.value });
                }}
                captionLabel="Search area"
              />
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
                onKeyPress={handleKeyPress}
                placeholder="Search Post"
                value={keyword}
                size="small"
              />
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
          center={[user?.latitude < 90 ? user?.latitude : 180 - user?.latitude, user?.longitude < 180 ? user?.longitude : 360 - user?.longitude]}
          zoom={9}
          defaultZoom={10}
        >

          {posts.length &&
            posts.map((post, index) => {
              if (post?.userId?.latitude && post?.userId?.longitude) {
                // console.log(post.userId?.latitude, post.userId?.longitude, post?.userId?.profile?.name);
                return <AvatarIcon
                  lat={post?.userId?.latitude + index * 0.001}
                  lng={post?.userId?.longitude + index * 0.001}
                  alt={post?.postname}
                  key={post?._id}
                  src={post?.userId?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + post?.userId?.profile?.avatar : DefaultAvatar}
                  tooltip={
                    <Card sx={{ display: 'flex' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', padding: '10px', maxWidth: '50%' }}>
                        <CardContent sx={{ flex: '1 0 auto', padding: '0px' }}>
                          <div>
                            <Typography variant="h5" component={Link} to={`/listing/post/${post?._id}`}>
                              {post?.title}
                            </Typography>
                          </div>
                          <Typography variant="subtitle1" color="text.secondary" component="span" style={{ display: '-webkit-box', '-webkit-line-clamp': '5', overflow: 'hidden', '-webkit-box-orient': 'vertical' }}>
                            {post?.description}
                          </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                          <Grid container>
                            <Grid item xs={4} style={{ padding: '2px' }}>
                              <TrustWrapper component={Link} to={`/ripple/trust/${post?.userId?._id}`} >
                                <FavoriteIcon aria-label='icon-Like' />
                              </TrustWrapper>
                            </Grid>
                            <Grid item xs={4} style={{ padding: '2px' }} >
                              <PaymentWrapper component={Link} to={`/ripple/pay/${post?.userId?._id}`} >
                                <AccountBalanceWalletOutlined />
                              </PaymentWrapper>
                            </Grid>
                            <Grid item xs={4} style={{ padding: '2px' }} >
                              <MessageWrapper component={Link} to={`/personal/message/${post?.userId?._id}`} >
                                <ChatIcon />
                              </MessageWrapper>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{ maxWidth: '50%' }}
                        xs={6}
                        image={post?.photo ? `${SERVER_URL}/upload/posting/` + post.photo : DefaultPostingIcon}
                        alt="Live from space album cover"
                      />
                    </Card>
                  }
                // component={Link}
                // to={'/personal/profile'}
                />

              }
            })
          }


        </GoogleMap>
      </div >
    </div >
  );
};

export default Index;

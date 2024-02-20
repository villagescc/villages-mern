import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Grid, CardMedia, Typography, Divider, Box, Avatar, Tooltip, Button, styled, DialogActions, TextField, Dialog, DialogTitle, DialogContent, Switch } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Chip from 'ui-component/extended/Chip';
import { Stack, useTheme } from '@mui/system';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
// import { IconTallymark1 } from '@tabler/icons';

import { useSelector } from 'react-redux';
import { deletePost, getCategories, getPost, getSubCategories, getTags, submitPost } from 'store/slices/posting';
import { dispatch } from 'store';

// import isEmpty from 'utils/is-empty';
import { SERVER_URL } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import DefaultPostingIcon from 'assets/images/posting/default.png';
import DefaultAvatar from 'assets/images/auth/default.png';
// import ChatBubbleTwoToneIcon from '@mui/icons-material/FavoriteOutlined';
// import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';

import { geocodeByPlaceId } from 'react-places-autocomplete';

import ChatIcon from '@mui/icons-material/Chat';

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import AuthError from './digital product/AuthError';
import PaymentError from './digital product/PaymentError';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { openDialog } from 'store/slices/dialog';
import { openSnackbar } from 'store/slices/snackbar';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import { listing_type } from 'constant';
import { WithContext as ReactTags } from 'react-tag-input';
import { LoadingButton } from '@mui/lab';

const PostingDetail = () => {

  const DeleteWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(153,141,141,0.2)',
    '& svg': {
      color: '#2b2a2a'
    },
    '&:hover': {
      background: '#2b2a2a',
      '& svg': {
        color: '#fff'
      }
    }
  });

  const EditWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(242,214,29,0.2)',
    '& svg': {
      color: '#f2ab1d'
    },
    '&:hover': {
      background: '#f2b61d',
      '& svg': {
        color: '#fff'
      }
    }
  });

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: "#673ab7",
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  const KeyCodes = {
    comma: 188,
    enter: 13
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const { username, title } = useParams();
  const { isLoggedIn, user } = useAuth()
  const { borderRadius } = useConfig();
  const navigate = useNavigate();
  const [openCreate, setOpenCreate] = useState(false);
  const [editPost, setEditPost] = useState({})
  const [errors, setErrors] = React.useState({});
  const postingState = useSelector((state) => state.posting);
  const [location, setLocation] = React.useState('');
  const [errorType, setErrorType] = useState(null)
  const [loading, setLoading] = React.useState(false);

  const { post, error } = useSelector((state) => state.posting);

  useEffect(() => {
    dispatch(getPost(username, title));
  }, [username, title]);

  useEffect(() => {
    if (post && post.userId && post.userId.profile && post.userId.profile.placeId) {
      geocodeByPlaceId(post?.userId?.profile?.placeId).then((results) => setLocation(results[0].formatted_address));
    }
    dispatch(getTags());
    dispatch(getCategories());
    dispatch(getSubCategories());
    setEditPost(post)
  }, [post]);

  useEffect(() => {
    setErrors(postingState.error);
    setLoading(postingState.loading);
  }, [postingState]);

  useEffect(() => {
    if (error) {
      setErrorType(error?.statusCode == 401 ? "auth" : error?.statusCode == 402 ? "payment" : null)
    }
    return () => {
      setErrorType(null)
    }
  }, [error])

  const handleDeletePostClick = () => {
    dispatch(
      openDialog({
        open: true,
        title: 'Confirm',
        message: `Are you sure to delete ${post.title}?`,
        okLabel: 'delete',
        onOkClick: () => {
          dispatch(
            deletePost(post._id, () => {
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'You deleted post successfully.',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
              navigate('/listing/posts')
            })
          );
        }
      })
    );
  };

  const handleEditPostClick = () => {
    setEditPost({
      ...editPost,
      category: post?.subcategoryId?.categoryId?._id ?? post.categoryId?._id,
      paidContent: post.categoryId ? post.paidContent : null,
      subCategory: post.subcategoryId._id,
      isSingleTimePurchase: post.categoryId ? post.isSingleTimePurchase : null,
      tags: [...post?.tags?.map((tag) => ({ id: tag?.title, text: tag?.title }))],
      previewImage: post.photo ? `${SERVER_URL}/upload/posting/` + post.photo : null
    })
    setOpenCreate(true);
  };

  const handleAddition = (newTag) => {
    setEditPost({ ...editPost, tags: [...editPost?.tags, newTag] })
  };

  const handleDeleteTag = (i) => {
    setEditPost({ ...editPost, tags: [...editPost?.tags.filter((tag, index) => index !== i)] })
  };

  const handleOnChange = (e) => {
    setEditPost({ ...editPost, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];


    if (file) {
      reader.onloadend = () => {
        setEditPost({ ...editPost, file: file, previewImage: reader.result })
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    setLoading(true);
    const data = new FormData();
    data.append('id', editPost?._id);
    data.append('file', editPost?.file);
    data.append('type', editPost?.listing_type);
    data.append('title', editPost?.title);
    data.append('isSingleTimePurchase', editPost?.isSingleTimePurchase);
    data.append('paidContent', listing_type.find(x => x?.label === 'DIGITAL PRODUCT')?.value !== editPost?.listing_type ? "" : editPost?.paidContent);
    data.append('description', editPost?.description);
    data.append('price', editPost?.price);
    data.append('category', editPost?.category);
    data.append('subCategory', editPost?.subCategory);
    editPost?.tags.forEach((tag) => {
      data.append('tags', tag.text);
    });
    dispatch(
      submitPost(data, () => { }, () => {
        setOpenCreate(false);
        successAction();
        dispatch(getPost(username, title));
        setLoading(false)
      })
    );
  };
  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You have edited Post successfully',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );

  };

  return (
    <>
      <Helmet>
        <title>{post.title ?? "Villages.io"}</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.photo ? `${SERVER_URL}/upload/posting/` + post.photo : DefaultPostingIcon} />
        <meta property="twitter:title" content={post.title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <link rel='canonical' href={window.location.href} />
        <meta property="twitter:description" content={post.description} />
        <meta property="twitter:image" content={post.photo ? `${SERVER_URL}/upload/posting/` + post.photo : DefaultPostingIcon} />
      </Helmet>
      {(!errorType && !loading) ? <MainCard title={'Posting Detail'} border={false} elevation={16} content={false} boxShadow>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <CardMedia
                component="img"
                image={post.photo ? `${SERVER_URL}/upload/posting/` + post.photo : DefaultPostingIcon}
                sx={{ borderRadius: `${borderRadius}px`, overflow: 'hidden' }}
                alt={post.title}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Chip
                          size="small"
                          label={post.listing_type}
                          chipcolor={'success'}
                          sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="h3">{post.title}</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        justifyContent: 'flex-end',
                        // [theme.breakpoints.down('md')]: { justifyContent: 'flex-start' }
                      }}
                    >
                      {/* <Grid item>
                      <Tooltip placement="top" title="Message">
                        <Button variant="outlined" sx={{ minWidth: 32, height: 32, p: 0 }}>
                          <ChatBubbleTwoToneIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Grid> */}
                      <Grid item display={'flex'} gap={1}>
                        <Tooltip placement="top" title="Message">
                          <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ minWidth: 32, height: 32, p: 0 }}
                            component={Link}
                            to={`/personal/message/${post?.userId?._id}`}
                          >
                            <ChatIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        {post?.userId?._id === user?._id && <>
                          <EditWrapper sx={{ minWidth: 32, height: 32, p: 0 }} onClick={handleEditPostClick}>
                            <EditIcon />
                          </EditWrapper>
                          <DeleteWrapper sx={{ minWidth: 32, height: 32, p: 0 }} onClick={handleDeletePostClick}>
                            <DeleteIcon />
                          </DeleteWrapper>
                        </>
                        }
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">{post.description}</Typography>
                </Grid>
                {post?.listing_type === 'DIGITAL PRODUCT' && <Grid item xs={12}>
                  <Typography variant="body2">{post.paidContent}</Typography>
                </Grid>}
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h2" color="primary">
                      {`${post.price ?? 0} V.H.`}
                      {/* {post.price}V.H. */}
                    </Typography>
                  </Stack>
                </Grid>
                {(Boolean(post?.subcategoryId?.categoryId?.title) && Boolean(post?.subcategoryId?.title)) && <Grid item xs={12}>
                  <MuiBreadcrumbs
                    sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                    aria-label="breadcrumb"
                    separator={'>'}
                  >
                    <Typography variant="body">{post?.subcategoryId?.categoryId?.title}</Typography>
                    <Typography variant="body">{post?.subcategoryId?.title}</Typography>
                  </MuiBreadcrumbs>
                </Grid>}
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {post.tags && post?.tags.map((tag, index) => <Chip key={index} label={tag.title} size="small" />)}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Avatar
                      alt={post?.userId?.username}
                      src={post?.userId?.profile?.avatar ? `${SERVER_URL}/upload/avatar/` + post?.userId?.profile?.avatar : DefaultAvatar}
                      tooltip={post?.userId?.username}
                      component={Link}
                      to={`/${post?.userId?.username}`}
                      style={{ textDecoration: 'none' }}
                    />
                    <Typography variant="h5" sx={{ marginLeft: 1 }}>
                      {post?.userId?.username}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="h5" sx={{ marginLeft: 1 }}>
                      Name
                    </Typography>
                    <Typography variant="caption" sx={{ marginLeft: 1 }}>
                      {post?.userId?.profile?.name}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="h5" sx={{ marginLeft: 1 }}>
                      Location
                    </Typography>
                    <Typography variant="caption" sx={{ marginLeft: 1 }}>
                      {post?.userId?.profile?.placeId ? (
                        <Chip label={location} size="small" chipcolor={'warning'} />
                      ) : (
                        // post?.userId?.profile?.placeId
                        <Chip label="No location" size="small" chipcolor={'warning'} />
                      )}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="h5" sx={{ marginLeft: 1 }}>
                      Recently active
                    </Typography>
                    <Typography variant="caption" sx={{ marginLeft: 1 }}>
                      {moment(post?.userId?.profile?.recentlyActive).format('YYYY-MM-DD')}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="h5" sx={{ marginLeft: 1 }}>
                      Balance
                    </Typography>
                    <Typography variant="h4" sx={{ marginLeft: 1 }}>
                      {Number(Number(post?.account?.balance).toFixed(2)).toString()} V.H.
                      {`${(isLoggedIn && ((post?.account?.balance ?? 0) > 0 && (post?.trustedBalance ?? 0) > 0)) ? `(Trusted: ${post?.trustedBalance ?? 0} V.H.)` : ((post?.account?.balance ?? 0) < 0) ? `(You can send ${post?.userId?.username} ${post?.trustedBalance} V.H.)` : ""}`}
                      {/* {post.price}V.H. */}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </MainCard> : errorType == 'auth' ? <AuthError></AuthError> : errorType == 'payment' ? <PaymentError></PaymentError> : null}
      <Dialog fullWidth maxWidth={'md'} open={openCreate} onClose={() => setOpenCreate(false)} scroll={'body'}>
        {openCreate && (
          <>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogContent>
              <Box
                noValidate
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 2
                }}
              >
                <FormControlSelect
                  currencies={listing_type.filter((type) => type.value)}
                  currency={editPost?.listing_type}
                  onChange={(e) => {
                    setEditPost({ ...editPost, listing_type: e.target.value })
                  }}
                  captionLabel="Listing type"
                  error={errors?.listing_type}
                />
                <TextField
                  fullWidth
                  label="Title"
                  size={'small'}
                  sx={{ my: 1 }}
                  value={editPost?.title}
                  onChange={(e) => handleOnChange(e)}
                  error={errors?.title}
                  name='title'
                  helperText={errors?.title}
                />
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  sx={{ my: 1 }}
                  value={editPost?.description}
                  onChange={(event) => handleOnChange(event)}
                />
                <TextField
                  fullWidth
                  type="number"
                  name='price'
                  label="Price (Village Hours)"
                  size={'small'}
                  min={0}
                  sx={{ my: 1.5 }}
                  value={editPost?.price}
                  onChange={(event) => handleOnChange(event)}
                />
                <FormControlSelect
                  currencies={[
                    ...postingState.categories.map((category) => ({
                      value: category._id,
                      label: category.title
                    }))
                  ]}
                  currency={editPost?.category}
                  onChange={(e) => {
                    setEditPost({ ...editPost, subCategory: '', category: e.target.value })
                  }}
                  error={errors?.category}
                  captionLabel="CATEGORY"
                />
                {listing_type.find(x => x?.label === 'DIGITAL PRODUCT')?.value === editPost?.listing_type && (<>
                  <TextField
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Paid content"
                    multiline
                    rows={3}
                    name='paidContent'
                    sx={{ my: 1 }}
                    error={errors?.paidContent}
                    helperText={errors?.paidContent}
                    value={editPost?.paidContent}
                    onChange={(event) => handleOnChange(event)}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IOSSwitch sx={{ my: 1 }} onChange={e => {
                      setEditPost({ ...editPost, isSingleTimePurchase: e.target.checked })
                    }} checked={editPost?.isSingleTimePurchase} />
                    <Typography>Single Purchase Item</Typography>
                  </Stack>
                </>)}
                <FormControlSelect
                  currencies={postingState.subCategories
                    .filter((subCategory) => subCategory.categoryId === editPost?.category)
                    .map((category) => ({
                      value: category._id,
                      label: category.title
                    }))}
                  currency={editPost?.subCategory}
                  onChange={(e) => handleOnChange(e)}
                  captionLabel="SUB-CATEGORY"
                  error={errors?.subCategory}
                />
                <Button variant="contained" component="label" sx={{ width: 200 }}>
                  {editPost?.previewImage ? 'Change Image' : 'Choose Image'}
                  <input type="file" onChange={(e) => handleImageChange(e)} hidden accept='image/*' />
                </Button>
                {editPost?.previewImage && <img src={editPost?.previewImage} style={{ width: 200, borderRadius: 10, marginTop: 10 }} />}
                <ReactTags
                  tags={editPost?.tags}
                  suggestions={postingState.tags.map((suggestion) => ({
                    id: suggestion._id,
                    text: suggestion.title
                  }))}
                  handleDelete={handleDeleteTag}
                  handleAddition={handleAddition}
                  delimiters={delimiters}
                  placeholder={'Tags'}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCreate(false)}>Close</Button>
              <LoadingButton onClick={handleSubmitPost} variant={'contained'} loading={loading}>
                Update
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PostingDetail;

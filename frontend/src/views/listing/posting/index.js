import * as React from 'react';
import { useEffect, useRef } from 'react';
import { styled } from '@mui/styles';
import { LoadingButton } from '@mui/lab';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import PostingListSkeleton from 'ui-component/cards/Skeleton/PostingList';
import { listing_type, radius } from 'constant';

// assets
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'utils/axios';
import { Search as SearchIcon, AddCircleRounded } from '@mui/icons-material';
import FormControlSelect from 'ui-component/extended/Form/FormControlSelect';
import { useDispatch, useSelector } from 'store';
import { submitPost, filterPost, getCategories, getSubCategories, getTags, deletePost } from 'store/slices/posting';
import { openSnackbar } from 'store/slices/snackbar';
import { openDialog } from 'store/slices/dialog';
import useAuth from 'hooks/useAuth';
import PostingCard from 'ui-component/cards/PostingCard';
import Empty from 'ui-component/Empty';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { SERVER_URL } from 'config';
import { Stack } from '@mui/system';

// ==============================|| Posting ||============================== //
const KeyCodes = {
  comma: 188,
  enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Posting = () => {
  const theme = useTheme();
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
  let { pageId } = useParams();
  if (!pageId) pageId = 1;
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();
  // const networkFilterRef = useRef(null)
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [keyword, setKeyword] = React.useState('');
  // const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [posts, setPosts] = React.useState([]);
  const [post, setPost] = React.useState(null)
  const [trustedBalance, setTrustedBalance] = React.useState(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false)
  const [total, setTotal] = React.useState(0);
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [tagSuggestion, setTagSuggestion] = React.useState([]);

  // FILTER POSTING
  // const [filterCategory, setFilterCategory] = React.useState('');
  // const [filterType, setFilterType] = React.useState('');
  // const [filterRadius, setFilterRadius] = React.useState('');
  const [filterData, setFilterData] = React.useState({
    filterCategory: '',
    filterType: '',
    filterRadius: '',
    keyword: '',
    network: [],
    page: pageId ? Number(pageId) : 1
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

  // POST MODAL FORM
  const [openCreate, setOpenCreate] = React.useState(false);
  const [id, setId] = React.useState('');
  const [type, setType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [isFetchingPurchaseLimit, setIsFetchingPurchaseLimit] = React.useState(false)
  const [paidContent, setPaidContent] = React.useState('')
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [tags, setTags] = React.useState([]);
  const [isSingleTimePurchase, setIsSingleTimePurchase] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState(null);
  const [showFilter, setShowFilter] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const postingState = useSelector((state) => state.posting);

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const navigate = useNavigate();

  const handleAddition = (newTag) => {
    setTags([...tags, newTag]);
  };

  // useEffect(() => {
  //   dispatch(filterPost(filterData));
  // }, [location, pageId]);

  useEffect(() => {
    setLoading(postingState.loading);
    setTagSuggestion(postingState.tags);
    setCategories(postingState.categories);
    setSubCategories(postingState.subCategories);
    setPosts(postingState.posts);
    setTotal(postingState.total);
    setErrors(postingState.error);
  }, [postingState, count]);

  useEffect(() => {
    setLoading(true);
    dispatch(getTags());
    dispatch(getCategories());
    dispatch(getSubCategories());
    dispatch(filterPost(filterData));
  }, [filterData, count]);

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setKeyword(newString || '');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setFilterData({ ...filterData, keyword: keyword });
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];


    if (file) {
      reader.onloadend = () => {
        setFile(file);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePostClick = () => {
    setId('');
    setType('');
    setTitle('');
    setDescription('');
    setPrice(0);
    setCategory('');
    setSubCategory('');
    setTags([]);
    setIsSingleTimePurchase(false)
    setPaidContent('')
    setFile(null);
    setPreviewImage(null);
    setOpenCreate(true);
  };

  const handleDeletePostClick = (post) => {
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
            })
          );
        }
      })
    );
  };

  const handleEditPostClick = (post) => {
    setId(post._id);
    setType(post.listing_type);
    setTitle(post.title);
    setDescription(post.description);
    setPrice(post.price);
    setCategory(post?.subcategoryId?.categoryId?._id ?? post.categoryId?._id);
    setPaidContent(post.categoryId ? post.paidContent : null);
    setIsSingleTimePurchase(post.categoryId ? post.isSingleTimePurchase : null);
    setSubCategory(post?.subcategoryId?._id);
    setTags([...post?.tags?.map((tag) => ({ id: tag?.title, text: tag?.title }))]);
    setPreviewImage(post.photo ? `${SERVER_URL}/upload/posting/` + post.photo : null);
    setOpenCreate(true);
  };

  const handleSubmitPost = () => {
    setLoading(true);
    const data = new FormData();
    data.append('id', id);
    data.append('file', file);
    data.append('type', type);
    data.append('title', title);
    data.append('isSingleTimePurchase', isSingleTimePurchase);
    data.append('paidContent', categories.find(x => x?.title === 'DIGITAL PRODUCT')?._id !== category ? "" : paidContent);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category);
    data.append('subCategory', categories.find(x => x?.title === 'DIGITAL PRODUCT')?._id === category ? "" : subCategory);
    tags.forEach((tag) => {
      data.append('tags', tag.text);
    });
    dispatch(
      submitPost(data, setCount, () => {
        setOpenCreate(false);
        successAction();
        dispatch(filterPost(filterData));
        setLoading(false)
      })
    );
  };
  const successAction = () => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'You have created new Post successfully',
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
      <MainCard
        sx={{
          ".MuiCardHeader-action": {
            display: "flex",
            flex: "unset"
          }
        }}
        title="Posting List"
        content={false}
        secondary={
          <>
            <Grid sx={{ justifyContent: { xs: 'left' } }} container alignItems={'center'} spacing={1}>
              {isLoggedIn ? (
                // <Button variant="contained" startIcon={<AddCircleRounded />} onClick={handleCreatePostClick}>
                //   Create
                // </Button>
                <>
                  {!showFilter && <Grid item xs={12} sm={6}>
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
                  <Grid item >
                    <Button variant="contained" startIcon={<AddCircleRounded />} onClick={handleCreatePostClick}>
                      New
                    </Button>
                  </Grid>
                  <Grid item >
                    <Button
                      variant="contained"
                      color={'secondary'}
                      startIcon={showFilter ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      Filter
                    </Button>
                  </Grid>
                </>
              ) : (
                // <Grid container justifyContent="right" alignItems={'center'} spacing={1}>
                <>
                  {!showFilter && <Grid item xs={12} sm={9}>
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
                  <Grid item xs={12} sm={3}>
                    <Button
                      variant="contained"
                      color={'secondary'}
                      startIcon={showFilter ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      Filter
                    </Button>
                    {/* </Grid> */}
                  </Grid>
                </>
              )
              }
            </Grid>
          </>

        }
      >
        {postingState.isPostsLoading ? (
          <PostingListSkeleton />
        ) : (
          <CardContent>
            <Grid container spacing={2} mt={0} justifyContent={showFilter ? "space-between" : "end"} alignItems="center" sx={{ my: 1 }}>
              {/* <Grid container justifyContent="flex-end" alignItems="center" spacing={2}> */}
              {showFilter && (
                <>
                  <Grid item xs={12} sm={6} md={4} lg={3} >
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
                    {/* <TextField
                      sx={{ marginTop: { xs: "14px", sm: "0" } }}
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
                    /> */}
                    <Select
                      // open={isDropdownOpen}
                      fullWidth
                      // onClose={() => setIsDropdownOpen(false)}
                      disabled={loading}
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
                </>
              )}
              {posts.length > 0 && <Grid item xs={12} sm={6} md={4}>
                <Pagination
                  sx={{
                    ".MuiPagination-ul": {
                      justifyContent: "flex-end"
                    }
                  }}
                  count={Math.ceil(total / 12)}
                  defaultPage={Number(pageId)}
                  page={filterData.page}
                  onChange={(e, p) => {
                    navigate(`/listing/posts/page/${p}`);
                    setFilterData({ ...filterData, page: p });
                  }}
                  color="secondary"
                />
                {/* </Grid> */}
              </Grid>}
            </Grid>
            <Grid container justifyContent="start" alignItems="top" spacing={2} sx={{ my: 1 }}>
              {posts.length > 0 ? (
                posts.slice(0).map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index} >
                    <PostingCard
                      id={post?._id}
                      recentlyActive={post?.userId?.profile?.recentlyActive}
                      avatar={post.userId?.profile?.avatar}
                      post={post?.photo}
                      title={post?.title}
                      description={post?.description}
                      listingType={post?.listing_type}
                      own={post?.userId?._id === user?._id}
                      author={post?.userId?._id}
                      userData={post?.userId}
                      isTrusted={post?.isTrusted}
                      onDelete={() => handleDeletePostClick(post)}
                      onEdit={() => handleEditPostClick(post)}
                      onPurchase={() => {
                        setPost(post)
                        setIsFetchingPurchaseLimit(true)
                        axios.post(`${SERVER_URL}/api/posting/purchase/getPurchaseLimit`, { postID: post?._id }).then((res) => {
                          // console.log(res.data);
                          if (res.data.success && res.data.trustedBalance > 0 && user.account.balance >= post.price) {
                            setTrustedBalance(res.data.trustedBalance)
                            // dispatch(
                            //   openDialog({
                            //     open: true,
                            //     title: 'Confirm',
                            //     message: `Are you sure want to purchase this ?`,
                            //     okLabel: 'Yes',
                            //     onOkClick: () => {
                            //       axios.post('/posting/purchase', { _id: post?._id }).then(res => {
                            //         console.log(res.data, 'resssss');
                            //         if (res.data.success) {
                            //           dispatch(
                            //             openSnackbar({
                            //               open: true,
                            //               message: res.data.message,
                            //               variant: 'alert',
                            //               alert: {
                            //                 color: 'success',
                            //                 severity: 'error'
                            //               },
                            //               close: false
                            //             })
                            //           )
                            //         }
                            //         else if (!res.data.success) {
                            //           dispatch(
                            //             openSnackbar({
                            //               open: true,
                            //               message: res.data.message,
                            //               variant: 'alert',
                            //               alert: {
                            //                 color: 'error',
                            //                 severity: 'error'
                            //               },
                            //               close: false
                            //             })
                            //           )
                            //         }
                            //       }).catch(err => {
                            //         console.log(err);
                            //       }).finally(() => {

                            //       })
                            //     }
                            //   })
                            // )
                            setIsPurchaseModalOpen(true)
                          }
                          else if (res.data.trustedBalance <= 0) {
                            dispatch(openSnackbar({
                              open: true,
                              message: `You do not have a credit line available with ${post?.userId?.username}`,
                              variant: 'alert',
                              alert: {
                                color: 'error',
                                severity: 'error'
                              },
                              close: false
                            }))
                          }
                          else if (user.account.balance < post.price) {
                            dispatch(openSnackbar({
                              open: true,
                              message: `You do not have enough balance to purchase this item`,
                              variant: 'alert',
                              alert: {
                                color: 'error',
                                severity: 'error'
                              },
                              close: false
                            }))
                          }
                          else {
                            openSnackbar({
                              open: true,
                              message: 'Something went wrong',
                              variant: 'alert',
                              alert: {
                                color: 'error',
                                severity: 'error'
                              },
                              close: false
                            })
                          }
                        }).finally(() => {
                          setIsFetchingPurchaseLimit(false)
                        })
                      }}
                      isFetchingPurchaseLimit={isFetchingPurchaseLimit}
                      category={post.categoryId}
                      paidContent={post.paidContent}
                      purchasedBy={post.purchasedBy}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Empty />
                </Grid>
              )}
            </Grid>
            <Dialog
              open={isPurchaseModalOpen}
              onClose={() => {
                setIsPurchaseModalOpen(false)
              }}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                Are you sure want to purchase this ?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {`You can purchase this item! You can spend up to ${trustedBalance} village hours with ${post?.userId?.username}`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => {
                    setIsPurchaseModalOpen(false)
                  }}
                >
                  No
                </Button>
                <Button
                  autoFocus
                  onClick={() => {
                    axios.post('/posting/purchase', { _id: post?._id }).then(res => {
                      console.log(res.data, 'resssss');
                      if (res.data.success) {
                        dispatch(
                          openSnackbar({
                            open: true,
                            message: res.data.message,
                            variant: 'alert',
                            alert: {
                              color: 'success',
                              severity: 'success'
                            },
                            close: false
                          })
                        )
                        dispatch(filterPost(filterData))
                        setTrustedBalance(null)
                        setPost(null)
                        setIsPurchaseModalOpen(false)
                      }
                      else if (!res.data.success) {
                        dispatch(
                          openSnackbar({
                            open: true,
                            message: res.data.message,
                            variant: 'alert',
                            alert: {
                              color: 'error',
                              severity: 'error'
                            },
                            close: false
                          })
                        )
                      }
                    }).catch(err => {
                      console.log(err);
                    })
                  }}
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            {posts.length > 0 && (
              <Grid container spacing={2} justifyContent="end" sx={{ my: 1 }}>
                <Pagination
                  count={Math.ceil(total / 12)}
                  defaultPage={Number(pageId)}
                  page={filterData.page}
                  onChange={(e, p) => {
                    navigate(`/listing/posts/page/${p}`);
                    setFilterData({ ...filterData, page: p });
                  }}
                  color="secondary"
                />
              </Grid>
            )}
          </CardContent>
        )}
      </MainCard >
      <Dialog fullWidth maxWidth={'md'} open={openCreate} onClose={() => setOpenCreate(false)} scroll={'body'}>
        {openCreate && (
          <>
            <DialogTitle>Create a new list</DialogTitle>
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
                  currency={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  captionLabel="Listing type"
                  error={errors?.type}
                />
                <TextField
                  fullWidth
                  label="Title"
                  size={'small'}
                  sx={{ my: 1 }}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  error={errors?.title}
                  helperText={errors?.title}
                />
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  label="Description"
                  multiline
                  rows={3}
                  sx={{ my: 1 }}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Price (Village Hours)"
                  size={'small'}
                  min={0}
                  sx={{ my: 1.5 }}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
                <FormControlSelect
                  currencies={[
                    ...categories.map((category) => ({
                      value: category._id,
                      label: category.title
                    }))
                  ]}
                  currency={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory('');
                  }}
                  error={errors?.category}
                  captionLabel="CATEGORY"
                />
                {categories.find(x => x?.title === 'DIGITAL PRODUCT')?._id === category && (<>
                  <TextField
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Paid content"
                    multiline
                    rows={3}
                    sx={{ my: 1 }}
                    error={errors?.paidContent}
                    helperText={errors?.paidContent}
                    value={paidContent}
                    onChange={(event) => setPaidContent(event.target.value)}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IOSSwitch sx={{ my: 1 }} onChange={e => setIsSingleTimePurchase(e.target.checked)} checked={isSingleTimePurchase} />
                    <Typography>Single Purchase Item</Typography>
                  </Stack>
                </>)}
                <FormControlSelect
                  currencies={subCategories
                    .filter((subCategory) => subCategory.categoryId === category)
                    .map((category) => ({
                      value: category._id,
                      label: category.title
                    }))}
                  currency={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  captionLabel="SUB-CATEGORY"
                  error={errors?.subCategory}
                />
                <Button variant="contained" component="label" sx={{ width: 200 }}>
                  {previewImage ? 'Change Image' : 'Choose Image'}
                  <input type="file" onChange={(e) => handleImageChange(e)} hidden accept='image/*' />
                </Button>
                {previewImage && <img src={previewImage} style={{ width: 200, borderRadius: 10, marginTop: 10 }} />}
                <ReactTags
                  tags={tags}
                  suggestions={tagSuggestion.map((suggestion) => ({
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
                Submit
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Posting;

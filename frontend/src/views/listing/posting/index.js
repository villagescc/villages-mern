import * as React from 'react';
import { useEffect, useRef } from 'react';
import { LoadingButton } from '@mui/lab';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Pagination,
  TextField
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import PostingListSkeleton from 'ui-component/cards/Skeleton/PostingList';
import { listing_type, radius } from 'constant';

// assets
import { WithContext as ReactTags } from 'react-tag-input';
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

// ==============================|| Posting ||============================== //
const KeyCodes = {
  comma: 188,
  enter: 13
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Posting = () => {
  const theme = useTheme();
  let { pageId } = useParams();
  if (!pageId) pageId = 1;
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [keyword, setKeyword] = React.useState('');
  const [posts, setPosts] = React.useState([]);
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
    page: pageId ? Number(pageId) : 1
  });

  // POST MODAL FORM
  const [openCreate, setOpenCreate] = React.useState(false);
  const [id, setId] = React.useState('');
  const [type, setType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [tags, setTags] = React.useState([]);
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
    setCategory(post.subcategoryId.categoryId._id);
    setSubCategory(post.subcategoryId._id);
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
    data.append('description', description);
    data.append('price', price);
    data.append('category', category);
    data.append('subCategory', subCategory);
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
        title="Posting List"
        content={false}
        secondary={
          isLoggedIn ? (
            // <Button variant="contained" startIcon={<AddCircleRounded />} onClick={handleCreatePostClick}>
            //   Create
            // </Button>
            <Grid container justifyContent="right" alignItems={'center'} spacing={1}>
              <Grid item>
                <Button variant="contained" startIcon={<AddCircleRounded />} onClick={handleCreatePostClick}>
                  New
                </Button>
              </Grid>
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
          ) : (
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
          )
        }
      >
        {loading ? (
          <PostingListSkeleton />
        ) : (
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
            <Grid container justifyContent="start" alignItems="top" spacing={2} sx={{ my: 1 }}>
              {posts.length > 0 ? (
                posts.slice(0).map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index} >
                    <PostingCard
                      id={post._id}
                      avatar={post.userId?.profile?.avatar}
                      post={post.photo}
                      title={post.title}
                      description={post.description}
                      own={post.userId?._id === user?._id}
                      author={post.userId?._id}
                      userData={post.userId}
                      isTrusted={post?.isTrusted}
                      onDelete={() => handleDeletePostClick(post)}
                      onEdit={() => handleEditPostClick(post)}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Empty />
                </Grid>
              )}
            </Grid>
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

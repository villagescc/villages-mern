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
import PostingList from "../../../ui-component/cards/Skeleton/PostingList";
import { listing_type, radius } from '../../../constant';

// assets
import { WithContext as ReactTags } from 'react-tag-input';
import {Search as SearchIcon, AddCircleRounded} from "@mui/icons-material";
import FormControlSelect from "../../../ui-component/extended/Form/FormControlSelect";
import {useDispatch, useSelector} from "../../../store";
import {createPost, filterPost, getCategories, getSubCategories, getTags} from "../../../store/slices/posting";
import useAuth from "../../../hooks/useAuth";
import UserProfileCard from "../../../ui-component/cards/UserProfileCard";
import SubCard from "../../../ui-component/cards/SubCard";

// ==============================|| Posting ||============================== //
const KeyCodes = {
  comma: 188,
  enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Posting = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const [posts, setPosts] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [categories, setCategories] = React.useState([]);
  const [subCategories, setSubCategories] = React.useState([]);
  const [tagSuggestion, setTagSuggestion] = React.useState([]);
  const [tags, setTags] = React.useState([]);

  const [filterCategory, setFilterCategory] = React.useState('');
  const [filterType, setFilterType] = React.useState('');
  const [filterRadius, setFilterRadius] = React.useState('');

  const [type, setType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [file, setFile] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);

  const postingState = useSelector((state) => state.posting);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (newTag) => {
    setTags([...tags, newTag]);
  }

  useEffect(() => {
    setLoading(postingState.loading);
    setTagSuggestion(postingState.tags);
    setCategories(postingState.categories);
    setSubCategories(postingState.subCategories);
    setPosts(postingState.posts);
    setTotal(postingState.total);
  }, [postingState]);

  useEffect(() => {
    setLoading(true);
    dispatch(getTags());
    dispatch(getCategories());
    dispatch(getSubCategories());
    dispatch(filterPost());
  }, []);

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setKeyword(newString || '');
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      dispatch(filterPost(filterCategory, filterType, filterRadius, keyword, page))
    }
  }

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setFile(file);
      setPreviewImage(reader.result);
    }

    reader.readAsDataURL(file)
  }

  const submitPost = () => {
    const data = new FormData();
    data.append('file', file);
    data.append('type', type)
    data.append('title', title)
    data.append('description', description)
    data.append('price', price)
    data.append('category', category)
    data.append('subCategory', subCategory)
    tags.forEach(tag => {
      data.append('tags', tag.text);
    })
    dispatch(createPost(data, () => {
      setOpenCreate(false);
      dispatch(filterPost(filterCategory, filterType, filterRadius, keyword, page))
    }))
  }

  return (
    <>
      <MainCard
        title="Posting List"
        content={false}
        secondary={
          isLoggedIn ? (
            <Button variant="contained" startIcon={<AddCircleRounded />} onClick={() => setOpenCreate(true)}>
              Create
            </Button>
          ) : null
        }
      >
        {
          loading ?
            <PostingList /> : (
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
                      currency={filterCategory}
                      onChange={e => {
                        setFilterCategory(e.target.value);
                        dispatch(filterPost(e.target.value, filterType, filterRadius, keyword, page))
                      }}
                      captionLabel="Posting"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControlSelect
                      currencies={listing_type}
                      currency={filterType}
                      onChange={e => {
                        setFilterType(e.target.value)
                        dispatch(filterPost(filterCategory, e.target.value, filterRadius, keyword, page))
                      }}
                      captionLabel="Post type"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControlSelect
                      currencies={radius}
                      currency={filterRadius}
                      onChange={e => {
                        setFilterRadius(e.target.value)
                        dispatch(filterPost(filterCategory, filterType, e.target.value, keyword, page))
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
                <Grid container spacing={2} justifyContent="end" sx={{ my: 1 }}>
                  <Pagination
                    count={Math.ceil(total / 12)}
                    page={page}
                    onChange={(e, p) => {
                      setPage(p)
                      dispatch(filterPost(filterCategory, filterType, filterRadius, keyword, p))
                    }}
                    color="secondary"
                  />
                </Grid>
                <Grid container justifyContent="start" alignItems="top" spacing={2} sx={{ my: 1 }}>
                  {
                    posts.map((post, index) => (
                      <Grid item xs={12} sm={3} key={index}>
                        <UserProfileCard
                          avatar={user.avatar}
                          post={post.photo}
                          title={post.title}
                          description={post.description}
                        />
                      </Grid>
                    ))
                  }
                </Grid>
                <Grid container spacing={2} justifyContent="end" sx={{ my: 1 }}>
                  <Pagination
                    count={Math.ceil(total / 12)}
                    page={page}
                    onChange={(e, p) => {
                      setPage(p)
                      dispatch(filterPost(filterCategory, filterType, filterRadius, keyword, p))
                    }}
                    color="secondary"
                  />
                </Grid>
              </CardContent>
            )
        }
      </MainCard>
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
                  marginTop: 2,
                }}
              >
                <FormControlSelect
                  currencies={listing_type}
                  currency={type}
                  onChange={e => {
                    setType(e.target.value);
                  }}
                  captionLabel="Listing type"
                />
                <TextField
                  fullWidth
                  label="Title"
                  size={'small'}
                  sx={{ my: 1 }}
                  value={title}
                  onChange={event => setTitle(event.target.value)}
                />
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  label="Description"
                  multiline
                  rows={3}
                  sx={{ my: 1 }}
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  size={'small'}
                  min={0}
                  sx={{ my: 1.5 }}
                  value={price}
                  onChange={event => setPrice(event.target.value)}
                />
                <FormControlSelect
                  currencies={
                    [
                      {
                        value: '',
                        label: 'All categories'
                      },
                      ...categories.map(category => ({
                        value: category._id,
                        label: category.title
                      }))
                    ]
                  }
                  currency={category}
                  onChange={e => {
                    dispatch(getSubCategories(e.target.value));
                    setCategory(e.target.value);
                  }}
                  captionLabel="CATEGORY"
                />
                <FormControlSelect
                  currencies={
                    subCategories.map(category => ({
                      value: category._id,
                      label: category.title
                    }))
                  }
                  currency={subCategory}
                  onChange={e => setSubCategory(e.target.value)}
                  captionLabel="SUB-CATEGORY"
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{ width: 200 }}
                >
                  {
                    previewImage ? "Change Image" : "Choose Image"
                  }
                  <input
                    type="file"
                    onChange={e => handleImageChange(e)}
                    hidden
                  />
                </Button>
                {
                  previewImage && <img src={previewImage} style={{ width: 200, borderRadius: 10, marginTop: 10 }} />
                }
                <ReactTags
                  tags={tags}
                  suggestions={
                    tagSuggestion.map(suggestion => ({
                      id: suggestion.title,
                      text: suggestion.title
                    }))
                  }
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  delimiters={delimiters}
                  placeholder={"Tags"}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCreate(false)}>Close</Button>
              <Button onClick={submitPost} variant={'contained'}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default Posting;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Grid, Typography, Badge, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

// project imports
import Avatar from '../extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import DefaultUserIcon from '../../assets/images/auth/default.png';
import DefaultPostingIcon from '../../assets/images/posting/default.png';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { openSnackbar } from 'store/slices/snackbar';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
// import useAuth from '../../hooks/useAuth';
import axios from 'utils/axios';
import { SERVER_URL } from 'config';
import Chip from 'ui-component/extended/Chip';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'store';
import { Box } from '@mui/system';

// styles
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

const TrustWrapper = styled(Button)({
  padding: 8,
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
  padding: 8,
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
  padding: 8,
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: '#FF0000',
  },
}));

// ==============================|| USER PROFILE CARD ||============================== //

const PostingCard = ({ id, avatar, title, post, author, description, listingType, own, userData, recentlyActive, isTrusted, ...other }) => {
  const theme = useTheme();
  const { user, init } = useAuth();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  // const [post, setPost] = React.useState(null)
  const [trustedBalance, setTrustedBalance] = React.useState(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false)
  const [isFetchingPurchaseLimit, setIsFetchingPurchaseLimit] = React.useState(false)
  const postImage = post ? `${SERVER_URL}/upload/posting/` + post : DefaultPostingIcon;
  const avatarImage = avatar ? `${SERVER_URL}/upload/avatar/` + avatar : DefaultUserIcon;
  return (
    <>
      <Card
        sx={{
          height: "100%",
          background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
          border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
          borderColor: theme.palette.grey[100],
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {other?.postData?.listing_type !== 'DIGITAL PRODUCT' && <Chip
          size="small"
          label={listingType}
          chipcolor={'warning'}
          sx={{ borderRadius: '0px 4px 4px 0px', textTransform: 'capitalize', position: 'absolute', left: 0, top: "12px" }}
        />}
        {other?.postData?.listing_type === 'DIGITAL PRODUCT' && <span className='btn-shine-parent'>
          <span></span>
          <span></span>
          <div
            className="btn-shine"
            style={{ borderRadius: '4px 0px 0px 4px', textTransform: 'capitalize' }}
          >
            <span>{other?.postData?.listing_type}</span>
          </div>
        </span>}
        {/* {other?.category?.title === 'DIGITAL PRODUCT' && <Chip
        size="small"
        label={other?.category?.title}
        chipcolor={'warning'}
        sx={{ borderRadius: '4px 0px 0px 4px', textTransform: 'capitalize', position: 'absolute', right: 0, top: "12px" }}
      />} */}
        <Box component={(own || (other?.postData?.listing_type === 'DIGITAL PRODUCT') || other?.postData?.listing_type !== 'DIGITAL PRODUCT') ? Link : null} to={`/${userData?.username}/${encodeURIComponent(title)}`}>
          <CardMedia component="img" image={postImage} title={title} sx={{ height: '125px' }} />
        </Box>
        <CardContent sx={{ p: 2, pb: '16px !important' }}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} component={(own || (other?.postData?.listing_type === 'DIGITAL PRODUCT') || other?.postData?.listing_type !== 'DIGITAL PRODUCT') ? Link : null} to={`/${userData?.username}/${encodeURIComponent(title)}`} style={{ textDecoration: 'none' }}>
                  {
                    isTrusted ? (<StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={<FavoriteIcon />}
                    >
                      <Avatar alt={title} src={avatarImage} sx={{ width: 72, height: 72, m: '-50px auto 0' }} />
                    </StyledBadge>) : <Avatar alt={title} src={avatarImage} sx={{ width: 72, height: 72, m: '-50px auto 0' }} />
                  }
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ height: 50 }}>
                  <Typography variant="h4" component={(own || (other?.postData?.listing_type === 'DIGITAL PRODUCT') || other?.postData?.listing_type !== 'DIGITAL PRODUCT') ? Link : null} to={`/${userData?.username}/${encodeURIComponent(title)}`}>
                    {title?.length > 30 ? title.substring(0, 30) + '...' : title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ height: 100 }}>
                  <Typography variant="body2">{description?.length > 100 ? description.substring(0, 100) + '...' : description}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    Price: {other.postData.price} V.H.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} alignItems="center">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    Recently active: {moment(recentlyActive).format('YYYY-MM-DD')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} alignItems="center" display={'flex'} flexDirection={'column'} gap={'15px'}>
              {(other?.postData?.listing_type === 'DIGITAL PRODUCT' && !own) ?
                <Grid item xs={12} justifyContent="center">
                  <LoadingButton
                    disabled={other?.purchasedBy?.includes(user?._id)}
                    variant='contained'
                    onClick={() => {
                      // setPost(post)
                      setIsFetchingPurchaseLimit(true)
                      axios.post(`${SERVER_URL}/api/posting/purchase/getPurchaseLimit`, { postID: id }).then((res) => {
                        if (res.data.success && res.data.trustedBalance > 0) {
                          setTrustedBalance(res.data.trustedBalance)
                          setIsPurchaseModalOpen(true)
                        }
                        else if (res.data.trustedBalance <= 0) {
                          dispatch(openSnackbar({
                            open: true,
                            message: `You do not have a credit line available with ${other?.postData?.userId?.username}`,
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
                    }} sx={{ gap: "5px" }} loading={isFetchingPurchaseLimit}>
                    {other?.purchasedBy?.includes(user?._id) ? "Purchased" : 'Purchase'} <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shopping-cart" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      <path d="M17 17h-11v-14h-2"></path>
                      <path d="M6 5l14 1l-1 7h-13"></path>
                    </svg>
                  </LoadingButton>
                </Grid> : <Grid height={"36px"}></Grid>
              }
              {own ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DeleteWrapper fullWidth onClick={other?.onDelete}>
                      <DeleteIcon />
                    </DeleteWrapper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <EditWrapper fullWidth onClick={other?.onEdit}>
                      <EditIcon />
                    </EditWrapper>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TrustWrapper fullWidth component={Link} to={`/trust/${author}`}>
                      <FavoriteIcon />
                    </TrustWrapper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <PaymentWrapper fullWidth component={Link} to={`/pay/${author}`}>
                      <AccountBalanceWalletOutlined />
                    </PaymentWrapper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MessageWrapper fullWidth component={Link} to={`/personal/message/${author}`}>
                      <ChatIcon />
                    </MessageWrapper>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
          <DialogContentText style={{ fontWeight: "500" }} color='black'>
            Price :{other?.postData?.price} V.H.
          </DialogContentText>
          <br />
          <DialogContentText>
            {`You can purchase this item! You can spend up to ${trustedBalance} village hours with ${other?.postData?.userId?.username}`}
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
              axios.post('/posting/purchase', { _id: other?.postData?._id }).then(res => {
                // console.log(res.data, 'resssss');
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
                  dispatch(other?.filterPost(other?.filterData))
                  init()
                  setTrustedBalance(null)
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
    </>
  );
};

PostingCard.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  profile: PropTypes.string,
  role: PropTypes.string,
  status: PropTypes.string
};

export default PostingCard;

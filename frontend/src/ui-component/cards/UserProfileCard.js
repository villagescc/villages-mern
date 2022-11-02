import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Chip, Grid, Typography } from '@mui/material';

// project imports
import Avatar from '../extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import FavoriteIcon from '@mui/icons-material/Favorite';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ChatIcon from '@mui/icons-material/Chat';

// styles
const TrustWrapper = styled(Button)({
    padding: 8,
    background: 'rgba(242,29,104,0.2)',
    '& svg': {
        color: '#f21d9d'
    },
    '&:hover': {
        background: '#b21df2',
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

// ==============================|| USER PROFILE CARD ||============================== //

const UserProfileCard = ({ avatar, title, post, description }) => {
    const theme = useTheme();
    const postImage = post ? post : 'http://localhost:5000/upload/posting/default.png';
    const avatarImage = avatar ? avatar : 'http://localhost:5000/upload/avatar/default.png';

    return (
        <Card
            sx={{
                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
                borderColor: theme.palette.grey[100],
                textAlign: 'center',
            }}
        >
            <CardMedia component="img" image={postImage} title="Slider5 image" sx={{ height: '125px' }} />
            <CardContent sx={{ p: 2, pb: '16px !important' }}>
                <Grid container spacing={gridSpacing} >
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Avatar alt={title} src={avatarImage} sx={{ width: 72, height: 72, m: '-50px auto 0' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} alignItems="center">
                        <Grid container spacing={1}>
                            <Grid item xs={12} sx={{ height: 50 }}>
                                <Typography variant="h4">{title.length > 30 ? title.substring(0, 30) + "..." : title}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ height: 100 }}>
                                <Typography variant="body2">{description.length > 100 ? description.substring(0, 100) + "..." : description}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TrustWrapper fullWidth>
                                    <FavoriteIcon />
                                </TrustWrapper>
                            </Grid>
                            <Grid item xs={4}>
                                <PaymentWrapper fullWidth>
                                    <CurrencyExchangeIcon />
                                </PaymentWrapper>
                            </Grid>
                            <Grid item xs={4}>
                                <MessageWrapper fullWidth>
                                    <ChatIcon />
                                </MessageWrapper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

UserProfileCard.propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string,
    profile: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string
};

export default UserProfileCard;

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// assets
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
import useAuth from '../../../../hooks/useAuth';
import { Link } from 'react-router-dom';

// ==============================|| LOCALIZATION ||============================== //

const BalanceSection = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        mr: 1,
        [theme.breakpoints.down('md')]: {
          ml: 1
        },
        display: 'flex',
        alignItems: 'center'
      }}
      component={Link}
      to={`/pay/${user?._id}`}
      style={{ textDecoration: 'none' }}
    >
      <AccountBalanceWalletOutlined color={'secondary'} sx={{ marginRight: 1 }} />
      <Typography variant={'h3'} sx={{ marginRight: 1 }} color={'secondary'}>
        {Number(Number(user?.account?.balance).toFixed(2)).toString()}
      </Typography>
      <Typography variant={'h3'}>V.H.</Typography>
    </Box>
  );
};

export default BalanceSection;

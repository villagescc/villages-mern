// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
} from '@mui/material';

// assets
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import useAuth from "../../../../hooks/useAuth";

// ==============================|| LOCALIZATION ||============================== //

const BalanceSection = () => {
  const theme = useTheme();
  const { user } = useAuth();
  console.log("user", user);

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
    >
      <CurrencyExchangeIcon color={'secondary'} sx={{ marginRight: 1 }} />
      <Typography variant={'h3'} sx={{ marginRight: 1 }} color={"secondary"}>
        { user?.account?.balance }
      </Typography>
      <Typography variant={'h3'}>
        V.H.
      </Typography>
    </Box>
  );
};

export default BalanceSection;

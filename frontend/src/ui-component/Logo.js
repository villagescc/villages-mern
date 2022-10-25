// material-ui
import { useTheme } from '@mui/material/styles';
import icon from '../assets/images/logo_full.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return <img src={icon} alt="" />;
};

export default Logo;

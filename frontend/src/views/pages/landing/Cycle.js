import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// material-ui
import { Button, ButtonBase, Container, Grid, Typography } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import imgDemo1 from 'assets/images/landing/img-demo-1.jpg';
import imgDemo2 from 'assets/images/landing/img-demo-2.jpg';
import imgDemo3 from 'assets/images/landing/img-demo-3.jpg';

import cycle from 'assets/images/pages/cycle-of-credit.png';

const imageStyle = {
    width: '100%',
    borderRadius: '12px'
};

// ==============================|| LANDING - DEMOS PAGE ||============================== //

const Cycle = () => {
    const theme = useTheme();

    return (
        <Container>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={5} md={10}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <Typography
                                variant="h2"
                                component="div"
                                sx={{ fontWeight: 400, fontSize: `1.75em`, color: theme.palette.primary.main }}
                            >
                                <strong style={{ fontWeight: `600` }}>Full cycle</strong> of credit
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ maxWidth: `270px`, fontSize: `1.15em` }}>
                                Money is an agreement within a community to encourage collaboration by keeping track of checks and balances.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <img
                        src={cycle}
                        alt="cycle"
                        style={{ margin: `auto`, visibility: `visible`, display: `block`, maxWidth: `100%`, height: `auto` }}
                    ></img>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cycle;

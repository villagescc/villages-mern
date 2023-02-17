// material-ui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import PaletteTwoToneIcon from '@mui/icons-material/PaletteTwoTone';
import ReorderTwoToneIcon from '@mui/icons-material/ReorderTwoTone';
import SpeedTwoToneIcon from '@mui/icons-material/SpeedTwoTone';

import flow_1 from 'assets/images/pages/flow-1.png';
import flow_2 from 'assets/images/pages/flow-2.png';
import flow_3 from 'assets/images/pages/flow-3.png';
import flow_4 from 'assets/images/pages/flow-4.png';
import flow_5 from 'assets/images/pages/flow-5.png';
import flow_6 from 'assets/images/pages/flow-6.png';

// =============================|| LANDING - FEATURE PAGE ||============================= //

const HowItWorks = () => {
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
                                How <strong style={{ fontWeight: `600` }}>it works</strong>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: 'center', fontSize: `1.15em` }}>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid xs={12}>
                                    <img src={flow_1} alt="flow 1" style={{ marginLeft: `18px` }}></img>
                                    <p style={{}}>Sign Up</p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid xs={12}>
                                    <img src={flow_2} alt="flow 2" style={{ marginLeft: `18px` }}></img>
                                    <p style={{}}>Create Profile</p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid xs={12}>
                                    <img src={flow_3} alt="flow 3" style={{ marginLeft: `18px` }}></img>
                                    <p style={{}}>Post an Ad</p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid xs={12}>
                                    <img src={flow_4} alt="flow 4" style={{ marginLeft: `18px` }}></img>
                                    <p style={{}}>Extend your web of trust by inviting and endorsing your friends</p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid xs={12}>
                                    <img src={flow_5} alt="flow 5" style={{ marginLeft: `18px` }}></img>
                                    <p style={{}}>Send credit (IOU's) to those who trust you</p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item lg={2} md={4} sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid xs={12}>
                                    <img src={flow_6} alt="flow 6" style={{ marginLeft: `18px` }}></img>
                                    <p style={{}}>Accept payments from others, to balance your credit</p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HowItWorks;

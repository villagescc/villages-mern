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

import box1 from 'assets/images/pages/box-1.png';
import box2 from 'assets/images/pages/box-2.png';

const imageStyle = {
    width: '100%',
    borderRadius: '12px'
};

// ==============================|| LANDING - DEMOS PAGE ||============================== //

const Hours = () => {
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
                                Villages Hours
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ maxWidth: `270px`, fontSize: `1.15em` }}>
                                Backed by a Sustainable Hour's Wage
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: 'center' }}>
                        <Grid item sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid
                                    xs={12}
                                    sx={{
                                        padding: `3.75em 3em`,
                                        fontSize: `1em`,
                                        border: `3px solid #1695c8`,
                                        display: `flex`,
                                        justifyContent: `space-between`,
                                        alignItems: `center`,
                                        flexFlow: `row wrap`,
                                        height: `100%`
                                    }}
                                >
                                    <img src={box1} alt="box 1" style={{ marginLeft: `18px` }}></img>

                                    <p
                                        style={{
                                            marginBottom: `0`,
                                            color: `#b0b0b0`,
                                            flex: `0 0 60%`,
                                            fontFamily: `"Open Sans", sans-serif`,
                                            lineHeight: `1.5em`
                                        }}
                                    >
                                        A sustainable hour's wage is different in every community but it always remains a stable measure of
                                        value.
                                    </p>
                                    <p
                                        style={{
                                            marginBottom: `0`,
                                            color: `#b0b0b0`,
                                            flex: `0 0 60%`,
                                            fontFamily: `"Open Sans", sans-serif`,
                                            lineHeight: `1.5em`
                                        }}
                                    >
                                        From this base, members negotiate a fair price for their products and services
                                    </p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <FadeInWhenVisible>
                                <Grid
                                    xs={12}
                                    sx={{
                                        padding: `3.75em 3em`,
                                        fontSize: `1em`,
                                        border: `3px solid #1695c8`,
                                        display: `flex`,
                                        justifyContent: `space-between`,
                                        alignItems: `center`,
                                        flexFlow: `row wrap`,
                                        height: `100%`
                                    }}
                                >
                                    <img src={box2} alt="box 2" style={{ marginLeft: `18px` }}></img>

                                    <p
                                        style={{
                                            marginBottom: `0`,
                                            color: `#b0b0b0`,
                                            flex: `0 0 60%`,
                                            fontFamily: `"Open Sans", sans-serif`,
                                            lineHeight: `1.5em`
                                        }}
                                    >
                                        This is an effective and useful complementary currency system that can be used anywhere in the
                                        world.
                                    </p>
                                    <p
                                        style={{
                                            marginBottom: `0`,
                                            color: `#b0b0b0`,
                                            flex: `0 0 60%`,
                                            fontFamily: `"Open Sans", sans-serif`,
                                            lineHeight: `1.5em`
                                        }}
                                    >
                                        What is a sustainable wage in your community?
                                    </p>
                                </Grid>
                            </FadeInWhenVisible>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Hours;

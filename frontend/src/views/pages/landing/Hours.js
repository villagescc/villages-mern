import { Link } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';

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

const Paragraph = styled('p')(({ theme }) => ({
    color: `#b0b0b0`,
    flex: `0 0 60%`,
    fontFamily: `"Open Sans", sans-serif`,
    lineHeight: `1.5em`,
    fontSize: `1.5em`,
    textAlign: `left`,
    marginTop: `0`,
    [theme.breakpoints.down(1140)]: {
        fontSize: `1.4em`
    },
    [theme.breakpoints.down(1025)]: {
        fontSize: `1.25em`
    },
    [theme.breakpoints.down(935)]: {
        textAlign: `center`,
        paddingTop: `1em`,
        flex: `0 0 100%`
    },
    [theme.breakpoints.down(`sm`)]: {
        fontSize: `1em`
    }
}));

const FrameBox = styled(`div`)(({ theme }) => ({
    padding: `3.75em 3em 1.5em 3em`,
    border: `3px solid #1695c8`,
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    flexFlow: `row wrap`,
    height: `100%`,
    [theme.breakpoints.down(935)]: {
        justifyContent: `center`,
        alignItems: `flex-start`
    }
}));

const Divider = styled(`div`)(({ theme }) => ({
    height: `120px`,
    margin: `0 1em`,
    width: `3px`,
    backgroundColor: `#eaeaea`,
    [theme.breakpoints.down(935)]: {
        display: `none`
    }
}));

const Img = styled(`img`)(({ theme }) => ({
    maxWidth: `7.5em`
}));
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
                    <FadeInWhenVisible>
                        <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: 'center' }}>
                            <Grid item sm={6} xs={12}>
                                <FrameBox>
                                    <Img src={box1} alt="box 1"></Img>
                                    <Divider />

                                    <Paragraph>
                                        A sustainable hour's wage is different in every community but it always remains a stable measure of
                                        value.
                                    </Paragraph>
                                    <Paragraph>From this base, members negotiate a fair price for their products and services</Paragraph>
                                </FrameBox>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <FrameBox>
                                    <Img src={box2} alt="box 2"></Img>
                                    <Divider />

                                    <Paragraph>
                                        This is an effective and useful complementary currency system that can be used anywhere in the
                                        world.
                                    </Paragraph>
                                    <Paragraph>What is a sustainable wage in your community?</Paragraph>
                                </FrameBox>
                            </Grid>
                        </Grid>
                    </FadeInWhenVisible>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Hours;

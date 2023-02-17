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

import graph from 'assets/images/pages/social-graph.png';

const imageStyle = {
    width: '100%',
    borderRadius: '12px'
};

// ==============================|| LANDING - DEMOS PAGE ||============================== //

const Graph = () => {
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
                                <strong style={{ fontWeight: `600` }}>Social</strong> Graph
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ maxWidth: `270px`, fontSize: `1.15em` }}>
                                Create your own financial network and watch your web of trust expand.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <img src={graph} alt="cycle" style={{ margin: `auto`, visibility: `visible`, display: `block` }}></img>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Graph;

import PropTypes from 'prop-types';
import CountUp from 'react-countup';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material';

// =============================|| REVENUE CARD ||============================= //

const RevenueCard = ({ primary, secondary, content, iconPrimary, color, loading, decimal }) => {
    const theme = useTheme();
    const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

    return (
        <Card sx={{ background: color, position: 'relative', color: '#fff', height: "100%" }}>
            <CardContent sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row-reverse",
                justifyContent: "center",
            }}>
                <Typography
                    variant="body2"
                    sx={{
                        // position: 'absolute',
                        // right: 13,
                        // top: 14,
                        color: '#fff',
                        '&> svg': { width: 50, height: 50, opacity: '0.5' },
                        [theme.breakpoints.down('sm')]: {
                            top: 13,
                            '&> svg': { width: 80, height: 80 }
                        }
                    }}
                >
                    {primaryIcon}
                </Typography>
                <Grid container direction={matchDownXs ? 'column' : 'row'} spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5" color="inherit">
                            {primary}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" color="inherit">
                            {/* {secondary} */}
                            {loading ? <Skeleton variant="rectangular" width={'70%'} height={25} style={{ background: "rgb(255 255 255 / 10%)" }} /> : <CountUp end={secondary} decimals={decimal ?? 0} />}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="inherit">
                            {content}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

RevenueCard.propTypes = {
    primary: PropTypes.string,
    decimal: PropTypes.number,
    secondary: PropTypes.string,
    content: PropTypes.string,
    iconPrimary: PropTypes.object,
    color: PropTypes.string
};

export default RevenueCard;

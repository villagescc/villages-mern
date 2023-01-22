import PropTypes from 'prop-types';

// material-ui
import {
    Avatar,
    Button,
    CardActions,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

// assets
import DefaultUserIcon from 'assets/images/auth/default.png';
import MainCard from 'ui-component/cards/MainCard';
import { SERVER_URL } from 'config';
// table data
function createData(time, subTime, avatar, name, title, subtext) {
    return { time, subTime, avatar, name, title, subtext };
}

// ==========================|| DATA WIDGET - ACTIVE TICKETS CARD ||========================== //

const PaymentList = ({ title, payments }) => (
    <MainCard title={title} content={false}>
        <CardContent>
            <TableContainer>
                <Table sx={{ minWidth: 560 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }}>Date</TableCell>
                            <TableCell>Payer</TableCell>
                            <TableCell>Recipient</TableCell>
                            <TableCell sx={{ pr: 3 }}>Content</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>
                                    <Typography align="left" component="div" variant="subtitle1">
                                        {row.createdAt}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                        <Grid item>
                                            <Avatar
                                                alt="User 1"
                                                src={
                                                    row?.payer?.profile?.avatar
                                                        ? `${SERVER_URL}/upload/avatar/` + row?.payer?.profile?.avatar
                                                        : DefaultUserIcon
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            <Typography component="div" align="left" variant="subtitle1">
                                                {row?.payer?.username}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>
                                    <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                        <Grid item>
                                            <Avatar
                                                alt="User 1"
                                                src={
                                                    row?.recipient?.profile?.avatar
                                                        ? `${SERVER_URL}/upload/avatar/` + row?.recipient?.profile?.avatar
                                                        : DefaultUserIcon
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            <Typography component="div" align="left" variant="subtitle1">
                                                {row?.recipient?.username}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell sx={{ pr: 3 }}>
                                    <Typography align="left" component="div" variant="subtitle1">
                                        {row?.amount ? row?.amount : 0} {' V.H.'}
                                    </Typography>
                                    <Typography align="left" component="div" variant="subtitle2">
                                        {row?.memo}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CardContent>
    </MainCard>
);

PaymentList.propTypes = {
    title: PropTypes.string
};

export default PaymentList;

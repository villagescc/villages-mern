import React from 'react';
import { Link } from 'react-router-dom';

// material ui
import { Grid, Typography, TableContainer, Table, TableBody, TableRow, TableCell, Chip } from '@mui/material';
import moment from 'moment';

const TransactionDescription = ({ transaction }) => {
  const text = transaction.memo ?? ""
  const urlRegex = /https?:\/\/\S+/;
  const urlMatch = text.match(urlRegex);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableContainer>
          <Table size="medium" aria-label="simple table">
            <TableBody>
              <TableRow sx={{ '& td, & th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="h5">Payer</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    component={Link}
                    to={`/${transaction?.payer?.username}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {transaction?.payer?.username}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& td, & th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="h5">Recipient</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    component={Link}
                    to={`/${transaction?.recipient?.username}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {transaction?.recipient?.username}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& td, & th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="h5">Amount</Typography>
                </TableCell>
                <TableCell>{transaction?.amount} V.H.</TableCell>
              </TableRow>
              <TableRow sx={{ '& td, & th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="h5">Status</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={transaction.status} size="small" />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& td, & th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="h5">Transaction Time</Typography>
                </TableCell>
                <TableCell>{moment(transaction.createdAt).format('YYYY/MM/DD HH:mm:ss')}</TableCell>
              </TableRow>
              <TableRow sx={{ '& td, & th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Typography variant="h5">Description</Typography>
                </TableCell>
                <TableCell>{urlMatch ? <>
                  <p>{text?.slice(0, urlMatch?.index)}</p> <Link to={urlMatch[0]}>{urlMatch[0]}</Link>
                </> : transaction.memo}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default TransactionDescription;

import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { Typography, Link, Grid, Box } from '@mui/material';
import Subtitle from '../components/Subtitle';
import FormattedTypo from '../components/FormattedTypo';
import box1 from 'assets/images/pages/box-1.png';
import box2 from 'assets/images/pages/box-2.png';
import cycle from 'assets/images/pages/cycle-of-credit.png';

const Index = () => {
  return (
    <MainCard title={<Typography variant="h3">How it works</Typography>}>
      <Subtitle title={'1. Endorse'} />
      <FormattedTypo>
        Endorse users you trust to build the trust network. When you endorse someone, it indicates that you trust them to provide value to
        the community.
      </FormattedTypo>
      <FormattedTypo>
        You choose a number of hours credit limit to endorse them with. Each hour allows them and people they trust to send you one hour's
        worth of payment (more on this below). You can also leave a recommendation message for other users to see.
      </FormattedTypo>
      <Subtitle title={'2. Interact'} />
      <FormattedTypo>
        Use the Villages feed to find people and posts that interest you. Put your skills and interests in your profile so others can find
        you. Post items and services you want or have to offer. Meet up to help each other out.
      </FormattedTypo>
      <FormattedTypo>
        Villages helps you find people who have been endorsed by those you trust, so you can feel secure in knowing you are dealing with
        good people. Each user is given a reputation score that helps you know how trustworthy they are based on how well they are connected
        to you in the network. The more ways you are connected, and the more hours credit limit that have been given out as endorsements
        along those paths, the higher the reputation score.
      </FormattedTypo>
      <Subtitle title={'3. Payment'} />
      <FormattedTypo>
        When someone has helped you out, acknowledge that help on Villages. Villages payments are a currency denominated credit limit (In
        Village hours), consisting of gentle promises made to the person who helped you out to return the favour at some point in the
        future. When you have received a payment, you can spend them to acknowledge others without having to issue any promises of your own.
      </FormattedTypo>
      <FormattedTypo>
        If there is a connection through the trust network from you to the person you're paying, Villages can transmit the payment through
        the network using <Link href={'hhttps://rumplepay.com/'}>RumplePay</Link>, so that the person who helped you, receives your payment
        as promises from someone they have endorsed, and your promises go to someone who has endorsed you.
      </FormattedTypo>
      <FormattedTypo>
        Sometimes you will be on a path connecting another person to someone they're paying. For example, your friend Anne, who you have
        endorsed, might want to pay Bob, who has endorsed you, but does not know Anne. In this case, the system will find the path from Anne
        to you to Bob, and record the payment as Anne paying you, and you paying Bob.
      </FormattedTypo>
      <FormattedTypo>
        Anne's payment might not have meant that much to Bob, since he doesn't know her. Anne's payment has meaning to you, however, since
        you have endorsed her, and your payment has meaning to Bob, since you have endorsed him.
      </FormattedTypo>
      <img alt={'paradigm'} src={cycle} style={{ width: '100%' }} />
      <Box sx={{ backgroundColor: '#f6f6f6', paddingTop: '3em' }}>
        <Subtitle title={'VILLAGES HOURS'} />
        <Typography
          align={'center'}
          sx={{
            marginBottom: '3em',
            fontSize: '1.125em',
            color: '#7d7d7d',
            maxWidth: '260px'
          }}
        >
          Backed by a Sustainable Hour's Wage
        </Typography>
        <Grid container spacing={2} justifyContent={'space-around'}>
          <Grid item xs={12} sm={6}>
            <Grid container alignItems={'center'} sx={{ border: '2px solid #1695c8', padding: '2em', minHeight: '457px' }}>
              <Grid item xs={10} sm={4}>
                <img src={box1} alt={'first'} />
              </Grid>
              <Grid item xs={2} sm={1}>
                {' '}
                <div style={{ height: '120px', margin: '0 1em', width: '3px', backgroundColor: '#eaeaea' }}></div>
              </Grid>

              <Grid item xs={12} sm={7}>
                <Typography align={'center'} sx={{ fontSize: '1.3em' }}>
                  A sustainable hour's wage is different in every community but it always remains a stable measure of value.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={7}>
                <Typography align={'center'} sx={{ fontSize: '1.2em' }}>
                  From this base, members negotiate a fair price for their products and services
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container alignItems={'center'} sx={{ border: '2px solid #1695c8', padding: '2em', minHeight: '457px' }}>
              <Grid item xs={10} sm={11}>
                <img src={box2} alt={'second'} />
              </Grid>
              <Grid item xs={2} sm={1}>
                {' '}
                <div style={{ height: '120px', margin: '0 1em', width: '3px', backgroundColor: '#eaeaea' }}></div>
              </Grid>

              <Grid item xs={12} sm={7}>
                <Typography align={'center'} sx={{ fontSize: '1.2em' }}>
                  This is an effective and useful complementary currency system that can be used anywhere in the world. What is a
                  sustainable wage in your community?
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
};

export default Index;

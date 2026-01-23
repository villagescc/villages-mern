// material-ui
import { styled } from '@mui/material/styles';

// project imports
import Header from './Header';
import HowItWorks from './How-it-works';
import Cycle from './Cycle';
import Hours from './Hours';
import Subscribe from './Subscribe';
import Footer from './Footer';
import AppBar from 'ui-component/extended/AppBar';

const HeaderWrapper = styled('div')(({ theme }) => ({
  paddingTop: 64,
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    paddingTop: 56,
  },
}));

// =============================|| LANDING MAIN ||============================= //

const Landing = () => (
  <>
    <HeaderWrapper id="home">
      <AppBar />
      <Header />
    </HeaderWrapper>
    <HowItWorks />
    <Cycle />
    <Hours />
    <Subscribe />
    <Footer />
  </>
);

export default Landing;
